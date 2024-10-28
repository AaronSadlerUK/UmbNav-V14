import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
// import { UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
// import { UMB_LINK_PICKER_MODAL } from "@umbraco-cms/backoffice/multi-url-picker";
import { UMB_LINK_PICKER_MODAL } from '@umbraco-cms/backoffice/multi-url-picker';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { extractUmbColorVariable } from "@umbraco-cms/backoffice/resources";
import { Guid } from "guid-typescript";

import './umbnav-group.js';
import type { UmbNavGroup, ModelEntryType } from './umbnav-group.js';

@customElement('umbnav-sorter-property-editor-ui')
export class UmbNavSorterPropertyEditorUIElement extends UmbElementMixin(LitElement) implements UmbPropertyEditorUiElement {
	// private _modalContext?: UmbModalManagerContext;

	@property({ type: Array })
    groupOneItems: ModelEntryType[] = [
		{
			key: Guid.create().toString(),
			name: 'Apple',
			description: '/apple/',
			url: '/apple/',
			icon: 'icon-smiley color-pink',
			itemType: 'link',
			udi: 'umb://document/1234567890',
			anchor: '',
			published: true,
			naviHide: false,
			culture: null,
			id: 1234,
			children: [
				{
					key: Guid.create().toString(),
					name: 'Juice',
					description: '/juice/',
					url: '/juice/',
					icon: 'icon-document',
					itemType: 'link',
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
							itemType: 'link',
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
							itemType: 'link',
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
					itemType: 'link',
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
			itemType: 'link',
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
			itemType: 'link',
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
			itemType: 'link',
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
			itemType: 'link',
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
					itemType: 'link',
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
					itemType: 'link',
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

	@property({ type: String })
	public set value(value: string) {
		this._value = value;
		if(this.value != "" && this.value != undefined) {
			var stringArray = this.value.split(/(\s+)/);
			this.icon = stringArray[0];
			if(stringArray.length > 1) {
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

    render() {
        return html`
			<div>
<uui-icon name="${this.icon}" style="color:var(${extractUmbColorVariable(this.color)})"></uui-icon>
<pre>${this.icon} ${this.color}</pre>
</div>
			<uui-button look="primary"
			color="default"
			label="Pick an link"
			@click=${this._OpenIconPicker}></uui-button>

			<umb-property-editor-ui-multi-url-picker></umb-property-editor-ui-multi-url-picker>
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

	async _OpenIconPicker() {
		// const modal = UMB_LINK_PICKER_MODAL;
		// const pickerContext = this._modalContext?.open(this, modal);
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalHandler = modalManager.open(this, UMB_LINK_PICKER_MODAL);
		// const data = await pickerContext?.onSubmit();
		// if (!data) return;
		// if (data.color) {
		// 	this.color = data.color as string;
		// }
		// this.icon = data.icon as string;

		if (!modalHandler) return;
		this.#dispatchChangeEvent();
	}

	#dispatchChangeEvent(){
		this.value = this.icon + " " + this.color;
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-sorter-property-editor-ui': UmbNavSorterPropertyEditorUIElement;
    }
}