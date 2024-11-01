import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

@customElement('umbnav-item')
export class UmbNavItem extends UmbElementMixin(LitElement) {
    @property({ type: String, reflect: true })
    name: string = '';
    @property({ type: String, reflect: true })
    description: string = '';
    @property({ type: String, reflect: true })
    icon: string = '';
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

    editNode(key: string | null | undefined): void {
        const event = new CustomEvent<{ key: string | null | undefined }>('edit-node-event', {
            detail: {
                key: key
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);

        this.requestUpdate();
    }

    removeNode(): void {
        const event = new CustomEvent<{ key: string }>('remove-node-event', {
            detail: { key: this.key },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);

        this.requestUpdate();
    }

    override render() {
        return html`
            <div class="tree-node">
                <div id="arrow">
                <uui-symbol-expand ?open="${this.expanded}"
                @click=${() => this.toggleNode(this.expanded)}></uui-symbol-expand>
                </div>
			    <div id="icon">
                    <umb-icon name="${this.icon}"></umb-icon>
                </div>
                <div id="info">
                    <div class="column">
                        <div id="name" 
                             @click=${() => this.editNode(this.key)}>
                            ${this.name}
                        </div>
                        <div id="description">
                            ${this.description}
                        </div>
                    </div>
                    <!-- <span class="umbnav-badge">Includes Child Nodes</span> -->
                </div>
                <div id="buttons">
                    <uui-action-bar>
                        <uui-button look="default" color="warning" label="Edit"
                                    @click=${() => this.editNode(this.key)}>
                            <uui-icon name="edit"></uui-icon>
                        </uui-button>

                        <uui-button look="default" color="danger" label="Delete"
                                    @click=${() => this.removeNode()}>
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
                display: grid;
                gap: 3px;
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

            #info .column {
                flex-direction: column;
                align-items: normal;
            }

            #name {
                font-weight: 700;
                cursor: pointer;
            }
            
            #description {
                color: #515054;
                font-size: 12px;
                line-height: 1.5em;
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

            .tree-node:hover {
                border-color: var(--uui-color-border-emphasis, #a1a1a1);
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