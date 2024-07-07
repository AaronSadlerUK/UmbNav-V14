import { LitElement, html, customElement, property, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import Sortable from 'sortablejs';

interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    expanded?: boolean;
}

const treeData: TreeNode[] = [
    {
        id: "1",
        label: "Item 1",
        children: [
            {
                id: "1-1",
                label: "Item 1.1",
                children: [
                    { id: "1-1-1", label: "Item 1.1.1" },
                    { id: "1-1-2", label: "Item 1.1.2" }
                ]
            },
            { id: "1-2", label: "Item 1.2" }
        ]
    },
    {
        id: "2",
        label: "Item 2",
        children: [
            { id: "2-1", label: "Item 2.1" }
        ]
    },
    { id: "3", label: "Item 3" }
];

@customElement('umbnav-sortable-property-editor-ui')
export default class UmbNavSortablePropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    public value = "";

    @property({ type: Array })
    public treeData: TreeNode[] = treeData;

    // Property to hold references to the sortable instances
    private sortables: Sortable[] = [];

    firstUpdated() {
        const treeElements = this.shadowRoot?.querySelectorAll('.sortable-tree');
        if (treeElements) {
            treeElements.forEach((element) => {
                const sortable = new Sortable(element as HTMLElement, {
                    group: {
                        name: 'nested',
                        pull: true,
                        put: true
                    },
                    animation: 150,
                    invertSwap: true,
                    ghostClass: 'sortable-ghost',
                    onEnd: (/**Event*/_evt) => {
                        // Handle the end of the sorting
                        console.log('New order:', this.sortables.map(s => s.toArray()));
                    }
                });
                this.sortables.push(sortable);
            });
        }
    }

    static styles = css`
    :host {
        display: block;
        padding: 16px;
        font-family: Arial, sans-serif;
    }

    .sortable-tree {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .sortable-tree li {
        padding: 8px;
        margin: 4px 0;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        cursor: grab;
    }

    .sortable-ghost {
        opacity: 0.4;
    }

    .nested-list {
        margin-left: 20px;
        padding-left: 10px;
        border-left: 2px dashed #ddd;
    }
`;

    toggleNode(node: TreeNode): void {
        node.expanded = !node.expanded;
        this.requestUpdate();
    }

    // Method to clean up the sortable instances
    private destroySortable() {
        this.sortables.forEach(sortable => sortable.destroy());
        this.sortables = [];
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up the sortable instances when the element is removed from the DOM
        this.destroySortable();
    }

    renderTreeNodes(nodes: TreeNode[] | undefined): any {
        if (!nodes) return html``;
        return html`
            <ul class="sortable-tree">
                ${nodes.map(node => html`
                    <li data-id="${node.id}">
                        <div class="tree-node">
                            <span id="icon">
                                <uui-icon name="document"></uui-icon>
                            </span>
                            <div id="info">
                                <div id="name">
                                    ${node.label}
                                </div>
                            <!-- <span class="umbnav-badge">Includes Child Nodes</span> -->
                            </div>
                            <div id="buttons">
                                <uui-action-bar>
                                    ${(node.children ?? []).length > 0
                                        ? html`
                                            ${node.expanded ? 
                                                html `<uui-button look="default" color="default" label="Expand" @click=${() => this.toggleNode(node)}>
                                                    <uui-icon name="icon-arrow-up"></uui-icon>
                                                </uui-button>` : 
                                                html `<uui-button look="default" color="default" label="Collapse" @click=${() => this.toggleNode(node)}>
                                                    <uui-icon name="icon-arrow-down"></uui-icon>
                                                </uui-button>`}
                                        `
                                        : ''
                                    }
                                    <uui-button look="default" color="positive" label="Add">
                                        <uui-icon name="add"></uui-icon>
                                    </uui-button>

                                    <uui-button look="default" color="danger" label="Delete">
                                        <uui-icon name="delete"></uui-icon>
                                    </uui-button>
                                </uui-action-bar>
                            </div>
                        </div>
                        <ul class="children ${node.expanded ? 'expanded' : 'collapsed'}">
                            ${this.renderTreeNodes(node.children)}
                        </ul>
                    </li>
                `)}
            </ul>
        `;
    }

    render() {
        return html`
            ${this.renderTreeNodes(this.treeData)}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-sortable-property-editor-ui': UmbNavSortablePropertyEditorUIElement;
    }
}