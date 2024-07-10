import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import type { ModelEntryType } from './umbnav-group.js';
import { Guid } from "guid-typescript";

import './umbnav-group.js';
import UmbNavGroup from './umbnav-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export default class UmbNavSorterPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    groupOneItems: ModelEntryType[] = [
		{
			key: Guid.create().toString(),
			label: 'Apple',
			children: [
				{
					key: Guid.create().toString(),
					label: 'Juice',
					children: [
						{
							key: Guid.create().toString(),
							label: 'Juice',
							children: []
						},
						{
							key: Guid.create().toString(),
							label: 'Milk',
							children: []
						},
					]
				},
				{
					key: Guid.create().toString(),
					label: 'Milk',
					children: []
				},
			],
		},
		{
			key: Guid.create().toString(),
			label: 'Banana',
			children: [],
		},
		{
			key: Guid.create().toString(),
			label: 'Pear',
			children: []
		},
		{
			key: Guid.create().toString(),
			label: 'Pineapple',
			children: []
		},
		{
			key: Guid.create().toString(),
			label: 'Lemon',
			children: [
				{
					key: Guid.create().toString(),
					label: 'Cola',
					children: []
				},
				{
					key: Guid.create().toString(),
					label: 'Pepsi',
					children: []
				},
			],
		},
	];

    render() {
        return html`
<umbnav-group
						.value=${this.groupOneItems}
						@change=${(e: Event) => {
							this.groupOneItems = (e.target as UmbNavGroup).value;
						}}></umbnav-group>
		`;
    }

    static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding: var(--uui-size-layout-1);
			}

			.outer-wrapper {
				display: flex;
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