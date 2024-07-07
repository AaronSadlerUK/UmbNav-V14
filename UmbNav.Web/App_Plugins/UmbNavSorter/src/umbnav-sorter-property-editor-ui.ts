import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import type { ExampleSorterGroup, ModelEntryType } from './sorter-group.js';

import './sorter-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export default class UmbNavSorterPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    groupOneItems: ModelEntryType[] = [
		{
			name: 'Apple',
			children: [
				{
					name: 'Juice',
				},
				{
					name: 'Milk',
				},
			],
		},
		{
			name: 'Banana',
			children: [],
		},
		{
			name: 'Pear',
		},
		{
			name: 'Pineapple',
		},
		{
			name: 'Lemon',
			children: [
				{
					name: 'Cola',
				},
				{
					name: 'Pepsi',
				},
			],
		},
	];

	groupTwoItems: ModelEntryType[] = [
		{
			name: 'DXP',
		},
		{
			name: 'H5YR',
		},
		{
			name: 'UUI',
		},
	];

    render() {
        return html`
			<uui-box class="uui-text">
				<div class="outer-wrapper">
					<example-sorter-group
						.value=${this.groupOneItems}
						@change=${(e: Event) => {
							this.groupOneItems = (e.target as ExampleSorterGroup).value;
						}}></example-sorter-group>
					<example-sorter-group
						.value=${this.groupTwoItems}
						@change=${(e: Event) => {
							this.groupTwoItems = (e.target as ExampleSorterGroup).value;
						}}></example-sorter-group>
				</div>
			</uui-box>
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