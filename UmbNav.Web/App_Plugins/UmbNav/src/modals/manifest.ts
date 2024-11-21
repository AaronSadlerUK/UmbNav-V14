const textItemModalManifest = {
    type: 'modal',
    alias: 'umbnav.text.item.modal',
    name: 'UmbNav (Text Item Modal)',
    element: () => import('./text-item-modal-element.ts'),
    elementName: "umbnav-text-item-modal"
};

const visibilityModalManifest = {
    type: 'modal',
    alias: 'umbnav.visibility.item.modal',
    name: 'UmbNav (Visibility Item Modal)',
    element: () => import('./visibility-item-modal-element.ts'),
    elementName: "umbnav-visibility-item-modal"
};

const settingsModalManifest = {
    type: 'modal',
    alias: 'umbnav.settings.item.modal',
    name: 'UmbNav (Settings Item Modal)',
    element: () => import('./settings-item-modal-element.ts'),
    elementName: "umbnav-settings-item-modal"
};

export const manifests = [textItemModalManifest, visibilityModalManifest, settingsModalManifest];