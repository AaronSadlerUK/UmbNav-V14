import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, html, customElement, LitElement, property, state} from '@umbraco-cms/backoffice/external/lit';
import {
    UmbPropertyEditorConfigCollection,
    UmbPropertyEditorUiElement,
    UmbPropertyValueChangeEvent
} from "@umbraco-cms/backoffice/property-editor";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import './umbnav-group.js';
import type {UmbNavGroup} from './umbnav-group.js';
import {ModelEntryType} from "./umbnav.token.ts";

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

    @state()
    expandAll: boolean = false;

    private onChange(e: Event) {
        this.value = (e.target as UmbNavGroup).value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    toggleAllNodes() {
        this.expandAll = !this.expandAll;
        this.requestUpdate();
    }

    toggleAllNodesEvent(event: CustomEvent<{ expandAll: boolean }>) {
        this.expandAll = event.detail.expandAll;
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
                        .expandAll=${this.expandAll}
                        .config=${this.config}
                        .value=${this.value === undefined ? [] : this.value}
                        @toggle-expandall-event=${this.toggleAllNodesEvent}
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