import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import { manifests as modals } from "./modals/manifest.ts";
import { manifests as propertyEditors } from "./manifest.ts";

const manifests = [
    ...modals,
    ...propertyEditors
];

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    // register the manifests
    extensionRegistry.registerMany(manifests);
};