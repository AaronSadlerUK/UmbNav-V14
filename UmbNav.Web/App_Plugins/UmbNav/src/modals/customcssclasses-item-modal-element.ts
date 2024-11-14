import {css, customElement, html, state} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import {UmbNavCustomCssClasses, UmbNavCustomCssClassesItemModalData} from "./customcssclasses-item-modal-token.ts";
import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import type { UUIButtonState } from '@umbraco-cms/backoffice/external/uui';

@customElement('umbnav-customcssclasses-item-modal')
export class UmbNavModalElement extends
    UmbModalBaseElement<UmbNavCustomCssClassesItemModalData, UmbNavCustomCssClasses>
{
    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.updateValue({customCssClasses: this.data?.customCssClasses});
    }

    @state()
    customCssClasses: string = '';

    @state()
    private _submitButtonState: UUIButtonState;

    #handleConfirm() {
        this._submitButtonState = 'waiting';

        this.value = {
            customCssClasses: this.value?.customCssClasses ?? ''}
        ;
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }

    #contentChange(event: UUIInputEvent) {
        if (event.target.value.toString().length === 0) {
            (this.shadowRoot?.getElementById('label') as HTMLElement)?.classList.add('invalid');
        }else{
            (this.shadowRoot?.getElementById('label') as HTMLElement)?.classList.remove('invalid');
        }
        this.updateValue({customCssClasses: event.target.value.toString()});
    }

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <uui-box>
                    <uui-label id="label" for="umbnav-text-item">
                        Custom CSS Classes
                    </uui-label>
                    <uui-input label="content" 
                               id="umbnav-text-item"
                        rows=10
                        .value=${this.data?.customCssClasses}
                        @input=${this.#contentChange}
                    >
                    </uui-input>
                </uui-box>
                <uui-button
                        slot="actions"
                        @click=${this.#handleCancel}
                        look="default"
                        color="default"
                        label=${this.localize.term('general_close')}></uui-button>
                <uui-button
                        slot="actions"
                        @click=${this.#handleConfirm}
                        color="positive"
                        look="primary"
                        .state=${this._submitButtonState}
                        label=${this.localize.term('general_submit')}></uui-button>
            </umb-body-layout>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
            .invalid {
                color: var(--uui-color-danger);
            }
            uui-input, uui-label {
                margin-bottom: var(--uui-size-space-6);
            }

            uui-input, uui-label {
                width: 100%;
            }
        `,
    ];

}

export default UmbNavModalElement;