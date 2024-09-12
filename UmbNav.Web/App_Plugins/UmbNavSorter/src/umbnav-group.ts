import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, repeat, property, TemplateResult } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

import './umbnav-item.ts';
import UmbNavItem from './umbnav-item.ts';

export type ModelEntryType = {
	key: string;
	name: string;
	children?: ModelEntryType[];
	expanded: boolean;
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
		onChange: ({ model }) => {
			const oldValue = this._value;
			this._value = model;
			this.requestUpdate('value', oldValue);
			// Fire an event for the parent to know that the model has changed.
			this.dispatchEvent(new CustomEvent('change'));
		},
	});

	@property({ type: Boolean, reflect: true })
	nested: boolean = false;

	@property({ type: Array, attribute: false })
	public get value(): ModelEntryType[] {
		return this._value ?? [];
	}
	public set value(value: ModelEntryType[]) {
		const oldValue = this._value;
		this._value = value;
		this.#sorter.setModel(this._value);
		this.requestUpdate('value', oldValue);
	}
	private _value?: ModelEntryType[];

	removeItem = (event: CustomEvent<{ key: string }>) => {
		const { key } = event.detail;
		this.value = this.value.filter((r) => r.key !== key);
	};

	toggleNode(event: CustomEvent<{ expanded: boolean; key: string }>) {
		console.log(this.value)
		const { expanded, key } = event.detail;
		var newValue = this.updateExpandedInNested(this.value, key, expanded);
		this.value = newValue;
	}

	updateExpandedInNested(arr: ModelEntryType[], key: string, expanded: boolean) {
		return arr.map(item => {
			// If the current item's key matches, update its expanded property
			if (item.key === key) {
				return { ...item, expanded: expanded };
			}

			// If the item has children, recursively search within them
			if (item.children && item.children.length > 0) {
				const updatedChildren: ModelEntryType[] = this.updateExpandedInNested(item.children, key, expanded);

				// Only return a new object if children were updated
				if (updatedChildren !== item.children) {
					return { ...item, children: updatedChildren };
				}
			}

			// Return the original item if no changes were made
			return item;
		});
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
						<umbnav-item name=${item.name} key=${item.key} class="sorter-padding-bottom"
						@toggle-children-event=${this.toggleNode}
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
				${this.nested ? this.renderPlaceholder() : ''}
			</div>
		`;
	}
	renderPlaceholder(): TemplateResult {
		return html`<div class="sorter-placeholder sorter-border">Drop items above to create children</div>`;
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
				display: flex;
				flex-direction: column;
			}

			.sorter-padding {
				padding-left: var(--uui-size-space-5);
			}

			.sorter-padding-bottom {
				padding-top: var(--uui-size-space-2);
			}

			.sorter-left-padding {
				padding-left: var(--uui-size-space-1);
			}

			.sorter-border {
				border: 1px dashed rgba(122, 122, 122, 0.25);
			}

			.sorter-background:hover {
				background: #ccc;
			}

			.sorter-placeholder {
				opacity: 0.2;
				padding-left: var(--uui-size-space-3);
				padding-top: var(--uui-size-space-3);
				padding-bottom: var(--uui-size-space-3);
				margin-top: var(--uui-size-space-3);
				margin-bottom: var(--uui-size-space-3);
			}

			.sorter-placeholder-left-margin {
				margin-left: var(--uui-size-space-5);
			}
			.expanded {
      display: flex;
    }
	.margin-left {
		margin-left: var(--uui-size-space-5)
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