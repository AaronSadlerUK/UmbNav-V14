import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {
    css,
    html,
    customElement,
    LitElement,
    repeat,
    property
} from '@umbraco-cms/backoffice/external/lit';
import {UmbElementMixin} from '@umbraco-cms/backoffice/element-api';
import {UmbSorterController} from '@umbraco-cms/backoffice/sorter';
import {UMB_LINK_PICKER_MODAL, UmbLinkPickerLink} from '@umbraco-cms/backoffice/multi-url-picker';
import './umbnav-item.ts';
import UmbNavItem from './umbnav-item.ts';
import {UmbLinkPickerLinkType} from "@umbraco-cms/backoffice/multi-url-picker";
import {UMB_MODAL_MANAGER_CONTEXT} from '@umbraco-cms/backoffice/modal';
import {Guid} from "guid-typescript";
import {UmbPropertyValueChangeEvent} from "@umbraco-cms/backoffice/property-editor";

export type ModelEntryType = {
    key: string | null | undefined;
    name: string | null | undefined;
    description?: string | null | undefined,
    url: string | null | undefined,
    icon: string | null | undefined,
    itemType: UmbLinkPickerLinkType | null | undefined,
    udi: string | null | undefined,
    anchor: string | null | undefined,
    published: boolean | null | undefined,
    naviHide?: boolean | null | undefined,
    culture?: string | null | undefined,
    id?: number | null | undefined,
    children?: ModelEntryType[];
    expanded?: boolean;
    target?: string | null | undefined
};

@customElement('umbnav-group')
export class UmbNavGroup extends UmbElementMixin(LitElement) {
    //
    // Sorter setup:
    #sorter = new UmbSorterController<ModelEntryType, UmbNavItem>(this, {
        getUniqueOfElement: (element) => {
            return element.name;
        },
        getUniqueOfModel: (modelEntry) => {
            return modelEntry.name;
        },
        identifier: 'umbnav-identifier',
        itemSelector: 'umbnav-item',
        containerSelector: '.umbnav-container',
        onChange: ({model}) => {
            const oldValue = this._value;
            this._value = model;
            this.requestUpdate('value', oldValue);
            // Fire an event for the parent to know that the model has changed.
            this.dispatchEvent(new CustomEvent('change'));
        },
    });

    @property({type: Boolean, reflect: true})
    nested: boolean = false;

    @property({type: Array, attribute: false})
    public get value(): ModelEntryType[] {
        return this._value ?? [];
    }

    public set value(value: ModelEntryType[]) {
        const oldValue = this._value;
        this._value = value;
        this.#sorter.setModel(this._value);
        this.requestUpdate('value', oldValue);
    }

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            // this._modalContext = _instance;
        });
    }

    private _value?: ModelEntryType[];

    removeItem = (event: CustomEvent<{ key: string }>) => {
        const {key} = event.detail;

        const removeItemRecursive = (list: any[], key: string): any[] => {
            return list.filter((item) => {
                if (item.key === key) {
                    return false;
                }
                if (item.children) {
                    item.children = removeItemRecursive(item.children, key);
                }
                return true;
            });
        };

        this.value = removeItemRecursive(this.value, key);
    };

    toggleNode(event: CustomEvent<{ expanded: boolean; key: string }>) {
        console.log(this.value)
        const {expanded, key} = event.detail;
        var newValue = this.updateExpandedInNested(this.value, key, expanded);
        this.value = newValue;
    }

    updateExpandedInNested(arr: ModelEntryType[], key: string, expanded: boolean) {
        return arr.map(item => {
            // If the current item's key matches, update its expanded property
            if (item.key === key) {
                return {...item, expanded: expanded};
            }

            // If the item has children, recursively search within them
            if (item.children && item.children.length > 0) {
                const updatedChildren: ModelEntryType[] = this.updateExpandedInNested(item.children, key, expanded);

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
        this.toggleLinkPicker(event.detail.key);
    }

    async toggleLinkPicker(key: string | null | undefined, parentKey?: string | null | undefined, siblingKey?: string | null | undefined) {

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
                console.log(umbNavItem);
                item = this.convertToUmbLinkPickerLink(<ModelEntryType>umbNavItem);
                console.log(item)
            }

            const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
            const modalHandler = modalManager.open(this, UMB_LINK_PICKER_MODAL, {
                data: {
                    config: {},
                    index: null,
                },
                value: {
                    link: item
                }
            });

            const result = await modalHandler.onSubmit().catch(() => undefined);
            if (!result?.link) return;

            console.log("modaldata:" + result.link)

            let menuItem = result.link;

            if (result.link.type === "external") {
                menuItem = {
                    ...menuItem,
                    icon: "icon-link"
                };
            }

            if (this.value.find(item => item.key === key)) {
                this.updateItem(this.convertToUmbNavLink(menuItem, key));
            } else {
                this.addItem(this.convertToUmbNavLink(menuItem, null), parentKey, siblingKey);
            }

            if (!modalHandler) return;
            this.#dispatchChangeEvent();
        } catch (error) {
            console.error(error);
        }
    }

    addItem(newItem: ModelEntryType, parentKey?: string | null | undefined, siblingKey?: string | null | undefined): void {
        let newValue = this.value;

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
        this.requestUpdate(); // Notify LitElement to re-render
    }

    updateItem(updatedItem: ModelEntryType): void {
        const updateItemRecursive = (list: ModelEntryType[], key: string): ModelEntryType[] => {
            return list.map(item => {
                if (item.key === key) {
                    return {...item, ...updatedItem};
                }
                if (item.children) {
                    item.children = updateItemRecursive(item.children, key);
                }
                return item;
            });
        };

        this.value = updateItemRecursive(this.value, updatedItem.key!);
        this.requestUpdate(); // Notify LitElement to re-render
    }

    findItemByKey(key: string, items: ModelEntryType[]): ModelEntryType | undefined {
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

    convertToUmbLinkPickerLink(item: ModelEntryType): UmbLinkPickerLink {
        return {
            name: item.name,
            url: item.url,
            icon: item.icon,
            type: item.itemType,
            target: item.target,
            published: item.published,
            unique: item.udi,
            queryString: item.anchor
        };
    }

    convertToUmbNavLink(item: UmbLinkPickerLink, key: string | null | undefined): ModelEntryType {
        return {
            key: key ?? Guid.create().toString(),
            name: item.name,
            url: item.url,
            icon: item.icon,
            itemType: item.type,
            target: item.target,
            published: item.published,
            udi: item.unique != null && item.unique.length > 0 ? item.unique : null,
            anchor: item.queryString,
            description: item.url,
        };
    }

    #dispatchChangeEvent() {
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    newNode(parentKey?: string | null | undefined, siblingKey?: string | null | undefined): void {
        this.toggleLinkPicker(null, parentKey, siblingKey);
        this.requestUpdate();
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
                                            @click=${() => this.newNode(null, item.key)}></uui-button-inline-create>
                                    <umbnav-item name=${item.name} key=${item.key} class=""
                                                 description="${item.description}"
                                                 icon="${item.icon}"
                                                 @toggle-children-event=${this.toggleNode}
                                                 @edit-node-event=${this.toggleLinkPickerEvent}
                                                 @remove-node-event=${this.removeItem}>
                                        <umbnav-group
                                                ?nested=${true}
                                                class="${item.expanded ? 'expanded' : 'collapsed'}"
                                                .value=${item.children ?? []}
                                                @change=${(e: Event) => {
                                                    item.children = (e.target as UmbNavGroup).value;
                                                }}></umbnav-group>
                                    </umbnav-item>
                                `,
                )}
                <uui-button label="Add Menu Item" look="placeholder" class="add-menuitem-button"
                            @click=${() => this.newNode()}></uui-button>
            </div>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
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

            .expanded {
                display: flex;
            }

            .margin-left {
                margin-left: var(--uui-size-space-5);
            }

            .add-menuitem-button {
                padding-top: 1px;
                padding-bottom: 3px;
            }

            .collapsed {
                display: none;
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