const textItemModalManifest = {
    type: 'modal',
    alias: 'umbnav.text.item.modal',
    name: 'UmbNav (Text Item Modal)',
    element: () => import('./text-item-modal-element.ts'),
    elementName: "umbnav-text-item-modal"
};
export const manifests = [textItemModalManifest];