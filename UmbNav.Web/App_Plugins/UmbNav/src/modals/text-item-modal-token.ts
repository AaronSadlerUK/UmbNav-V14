import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import './text-item-modal-element.ts'

export interface UmbNavTextItemModalData {
    headline: string;
    name: string | null | undefined;
    key: string | null | undefined;
}

export const UMBNAV_TEXT_ITEM_MODAL = new UmbModalToken<UmbNavTextItemModalData>(
    "umbnav.text.item.modal",
    {
        modal: {
            type: 'sidebar',
            size: 'small'
        }
    }
);