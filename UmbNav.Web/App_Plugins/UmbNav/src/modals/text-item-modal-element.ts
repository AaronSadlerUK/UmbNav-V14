import {css, customElement, html, state} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbNavTextItemModalData } from "./text-item-modal-token.ts";
import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import {umbBindToValidation, UmbValidationContext} from "@umbraco-cms/backoffice/validation";
import type { UUIButtonState } from '@umbraco-cms/backoffice/external/uui';
import {ModelEntryType} from "../umbnav.token.ts";
import { umbFocus } from '@umbraco-cms/backoffice/lit-element';

@customElement('umbnav-text-item-modal')
export class UmbNavModalElement extends
    UmbModalBaseElement<UmbNavTextItemModalData, ModelEntryType>
{
    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.updateValue({name: this.data?.name});
    }

    @state()
    name: string = '';

    @state()
    private _submitButtonState: UUIButtonState;

    #handleConfirm() {
        this._submitButtonState = 'waiting';

        this.#validation.validate().then(() => {
            (this.shadowRoot?.getElementById('label') as HTMLElement)?.classList.remove('invalid');
            this._submitButtonState = 'success';

            this.value = {
                key: this.data?.key ?? '',
                name: this.value?.name ?? '',
                url: null,
                icon: 'icon-tag',
                itemType: 'title',
                udi: null,
                anchor: null,
                published: true,
                children: []};
            this.modalContext?.submit();
        }, () => {
            (this.shadowRoot?.getElementById('label') as HTMLElement)?.classList.add('invalid');
            this._submitButtonState = 'failed';
        });
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
        this.updateValue({name: event.target.value.toString()});
    }

    #validation = new UmbValidationContext(this);

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <uui-box>
                    ${this.#renderTextItemInput()}
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

    #renderTextItemInput() {
        return html`
			<umb-property-layout orientation="vertical">
				<div class="side-by-side" slot="editor">
					<umb-property-layout
						orientation="vertical"
						label="Title"
						style="padding:0;">
                        <uui-input label="content"
                                   slot="editor"
                                   id="umbnav-text-item"
                                   rows=10
                                   .value=${this.data?.name}
                                   @input=${this.#contentChange}
                                   required
                                   ${umbBindToValidation(this)}
                                   ${umbFocus()}
                        >
                        </uui-input>
					</umb-property-layout>
				</div>
			</umb-property-layout>
		`;
    }

    static override styles = [
        UmbTextStyles,
        css`
            .invalid {
                color: var(--uui-color-danger);
            }
            uui-box {
                --uui-box-default-padding: 0 var(--uui-size-space-5);
            }

            uui-button-group {
                width: 100%;
            }

            uui-input {
                width: 100%;
            }
        `,
    ];

}

export default UmbNavModalElement;