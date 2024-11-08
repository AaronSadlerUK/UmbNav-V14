import { manifests as modals } from "./modals/manifest.ts";
import { manifests as propertyEditors } from "./manifest.ts";

import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [
    ...modals,
    ...propertyEditors
]