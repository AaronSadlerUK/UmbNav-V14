import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import './text-item-modal-element.ts'

export interface UmbNavCustomCssClassesItemModalData {
    headline: string;
    customCssClasses: string | null | undefined;
    key: string | null | undefined;
}

export type UmbNavCustomCssClasses = {
    customCssClasses: string | null | undefined;
}

export const UMBNAV_CUSTOMCSSCLASSES_ITEM_MODAL = new UmbModalToken<UmbNavCustomCssClassesItemModalData, UmbNavCustomCssClasses>(
    "umbnav.customcssclasses.item.modal",
    {
        modal: {
            type: 'sidebar',
            size: 'small'
        }
    }
);