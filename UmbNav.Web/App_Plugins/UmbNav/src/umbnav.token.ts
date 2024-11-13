export type UmbNavLinkPickerLinkType = 'document' | 'external' | 'media' | 'title';
export type ModelEntryType = {
    key: string | null | undefined;
    name: string | null | undefined;
    description?: string | null | undefined,
    url: string | null | undefined,
    icon: string | null | undefined,
    itemType: UmbNavLinkPickerLinkType | null | undefined,
    udi: string | null | undefined,
    anchor: string | null | undefined,
    published: boolean | null | undefined,
    naviHide?: boolean | null | undefined,
    culture?: string | null | undefined,
    id?: number | null | undefined,
    children: ModelEntryType[];
    expanded?: boolean;
    target?: string | null | undefined;
    image?: ImageItem[];
    customClasses?: string | null | undefined;
};

export type ImageItem = {
    udi: string;
}