import { ManifestModal } from '@umbraco-cms/backoffice/extension-registry';

const modal: ManifestModal = {
    type: 'modal',
    alias: 'time.custom.modal',
    name: 'Time custom modal',
    js: () => import('./custom-modal-element.ts'),
};

export const manifests = [modal];