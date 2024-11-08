const umbNavPropertyEditorUiManifest = {
    type: 'propertyEditorUi',
    alias: 'Umbraco.Community.UmbNav',
    name: 'UmbNav',
    element: () => import('./umbnav-property-editor-ui.ts'),
    elementName: "umbnav-property-editor-ui",
    "meta": {
        "label": "UmbNav",
        "icon": "icon-sitemap",
        "group": "pickers",
        "propertyEditorSchemaAlias": "Umbraco.Plain.String",
        "settings": {
            "properties": [
                {
                    "alias": "enableTextItems",
                    "label": "Enable Text Items",
                    "description": "If enabled text items can be added to the navigation.",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                },
                {
                    "alias": "enableToggleAllButton",
                    "label": "Enable Toggle All Items Button",
                    "description": "If enabled a button will be displayed to toggle all items.",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                }
            ],
            "defaultData": [
                {
                    "alias": "enableTextItems",
                    "value": true
                },
                {
                    "alias": "enableToggleAllButton",
                    "value": true
                }
            ]
        }
    }
};
export const manifests = [umbNavPropertyEditorUiManifest];