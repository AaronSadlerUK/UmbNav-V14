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
                },
                {
                    "alias": "allowImageIcon",
                    "label": "Allow Image / Icon Url",
                    "description": "Allow the ability to pick an image for the navigation item.",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                },
                {
                    "alias": "allowCustomClasses",
                    "label": "Allow Custom Classes",
                    "description": "Allow the ability to set custom classes on an item.",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                },
                {
                    "alias": "allowDisplay",
                    "label": "Allow Member Visibility",
                    "description": "Allow the ability to hide menu items based on member authentication status",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                },
                {
                    "alias": "hideNoopener",
                    "label": "Hide noopener Toggle",
                    "description": "Hide the ability to toggle noopener",
                    "propertyEditorUiAlias": "Umb.PropertyEditorUi.Toggle"
                },
                {
                    "alias": "hideNoreferrer",
                    "label": "Hide noreferrer Toggle",
                    "description": "Hide the ability to toggle noreferrer",
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
                },
                {
                    "alias": "allowImageIcon",
                    "value": true
                },
                {
                    "alias": "allowCustomClasses",
                    "value": false
                },
                {
                    "alias": "allowDisplay",
                    "value": false
                },
                {
                    "alias": "hideNoopener",
                    "value": false
                },
                {
                    "alias": "hideNoreferrer",
                    "value": false
                }
            ]
        }
    }
};
export const manifests = [umbNavPropertyEditorUiManifest];