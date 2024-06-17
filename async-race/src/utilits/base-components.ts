import { isHTMLElement, isNotNullable } from "./common.ts";
import { BaseComponent } from "./types.ts";

export class Component {
    private _children: Component[] = [];

    private _node: HTMLElement | null = null;

    constructor(
        { tag = "div", className = "", text = "" }: BaseComponent,
        ...children: Component[]
    ) {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = text;
        this._node = node;

        if (children && children.length > 0) {
            this.appendChildren(children);
        }
    }

    append(child: Component) {
        this._children.push(child);
        const childNode = child.getNode();
        if (childNode) {
            this._node?.appendChild(childNode);
        }
    }

    appendChildren(children: Component[]) {
        children.forEach((element) => {
            this.append(element);
        });
    }

    getNode(): HTMLElement {
        if (isHTMLElement(this._node)) {
            return this._node;
        } else {
            throw new Error("Node is not an HTMLElement");
        }
    }

    getChildren(): Component[] {
        return this._children;
    }

    setTextContent(content: string) {
        if (isNotNullable(this._node)) {
            this._node.textContent = content;
        }
    }

    setAttribute(attribute: string, value: string) {
        this._node?.setAttribute(attribute, value);
    }

    removeAttribute(attribute: string) {
        this._node?.removeAttribute(attribute);
    }

    toggleClass(className: string) {
        this._node?.classList.toggle(className);
    }

    addListener(event: string, listener: EventListener) {
        this._node?.addEventListener(event, listener);
    }

    destroyChildren() {
        this._children.forEach((child) => {
            child.destroy();
        });
        this._children.length = 0;
    }

    destroy() {
        this.destroyChildren();
        this._node?.remove();
    }
}
