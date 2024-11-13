const textItemModalManifest = {
    type: 'modal',
    alias: 'umbnav.text.item.modal',
    name: 'UmbNav (Text Item Modal)',
    element: () => import('./text-item-modal-element.ts'),
    elementName: "umbnav-text-item-modal"
};

const cssCustomClassesItemModalManifest = {
    type: 'modal',
    alias: 'umbnav.customcssclasses.item.modal',
    name: 'UmbNav (Custom CSS Classes Item Modal)',
    element: () => import('./customcssclasses-item-modal-element.ts'),
    elementName: "umbnav-customcssclasses-item-modal"
};

export const manifests = [textItemModalManifest, cssCustomClassesItemModalManifest];