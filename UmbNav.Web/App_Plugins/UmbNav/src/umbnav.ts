import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { repeat } from 'lit/directives/repeat.js';
import { TemplateResult } from 'lit';
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";

interface TreeNode {
    id: string;
    label: string;
    description?: string;
    children: TreeNode[];
    expanded?: boolean;
}

@customElement('umbnav-property-editor-ui')
export default class UmbNavPropertyEditorUIElement extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: Array })
    tree: TreeNode[] = [
        { id: '1', label: 'Root 1', children: [] },
        {
            id: '2', label: 'Root 2', children: [
                { id: '3', label: 'Child 2.1', children: [] },
                { id: '4', label: 'Child 2.2', children: [] }
            ]
        }
    ];

    static styles = css`
    :host {
      margin: 0;
      padding: 0;
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .tree-node {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid var(--uui-color-border, #d8d7d9);
      border-radius: 4px;
      margin-bottom: 5px;
      background-color: var(--uui-color-surface, #fff);
      cursor: all-scroll;
      transition: background-color 0.3s ease;
      min-height: var(--uui-size-14);

    }

    .tree-node.dragging {
      opacity: 0.5;
    }

    .drop-target {
      border-top: 2px solid #007acc;
      margin: -1px 0;
    }

    .collapse-toggle {
      cursor: pointer;
      margin-right: 10px;
    }

    .collapse-toggle-placeholder {
      width: 10px;
      margin-right: 10px;
    }

    .children {
      padding-left: 20px;
    }

    .children.expanded {
      display: block;
    }

    .children.collapsed {
      display: none;
    }

    .tree-node:hover {
        border-color: var(--uui-color-border-emphasis, #a1a1a1);
    }

    .flex {
        display: flex;
    }

    #icon {
        display: flex;
        font-size: 1.2em;
        margin-left: var(--uui-size-2, 6px);
        margin-right: var(--uui-size-1, 3px);
    }

    #info {
        display: flex;
        align-items: start;
        justify-content: center;
        height: 100%;
        padding-left: var(--uui-size-2, 6px);
    }

    #name {
        font-weight: 700;
    }
    
    #name:hover {
        font-weight: 700;
        text-decoration: underline;
        color: var(--uui-color-interactive-emphasis, #3544b1);
    }

    .umbnav-badge {
        padding: .3em .6em .3em;
        font-size: 75%;
        font-weight: 700;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25em;
        background-color: #337ab7;
        margin-left: 6px;
    }

    #buttons {
        margin-left: auto;
    }
  `;

    private draggedNode: TreeNode | null = null;

    renderNode(node: TreeNode): TemplateResult {
        return html`
          <li
            draggable="true"
            @dragstart=${(e: DragEvent) => this.onDragStart(e, node)}
            @dragover=${(e: DragEvent) => e.preventDefault()}
            @dragenter=${(e: DragEvent) => this.onDragEnter(e)}
            @dragleave=${(e: DragEvent) => this.onDragLeave(e)}
            @drop=${(e: DragEvent) => this.onDrop(e, node)}
          >
          <div class="tree-node">
                    <!-- div keeps icon and nodename from wrapping -->
                    <!-- <i class="umb-node-preview__icon" aria-hidden="true"></i> -->
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
                        ${node.children.length > 0
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
              ${repeat(
                node.children,
                (child) => child.id,
                (child) => this.renderNode(child)
            )}
            </ul>
            </li>
            <!-- ${node.children.length > 0
                ? html`
                  <span class="collapse-toggle" @click=${() => this.toggleNode(node)}>
                    ${node.expanded ? '▼' : '▶'}
                  </span>
                `
                : html`<span class="collapse-toggle-placeholder"></span>`
            }
            ${node.label}
            <ul class="children ${node.expanded ? 'expanded' : ''}">
              ${repeat(
                node.children,
                (child) => child.id,
                (child) => this.renderNode(child)
            )}
            </ul>
          </li> -->
        `;
    }

    render(): TemplateResult {
        return html`
                <ul>
                    ${repeat(
                        this.tree,
                        (node) => node.id,
                        (node) => this.renderNode(node)
                    )}
                </ul>
        `;
    }

    onDragStart(event: DragEvent, node: TreeNode): void {
        this.draggedNode = node;
        event.dataTransfer?.setData('text/plain', node.id);
        event.stopPropagation();
    }

    onDragEnter(event: DragEvent): void {
        const target = event.currentTarget as HTMLElement;
        target.classList.add('drop-target');
    }

    onDragLeave(event: DragEvent): void {
        const target = event.currentTarget as HTMLElement;
        target.classList.remove('drop-target');
    }

    onDrop(event: DragEvent, targetNode: TreeNode): void {
        event.preventDefault();
        event.stopPropagation();

        const target = event.currentTarget as HTMLElement;
        target.classList.remove('drop-target');

        if (this.draggedNode && this.draggedNode !== targetNode) {
            this.moveNode(this.draggedNode, targetNode);
            this.draggedNode = null;
            this.requestUpdate();
        }
    }

    moveNode(draggedNode: TreeNode, targetNode: TreeNode): void {
        // Remove dragged node from its current position
        this.removeNode(this.tree, draggedNode);

        // Add dragged node to the new position
        targetNode.children.push(draggedNode);
    }

    removeNode(tree: TreeNode[], nodeToRemove: TreeNode): boolean {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i] === nodeToRemove) {
                tree.splice(i, 1);
                return true;
            }
            if (this.removeNode(tree[i].children, nodeToRemove)) {
                return true;
            }
        }
        return false;
    }

    toggleNode(node: TreeNode): void {
        node.expanded = !node.expanded;
        this.requestUpdate();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'umbnav-property-editor-ui': UmbNavPropertyEditorUIElement;
    }
}
