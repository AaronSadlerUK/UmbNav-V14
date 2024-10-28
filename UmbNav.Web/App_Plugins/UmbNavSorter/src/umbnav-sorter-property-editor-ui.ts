import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, html, customElement, LitElement, property} from '@umbraco-cms/backoffice/external/lit';
import {UmbPropertyEditorUiElement} from "@umbraco-cms/backoffice/property-editor";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import {Guid} from "guid-typescript";

import './umbnav-group.js';
import type {UmbNavGroup, ModelEntryType} from './umbnav-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export class UmbNavSorterPropertyEditorUIElement extends UmbElementMixin(LitElement) implements UmbPropertyEditorUiElement {

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

    render() {
        return html`
            <div class="outer-wrapper">
                <umbnav-group
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
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-sorter-property-editor-ui': UmbNavSorterPropertyEditorUIElement;
    }
}