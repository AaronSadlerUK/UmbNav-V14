import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import Sortable from 'sortablejs';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";

interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
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

@customElement('umbnav-property-editor-ui')
export default class UmbNavPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    public value = "";

    @property({ type: Array })
    public treeData: TreeNode[] = treeData;

    // Property to hold references to the sortable instances
    private sortables: Sortable[] = [];

    // Method to initialize the sortable tree
    private initializeSortable() {
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
                    ghostClass: 'sortable-ghost',
                    onEnd: () => {
                        // Handle the end of the sorting
                        console.log('New order:', this.sortables.map(s => s.toArray()));
                    }
                });
                this.sortables.push(sortable);
            });
        }
    }

    // Method to clean up the sortable instances
    private destroySortable() {
        this.sortables.forEach(sortable => sortable.destroy());
        this.sortables = [];
    }

    connectedCallback() {
        super.connectedCallback();
        // Initialize the sortable tree after the element is connected to the DOM
        this.initializeSortable();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up the sortable instances when the element is removed from the DOM
        this.destroySortable();
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

    renderTreeNodes(nodes: TreeNode[] | undefined): any {
        if (!nodes) return html``;
        return html`
            <ul class="sortable-tree">
                ${nodes.map(node => html`
                    <li data-id="${node.id}">
                        ${node.label}
                        ${this.renderTreeNodes(node.children)}
                    </li>
                `)}
            </ul>
        `;
    }

    render() {
        return html`
            <div>
                I'm a property editor!
                ${this.renderTreeNodes(this.treeData)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-property-editor-ui': UmbNavPropertyEditorUIElement;
    }
}
