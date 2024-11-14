import {css, customElement, html, state} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import {UmbTextStyles} from '@umbraco-cms/backoffice/style';
import type { UUIButtonState } from '@umbraco-cms/backoffice/external/uui';
import {UmbNavItemVisibility, UmbNavVisibilityItemModalData} from "./visibility-item-modal-token.ts";
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';

@customElement('umbnav-visibility-item-modal')
export class UmbNavModalElement extends
    UmbModalBaseElement<UmbNavVisibilityItemModalData, UmbNavItemVisibility>
{
    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.updateValue({hideLoggedIn: this.data?.hideLoggedIn, hideLoggedOut: this.data?.hideLoggedOut});
        this.hideLoggedIn = this.data?.hideLoggedIn ?? false;
        this.hideLoggedOut = this.data?.hideLoggedOut ?? false;
    }

    @state()
    hideLoggedIn: boolean = false;

    @state()
    hideLoggedOut: boolean = false;

    @state()
    private _submitButtonState: UUIButtonState;

    #handleConfirm() {
        this._submitButtonState = 'success';

        this.value = {
            hideLoggedIn: this.hideLoggedIn,
            hideLoggedOut: this.hideLoggedOut
        };
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }

    #hideLoggedIn(event: UUIBooleanInputEvent) {
        this.updateValue({hideLoggedIn: event.target.checked});
        this.hideLoggedIn = event.target.checked;
    }

    #hideLoggedOut(event: UUIBooleanInputEvent) {
        this.updateValue({hideLoggedOut: event.target.checked});
        this.hideLoggedOut = event.target.checked;
    }

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <uui-box>
                    
                    <uui-toggle label="Hide Logged In"
                                ?checked="${this.hideLoggedIn}"
                                @change=${this.#hideLoggedIn}></uui-toggle>

                    <uui-toggle label="Hide Logged Out"
                                ?checked="${this.hideLoggedOut}"
                                @change=${this.#hideLoggedOut}></uui-toggle>
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