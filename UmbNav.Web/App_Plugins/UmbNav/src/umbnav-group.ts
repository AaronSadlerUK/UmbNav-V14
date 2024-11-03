import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, customElement, html, LitElement, property, repeat, state} from '@umbraco-cms/backoffice/external/lit';
import {UmbElementMixin} from '@umbraco-cms/backoffice/element-api';
import {UmbSorterController} from '@umbraco-cms/backoffice/sorter';
import {UMB_LINK_PICKER_MODAL, UmbLinkPickerLink,} from '@umbraco-cms/backoffice/multi-url-picker';
import './umbnav-item.ts';
import UmbNavItem from './umbnav-item.ts';
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext,} from '@umbraco-cms/backoffice/modal';
import {v4 as uuidv4} from 'uuid';
import {
    UmbPropertyValueChangeEvent,
    UmbPropertyEditorConfigProperty
} from "@umbraco-cms/backoffice/property-editor";
import {DocumentService, MediaService} from '@umbraco-cms/backoffice/external/backend-api';
import {UMBNAV_TEXT_ITEM_MODAL} from "./modals/text-item-modal-token.ts";
import {UmbNavType} from "./umbnav.token.ts";

@customElement('umbnav-group')
export class UmbNavGroup extends UmbElementMixin(LitElement) {
    #modalContext?: UmbModalManagerContext;

    //
    // Sorter setup:
    #sorter = new UmbSorterController<UmbNavType, UmbNavItem>(this, {
        getUniqueOfElement: (element) => {
            return element.key;
        },
        getUniqueOfModel: (modelEntry) => {
            return modelEntry.key;
        },
        identifier: 'umbnav-identifier',
        itemSelector: 'umbnav-item',
        containerSelector: '.umbnav-container',
        onChange: ({model}) => {
            const oldValue = this._value;
            this._value = model;
            this.requestUpdate('value', oldValue);
            this.#dispatchChangeEvent();
        },
    });

    @property({type: Array})
    config: Array<UmbPropertyEditorConfigProperty> = [];

    @property({type: Boolean, reflect: true})
    nested: boolean = false;

    @property({type: Array, attribute: false})
    public get value(): UmbNavType[] {
        return this._value ?? [];
    }

    @state()
    public get enableTextItems(): Boolean {
        return <Boolean>this.config.find(item => item.alias === 'enableTextItems')?.value ?? false;
    }

    public set value(value: UmbNavType[]) {
        const oldValue = this._value;
        this._value = value;
        this.#sorter.setModel(this._value);
        this.requestUpdate('value', oldValue);
    }

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this.#modalContext = _instance;
        });
    }

    @state()
    private _value?: UmbNavType[];

    removeItem = (event: CustomEvent<{ key: string }>) => {
        const {key} = event.detail;

        const removeItemRecursive = (list: any[], key: string): any[] => {
            return list.filter((item) => {
                if (item.key === key) {
                    return false;
                }
                if (item.children) {
                    item = {...item, children: removeItemRecursive(item.children, key)};
                }
                return true;
            });
        };

        this.value = removeItemRecursive(this.value, key);
        this.#dispatchChangeEvent();
    };

    toggleNode(event: CustomEvent<{ expanded: boolean; key: string }>) {
        const {expanded, key} = event.detail;
        this.value = this.updateExpandedInNested(this.value, key, expanded);
    }

    updateExpandedInNested(arr: UmbNavType[], key: string, expanded: boolean) {
        return arr.map(item => {
            // If the current item's key matches, update its expanded property
            if (item.key === key) {
                return {...item, expanded: expanded};
            }

            // If the item has children, recursively search within them
            if (item.children && item.children.length > 0) {
                const updatedChildren: UmbNavType[] = this.updateExpandedInNested(item.children, key, expanded);

                // Only return a new object if children were updated
                if (updatedChildren !== item.children) {
                    return {...item, children: updatedChildren};
                }
            }

            // Return the original item if no changes were made
            return item;
        });
    }

    toggleLinkPickerEvent(event: CustomEvent<{ key: string | null | undefined }>) {
        if (this.value.find(item => item.key === event.detail.key && item.itemType === "title")) {
            this.toggleTextModal(event.detail.key);
        } else {
            this.toggleLinkPicker(event.detail.key);
        }
    }

    async toggleTextModal(key: string | null | undefined) {
        let item: UmbNavType = {
            key: key,
            name: '',
            itemType: 'title',
            icon: 'icon-tag',
            udi: null,
            url: null,
            anchor: null,
            description: null,
            children: []
        }

        if (key != null) {
            item = this.findItemByKey(key, this.value) as UmbNavType;
        }

        const modalHandler = this.#modalContext?.open(this, UMBNAV_TEXT_ITEM_MODAL, {
            data: {
                key: key,
                headline: 'Add text item',
                name: item.name
            }
        });

        const data = await modalHandler?.onSubmit().catch(() => undefined);
        if (!modalHandler) return;
        if (!data) return;

        // @ts-ignore
        let menuItem: UmbNavType = {
            ...data,
        };

        if (this.value && this.value?.find(item => item.key === key)) {
            this.updateItem(menuItem);
        } else {
            menuItem.key = uuidv4().replace(/-/g, '');
            this.addItem(menuItem);
        }
    }

    async toggleLinkPicker(key: string | null | undefined, siblingKey?: string | null | undefined) {

        try {
            let item: UmbLinkPickerLink = {
                name: '',
                url: '',
                icon: '',
                type: null,
                target: '',
                published: false,
                unique: '',
                queryString: ''
            };
            if (key != null) {
                const umbNavItem = this.findItemByKey(key, this.value);
                item = this.convertToUmbLinkPickerLink(<UmbNavType>umbNavItem);
            }

            const modalHandler = this.#modalContext?.open(this, UMB_LINK_PICKER_MODAL, {
                data: {
                    config: {},
                    index: null,
                },
                value: {
                    link: item
                }
            });

            const result = await modalHandler?.onSubmit().catch(() => undefined);
            if (!modalHandler) return;
            if (!result?.link) return;

            let menuItem = result.link;

            if (result.link.type === "external") {
                menuItem = {
                    ...menuItem,
                    icon: "icon-link"
                };
            }

            if (result.link.type === "media") {
                let media = await this.#getMedia(result.link.unique);

                if (media != null) {
                    menuItem = {
                        ...menuItem,
                        name: menuItem.name ? menuItem.name : null
                    };
                }
            }

            if (result.link.type === "document") {
                let document = await this.#getDocument(result.link.unique);

                if (document != null) {
                    menuItem = {
                        ...menuItem,
                        name: menuItem.name ? menuItem.name : null
                    };
                }
            }

            if (result.link.type === null) {
                menuItem = {
                    ...menuItem,
                    icon: "icon-unlink"
                };
            }

            if (this.value.find(item => item.key === key)) {
                this.updateItem(this.convertToUmbNavLink(menuItem, key));
            } else {
                this.addItem(this.convertToUmbNavLink(menuItem, null), siblingKey);
            }
        } catch (error) {
            console.error(error);
        }
    }

    addItem(newItem: UmbNavType, siblingKey?: string | null | undefined): void {
        let newValue = [...this.value];

        if (siblingKey) {
            const siblingIndex = newValue.findIndex(item => item.key === siblingKey);
            if (siblingIndex !== -1) {
                newValue.splice(siblingIndex, 0, newItem);
            } else {
                newValue.push(newItem);
            }
        } else {
            newValue.push(newItem);
        }

        this.value = newValue;
        this.#dispatchChangeEvent();
    }

    updateItem(updatedItem: UmbNavType): void {
        const updateItemRecursive = (list: UmbNavType[], key: string): UmbNavType[] => {
            return list.map(item => {
                if (item.key === key) {
                    return {...item, ...updatedItem};
                }
                if (item.children) {
                    item = {...item, children: updateItemRecursive(item.children, key)};
                }
                return item;
            });
        };

        this.value = updateItemRecursive(this.value, updatedItem.key!);
        this.#dispatchChangeEvent();
    }

    findItemByKey(key: string, items: UmbNavType[]): UmbNavType | undefined {
        for (const item of items) {
            if (item.key === key) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const found = this.findItemByKey(key, item.children);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }

    convertToUmbLinkPickerLink(item: UmbNavType): UmbLinkPickerLink {
        return {
            name: item.name,
            url: item.url,
            icon: item.icon,
            // @ts-ignore
            type: item.itemType,
            target: item.target,
            unique: item.udi,
            queryString: item.anchor
        };
    }

    convertToUmbNavLink(item: UmbLinkPickerLink, key: string | null | undefined): UmbNavType {
        return {
            key: key ?? uuidv4().replace(/-/g, ''),
            name: item.name,
            url: item.url,
            icon: item.icon,
            itemType: item.type,
            target: item.target,
            udi: item.unique != null && item.unique.length > 0 ? item.unique : null,
            anchor: item.queryString,
            description: item.url,
            children: []
        };
    }

    async #dispatchChangeEvent() {
        await this.#getMenuItemInfo(this._value);
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    newNode(siblingKey?: string | null | undefined): void {
        this.toggleLinkPicker(null, siblingKey);
        this.requestUpdate();
    }

    async #getDocument(entityKey: string | undefined | null) {
        if (!entityKey) return;
        // Should this be done here or in the action file?
        const data = await DocumentService.getDocumentById({id: entityKey});
        if (!data) return;
        //TODO How do we ensure we get the correct variant?
        return data;

    }

    async #getMedia(entityKey: string | undefined | null) {
        if (!entityKey) return;
        // Should this be done here or in the action file?
        const data = await MediaService.getMediaById({id: entityKey});
        if (!data) return;
        //TODO How do we ensure we get the correct variant?
        return data;

    }

    async #getMenuItemInfo(menuItems: UmbNavType[] | undefined) {
        if (!menuItems) return;

        let newValue = [...menuItems];
        const processedUdis = new Set<string>();

        for (let i = 0; i < newValue.length; i++) {
            let element = newValue[i];
            if (element.udi && processedUdis.has(element.udi)) {
                continue;
            }

            if (element.itemType === 'media') {
                let media = await this.#getMedia(element.udi);

                if (media != null) {
                    newValue = newValue.map(item => {
                        if (item.udi === element.udi) {
                            return {
                                ...item,
                                name: item.name ? item.name : media.variants[0].name,
                                icon: media.mediaType.icon,
                                description: media.values.length > 0 ? (media.values[0].value as {
                                    src: string
                                }).src : null,
                                url: media.values.length > 0 ? (media.values[0].value as { src: string }).src : null
                            };
                        }
                        return item;
                    });
                    if (element.udi != null) {
                        processedUdis.add(element.udi);
                    }
                }
            } else if (element.itemType === 'document') {
                let document = await this.#getDocument(element.udi);

                if (document != null) {
                    newValue = newValue.map(item => {
                        if (item.udi === element.udi) {
                            return {
                                ...item,
                                name: item.name ? item.name : document.variants[0].name,
                                icon: document.documentType.icon,
                                description: document.urls.length > 0 ? document.urls[0].url : null,
                                url: document.urls.length > 0 ? document.urls[0].url : null,
                                published: document.variants[0].state === "Published"
                            };
                        }
                        return item;
                    });
                    if (element.udi != null) {
                        processedUdis.add(element.udi);
                    }
                }
            }
        }

        this.value = newValue;
    }

    async firstUpdated() {

        if (this._value != undefined && this._value.length > 0) {
            await this.#getMenuItemInfo(this._value);
            this.requestUpdate();
        }

        this.style.setProperty('interpolate-size', 'allow-keywords');
    }

    override render() {
        return html`
            <div class="umbnav-container ${this.nested ? 'margin-left' : ''}">
                ${repeat(
                        this.value,
                        // Note: ideally you have an unique identifier for each item, but for this example we use the `name` as identifier.
                        (item) => item.key,
                        (item) =>
                                html`
                                    <uui-button-inline-create
                                            @click=${() => this.newNode(item.key)}></uui-button-inline-create>
                                    <umbnav-item name=${item.name} key=${item.key} class=""
                                                 description="${item.description}"
                                                 icon="${item.icon}"
                                                 ?unpublished=${!item.published && item.itemType === "document"}
                                                 @toggle-children-event=${this.toggleNode}
                                                 @edit-node-event=${this.toggleLinkPickerEvent}
                                                 @remove-node-event=${this.removeItem}>
                                        <umbnav-group
                                                ?nested=${true}
                                                class="${item.expanded ? 'expanded' : 'collapsed'}"
                                                .config=${this.config}
                                                @change=${(e: Event) => {
                                                    item = {...item, children: (e.target as UmbNavGroup).value};
                                                }}></umbnav-group>
                                    </umbnav-item>
                                `,
                )}

                <uui-button-group>
                    ${this.enableTextItems ? html`
                        <uui-button label="Add Text Item" look="placeholder" class="add-menuitem-button"
                                    @click=${() => this.toggleTextModal(null)}></uui-button>
                    ` : ''}
                    <uui-button label="Add Link Item" look="placeholder" class="add-menuitem-button"
                                @click=${() => this.newNode()}></uui-button>
                </uui-button-group>
            </div>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
            :root {
                interpolate-size: allow-keywords;
            }

            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                border-radius: calc(var(--uui-border-radius) * 2);
            }

            .umbnav-container {
                display: grid;
                gap: 1px;
            }

            //*********** */

            umbnav-group {
                outline: 1px solid red;
            }

            .collapsed {
                //display: none;
                block-size: 0;
                overflow: clip;
                visibility: hidden;
                opacity: 0;
                transition: block-size 0.5s ease, visibility 0.5s ease, opacity 0.5s ease;
            }

            .expanded {
                display: flex;
                block-size: auto;
                visibility: visible;
                opacity: 1;
                transition: block-size 0.5s ease, visibility 0.5s ease, opacity 0.5s ease;
            }

            .margin-left {
                margin-left: var(--uui-size-space-5);
            }

            .add-menuitem-button {
                padding-top: 1px;
                padding-bottom: 3px;
            }
        `,
    ];
}

export default UmbNavGroup;

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-group': UmbNavGroup;
    }
}