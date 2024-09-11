import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
// import type { ModelEntryType } from './umbnav-group.js';
import { Guid } from "guid-typescript";

import './sorter-group.js';
import type { ExampleSorterGroup, ModelEntryType } from './sorter-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export default class UmbNavSorterPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
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
							name: 'Juice',
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
					name: 'Milk',
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
					<example-sorter-group
						.value=${this.groupOneItems}
						@change=${(e: Event) => {
							this.groupOneItems = (e.target as ExampleSorterGroup).value;
						}}></example-sorter-group>
				</div>
		`;
    }

    static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
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