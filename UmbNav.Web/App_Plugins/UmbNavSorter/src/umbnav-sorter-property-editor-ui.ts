import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { Guid } from "guid-typescript";

import './umbnav-group.js';
import type { UmbNavGroup, ModelEntryType } from './umbnav-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export default class UmbNavSorterPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
	@property({ type: Array })
    groupOneItems: ModelEntryType[] = [
		{
			key: Guid.create().toString(),
			name: 'Apple',
			children: [
				{
					key: Guid.create().toString(),
					name: 'Juice',
					children: [
						{
							key: Guid.create().toString(),
							name: 'Juice 2',
							children: [],
							expanded: false
						},
						{
							key: Guid.create().toString(),
							name: 'Milk',
							children: [],
							expanded: false
						},
					],
					expanded: false
				},
				{
					key: Guid.create().toString(),
					name: 'Milk 2',
					children: [],
					expanded: false
				},
			],
			expanded: false
		},
		{
			key: Guid.create().toString(),
			name: 'Banana',
			children: [],
			expanded: false
		},
		{
			key: Guid.create().toString(),
			name: 'Pear',
			children: [],
			expanded: false
		},
		{
			key: Guid.create().toString(),
			name: 'Pineapple',
			children: [],
			expanded: false
		},
		{
			key: Guid.create().toString(),
			name: 'Lemon',
			children: [
				{
					key: Guid.create().toString(),
					name: 'Cola',
					children: [],
					expanded: false
				},
				{
					key: Guid.create().toString(),
					name: 'Pepsi',
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