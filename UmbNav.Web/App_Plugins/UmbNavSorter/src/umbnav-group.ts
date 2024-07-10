import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, repeat, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

import './umbnav-item.ts';
import UmbNavItem from './umbnav-item.ts';

export type ModelEntryType = {
	key: string;
	label: string;
	children: ModelEntryType[];
	expanded?: boolean;
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
			return modelEntry.key;
		},
		identifier: 'umbnav',
		itemSelector: 'umbnav-item',
		containerSelector: '.tree-container',
		onChange: ({ model }) => {
			const oldValue = this._value;
			this._value = model;
			this.requestUpdate('value', oldValue);
			// Fire an event for the parent to know that the model has changed.
			this.dispatchEvent(new CustomEvent('change'));
		},
	});

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

	removeItem = (item: ModelEntryType) => {
		this.value = this.value.filter((r) => r.key !== item.key);
	};

	toggleNode(event: CustomEvent<{ expanded: boolean;  key: string }>) {
		const { expanded, key } = event.detail;
    	this.value = this.value.map((item) => 
      		item.key === key ? { ...item, expanded } : item
    );

	console.log(expanded, key)
	}

	override render() {
		return html`
		<ul class="tree-container">
			${repeat(
				this.value,
				// Note: ideally you have an unique identifier for each item, but for this example we use the `name` as identifier.
				(item) => item.key,
				(item) =>
					html`
					<umbnav-item id="tree-item" name=${item.key} label=${item.label} ?expanded=${item.expanded} ?haschildren=${item.children?.length > 0 || false}	
					@custom-event=${this.toggleNode}></umbnav-item>
					</umbnav-item>
					<umbnav-group class="children ${item.expanded ? 'expanded' : 'collapsed'}"
						.value=${item.children ?? []}
						@change=${(e: Event) => {
							item.children = (e.target as UmbNavGroup).value;
						}}>
					</umbnav-group>
					`,
			)}
		</ul>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				margin: 0;
				padding: 0;
				}

			ul {
				list-style-type: none;
				margin: 0;
				padding: 0;
			}

			.collapse-toggle {
      cursor: pointer;
      margin-right: 10px;
    }

    .collapse-toggle-placeholder {
      width: 10px;
      margin-right: 10px;
    }

    .children {
      padding-left: 20px;
    }

    .children.expanded {
      display: block;
    }

    .children.collapsed {
      display: none;
    }
		`,
	];
}

export default UmbNavGroup;

declare global {
	interface HTMLElementTagNameMap {
		'umbnav-group-nested': UmbNavGroup;
	}
}