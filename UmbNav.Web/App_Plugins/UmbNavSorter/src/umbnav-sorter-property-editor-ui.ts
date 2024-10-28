import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, html, customElement, LitElement, property, state} from '@umbraco-cms/backoffice/external/lit';
import {UmbPropertyEditorUiElement} from "@umbraco-cms/backoffice/extension-registry";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
// import { UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
// import { UMB_LINK_PICKER_MODAL } from "@umbraco-cms/backoffice/multi-url-picker";
import {UMB_LINK_PICKER_MODAL, UmbLinkPickerLink} from '@umbraco-cms/backoffice/multi-url-picker';
import {UMB_MODAL_MANAGER_CONTEXT} from '@umbraco-cms/backoffice/modal';
import {UmbPropertyValueChangeEvent} from "@umbraco-cms/backoffice/property-editor";
import {extractUmbColorVariable} from "@umbraco-cms/backoffice/resources";
import {Guid} from "guid-typescript";

import './umbnav-group.js';
import type {UmbNavGroup, ModelEntryType} from './umbnav-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export class UmbNavSorterPropertyEditorUIElement extends UmbElementMixin(LitElement) implements UmbPropertyEditorUiElement {
    // private _modalContext?: UmbModalManagerContext;

    @property({type: Array})
    groupOneItems: ModelEntryType[] = [
        {
            key: Guid.create().toString(),
            name: 'Apple',
            description: 'https://www.apple.com/',
            url: 'https://www.apple.com/',
            icon: 'icon-smiley color-pink',
            itemType: "external",
            udi: null,
            anchor: '',
            published: true,
            naviHide: false,
            culture: null,
            target: '_blank',
            id: 1234,
            children: [
                {
                    key: Guid.create().toString(),
                    name: 'Juice',
                    description: '/juice/',
                    url: '/juice/',
                    icon: 'icon-document',
                    itemType: "document",
                    udi: 'umb://document/1234567890',
                    anchor: '',
                    published: true,
                    naviHide: false,
                    culture: null,
                    id: 1234,
                    children: [
                        {
                            key: Guid.create().toString(),
                            name: 'Juice 2',
                            description: '/juice-2/',
                            url: '/juice-2/',
                            icon: 'icon-document',
                            itemType: "document",
                            udi: 'umb://document/1234567890',
                            anchor: '',
                            published: true,
                            naviHide: false,
                            culture: null,
                            id: 1234,
                            children: [],
                            expanded: false
                        },
                        {
                            key: Guid.create().toString(),
                            name: 'Milk',
                            description: '/milk/',
                            url: '/milk/',
                            icon: 'icon-document',
                            itemType: "document",
                            udi: 'umb://document/1234567890',
                            anchor: '',
                            published: true,
                            naviHide: false,
                            culture: null,
                            id: 1234,
                            children: [],
                            expanded: false
                        },
                    ],
                    expanded: false
                },
                {
                    key: Guid.create().toString(),
                    name: 'Milk 2',
                    description: '/milk-2/',
                    url: '/milk-2/',
                    icon: 'icon-document',
                    itemType: "document",
                    udi: 'umb://document/1234567890',
                    anchor: '',
                    published: true,
                    naviHide: false,
                    culture: null,
                    id: 1234,
                    children: [],
                    expanded: false
                },
            ],
            expanded: false
        },
        {
            key: Guid.create().toString(),
            name: 'Banana',
            description: '/banana/',
            url: '/banana/',
            icon: 'icon-document',
            itemType: "document",
            udi: 'umb://document/1234567890',
            anchor: '',
            published: true,
            naviHide: false,
            culture: null,
            id: 1234,
            children: [],
            expanded: false
        },
        {
            key: Guid.create().toString(),
            name: 'Pear',
            description: '/pear/',
            url: '/pear/',
            icon: 'icon-document',
            itemType: "document",
            udi: 'umb://document/1234567890',
            anchor: '',
            published: true,
            naviHide: false,
            culture: null,
            id: 1234,
            children: [],
            expanded: false
        },
        {
            key: Guid.create().toString(),
            name: 'Pineapple',
            description: '/pineapple/',
            url: '/pineapple/',
            icon: 'icon-document',
            itemType: "document",
            udi: 'umb://document/1234567890',
            anchor: '',
            published: true,
            naviHide: false,
            culture: null,
            id: 1234,
            children: [],
            expanded: false
        },
        {
            key: Guid.create().toString(),
            name: 'Lemon',
            description: '/lemon/',
            url: '/lemon/',
            icon: 'icon-document',
            itemType: "document",
            udi: 'umb://document/1234567890',
            anchor: '',
            published: true,
            naviHide: false,
            culture: null,
            id: 1234,
            children: [
                {
                    key: Guid.create().toString(),
                    name: 'Cola',
                    description: '/cola/',
                    url: '/cola/',
                    icon: 'icon-document',
                    itemType: "document",
                    udi: 'umb://document/1234567890',
                    anchor: '',
                    published: true,
                    naviHide: false,
                    culture: null,
                    id: 1234,
                    children: [],
                    expanded: false
                },
                {
                    key: Guid.create().toString(),
                    name: 'Pepsi',
                    description: '/pepsi/',
                    url: '/pepsi/',
                    icon: 'icon-document',
                    itemType: "document",
                    udi: 'umb://document/1234567890',
                    anchor: '',
                    published: true,
                    naviHide: false,
                    culture: null,
                    id: 1234,
                    children: [],
                    expanded: false
                },
            ],
            expanded: false
        },
    ];

    @property({type: String})
    public set value(value: string) {
        this._value = value;
        if (this.value != "" && this.value != undefined) {
            var stringArray = this.value.split(/(\s+)/);
            this.icon = stringArray[0];
            if (stringArray.length > 1) {
                this.color = stringArray[2];
            }
        }
    }

    public get value(): string {
        return this._value;
    }

    _value = '';

    @state()
    color = '';

    @state()
    icon = '';

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            // this._modalContext = _instance;
        });
    }

    async toggleLinkPicker(event: CustomEvent<{ key: string }>) {
        console.log(event.detail)
        const item = this.findItemByKey(event.detail.key, this.groupOneItems);
        console.log(item);
        const convertedItem = this.convertToUmbLinkPickerLink(<ModelEntryType>item);
        console.log(convertedItem)

        const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
        const modalHandler = modalManager.open(this, UMB_LINK_PICKER_MODAL, {
            data: {
                config: {},
                index: null,
            },
            value: {
                link: convertedItem
            }
        });

        if (!modalHandler) return;
        this.#dispatchChangeEvent();
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

    render() {
        return html`
            <div class="outer-wrapper">
                <umbnav-group
                        @edit-node-event=${this.toggleLinkPicker}
                        .value=${this.groupOneItems}
                        @change=${(e: Event) => {
                            this.groupOneItems = (e.target as UmbNavGroup).value;
                        }}></umbnav-group>
            </div>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
            .outer-wrapper {
                display: grid;
                gap: var(--uui-size-layout-1);
            }
        `,
    ];

    #dispatchChangeEvent() {
        this.value = this.icon + " " + this.color;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-sorter-property-editor-ui': UmbNavSorterPropertyEditorUIElement;
    }
}