import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

@customElement('umbnav-item')
export class UmbNavItem extends UmbElementMixin(LitElement) {
	@property({ type: String, reflect: true })
	name: string = '';
	@property({ type: String, reflect: true })
	key: string = '';
	@property({ type: Boolean, reflect: true })
	expanded: boolean = false;

	// TODO: Does it make any different to have this as a property?
	@property({ type: Boolean, reflect: true, attribute: 'drag-placeholder' })
	umbDragPlaceholder = false;

	toggleNode(isExpanded: boolean): void {
		const event = new CustomEvent<{ expanded: boolean; key: string }>('toggle-children-event', {
			detail: { expanded: !isExpanded, key: this.key },
			bubbles: true,
			composed: true,
		  });
		  this.dispatchEvent(event);

        this.expanded = !isExpanded;
        this.requestUpdate();
    }

	override render() {
		return html`
					<div class="tree-node">
			<span id="icon">
				<uui-icon name="document"></uui-icon>
			</span>
			<div id="info">
				<div id="name">
					${this.name}
				</div>
				<!-- <span class="umbnav-badge">Includes Child Nodes</span> -->
			</div>
			<div id="buttons">
				<uui-action-bar>
						${this.expanded ? 
							html `<uui-button look="default" color="default" label="Expand" @click=${() => this.toggleNode(this.expanded)}>
							<uui-icon name="icon-arrow-up"></uui-icon>
						</uui-button>` : 
							html `<uui-button look="default" color="default" label="Collapse" @click=${() => this.toggleNode(this.expanded)}>
							<uui-icon name="icon-arrow-down"></uui-icon>
						</uui-button>`}

					<uui-button look="default" color="positive" label="Add">
						<uui-icon name="add"></uui-icon>
					</uui-button>

					<uui-button look="default" color="danger" label="Delete">
						<uui-icon name="delete"></uui-icon>
					</uui-button>
				</uui-action-bar>
			</div>
			</div>

			<slot></slot>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				border-radius: var(--uui-border-radius);
			}
			:host([drag-placeholder]) {
				opacity: 0.2;
			}

			div {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}


			#icon {
        display: flex;
        font-size: 1.2em;
        margin-left: var(--uui-size-2, 6px);
        margin-right: var(--uui-size-1, 3px);
    }

    #info {
        display: flex;
        padding-left: var(--uui-size-2, 6px);
		flex-grow: 1;
		flex-shrink: 0;
		flex-basis: auto;
    }

    #name {
        font-weight: 700;
    }
    
    #name:hover {
        font-weight: 700;
        text-decoration: underline;
        color: var(--uui-color-interactive-emphasis, #3544b1);
    }

	.tree-node {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid var(--uui-color-border, #d8d7d9);
      border-radius: 4px;
      background-color: var(--uui-color-surface, #fff);
      cursor: all-scroll;
      transition: background-color 0.3s ease;
      min-height: var(--uui-size-14);

    }

	.margin-left {
		margin-left: var(--uui-size-space-5)
	}

	.tree-node.dragging {
      opacity: 0.5;
    }

			slot:not([key]) {
				// go on new line:
			}
		`,
	];
}

export default UmbNavItem;

declare global {
	interface HTMLElementTagNameMap {
		'umbnav-item': UmbNavItem;
	}
}