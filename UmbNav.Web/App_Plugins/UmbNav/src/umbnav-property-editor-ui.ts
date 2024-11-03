import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, html, customElement, LitElement, property, state} from '@umbraco-cms/backoffice/external/lit';
import {
    UmbPropertyEditorConfigCollection,
    UmbPropertyEditorUiElement,
    UmbPropertyValueChangeEvent
} from "@umbraco-cms/backoffice/property-editor";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import './umbnav-group.js';
import type {UmbNavGroup, ModelEntryType} from './umbnav-group.js';

@customElement('umbnav-property-editor-ui')
export class UmbNavSorterPropertyEditorUIElement extends UmbElementMixin(LitElement) implements UmbPropertyEditorUiElement {
    @property()
    value: ModelEntryType[] = [];

    @property({ attribute: false })
    config: UmbPropertyEditorConfigCollection | undefined;

    @state()
    public get enableToggleAllButton(): Boolean {
        return <Boolean>this.config?.find(item => item.alias === 'enableToggleAllButton')?.value ?? false;
    }

    private onChange(e: Event) {
        this.value = (e.target as UmbNavGroup).value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    toggleAllNodes() {
        const expand = this.value?.some(item => item.expanded);

        const toggleRecursive = (items: ModelEntryType[] = []): ModelEntryType[] => {
            return items.map(item => {
                const newItem = { ...item, expanded: !expand };
                if (newItem.children && newItem.children.length > 0) {
                    newItem.children = toggleRecursive(newItem.children);
                }
                return newItem;
            });
        };

        this.value = toggleRecursive(this.value);
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="outer-wrapper">
                ${this.enableToggleAllButton ? html`
                    <uui-button label="Toggle All Items" look="secondary"
                                @click=${() => this.toggleAllNodes()}
                    ></uui-button>
                ` : ''}
                <umbnav-group
                        .config=${this.config}
                        .value=${this.value === undefined ? [] : this.value}
                        @change=${this.onChange}></umbnav-group>
            </div>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
            .outer-wrapper {
                display: grid;
                gap: 4px;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-sorter-property-editor-ui': UmbNavSorterPropertyEditorUIElement;
    }
}