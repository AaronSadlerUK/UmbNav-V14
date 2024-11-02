import {css, customElement, html, state} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbNavTextItemModalData } from "./text-item-modal-token.ts";
import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import {ModelEntryType} from "../umbnav-group.ts";
import {UmbTextStyles} from '@umbraco-cms/backoffice/style';

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

    #handleConfirm() {
        this.value = {
            anchor: null,
            icon: 'icon-tag',
            itemType: 'title',
            key: this.data?.key ?? '',
            published: true,
            udi: null,
            url: null,
            name: this.value?.name ?? ''} ;
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }

    #contentChange(event: UUIInputEvent) {
        this.updateValue({name: event.target.value.toString()});
    }

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <uui-box>
                    <uui-label for="umbnav-text-item">Title</uui-label>
                    <uui-input label="content" 
                               id="umbnav-text-item"
                        rows=10
                        .value=${this.data?.name}
                        @input=${this.#contentChange}>
                    </uui-input>
                </uui-box>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${this.#handleCancel}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='positive'
                            look="primary"
                            label="Submit"
                            @click=${this.#handleConfirm}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

    static override styles = [
        UmbTextStyles,
        css`
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