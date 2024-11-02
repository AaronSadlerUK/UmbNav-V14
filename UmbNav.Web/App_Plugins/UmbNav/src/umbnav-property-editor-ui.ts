import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {css, html, customElement, LitElement, property} from '@umbraco-cms/backoffice/external/lit';
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
    value: ModelEntryType[] | undefined;

    @property({ attribute: false })
    config: UmbPropertyEditorConfigCollection | undefined;

    private onChange(e: Event) {
        this.value = (e.target as UmbNavGroup).value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    render() {
        return html`
            <div class="outer-wrapper">
                <umbnav-group
                        .config=${this.config}
                        .value=${this.value}
                        @change=${this.onChange}></umbnav-group>
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