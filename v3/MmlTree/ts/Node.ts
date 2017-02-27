export type Property = string | number | boolean;
export type PropertyList = {[key: string]: Property};

export type Node = ANode;

export interface INode {
    readonly kind: string;
    readonly parent: Node;

    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
}

export abstract class ANode implements INode {
    protected _parent: Node = null;
    protected properties: PropertyList = {};

    get kind() {return 'unknown'}
    get parent() {return this._parent}
    setParent(node: Node) {this._parent = node}
    setProperty(name: string, value: Property) {this.properties[name] = value}
    getProperty(name: string) {return this.properties[name]}
}

export interface IContainerNode extends INode {
    setChildren(children: (Node | string)[]): void;
    appendChild(child: Node): Node;
    replaceChild(oldChild: Node, newChild: Node): Node;
    childIndex(child: Node): number;
}

export abstract class AContainerNode extends ANode implements IContainerNode {
    
    childNodes: Node[] = [];

    constructor(...children: (Node | string | (Node | string)[])[]) {
        super();
        if (children.length === 1 && Array.isArray(children[0])) children = children[0] as (Node | string)[];
        this.setChildren(children as (Node | string)[]);
    }

    setChildren(children: (Node | string)[]) {
        for (let child of children) {
            if (typeof child === 'string') child = new TextNode(child as string);
            this.appendChild(child as Node);
        }
    }
    appendChild(child: Node) {
        this.childNodes.push(child);
        child.setParent(this);
        return child;
    }
    replaceChild(oldChild: Node, newChild: Node) {
        let i = this.childIndex(oldChild);
        this.childNodes[i] = newChild;
        newChild.setParent(this);
        return newChild;
    }

    childIndex(node: Node) {
        let i = 0;
        for (const child of this.childNodes) {
            if (child === node) {
                return i;
            }
            i++;
        }
        return null;
    }
}

export class TextNode extends ANode {
    protected text: string;

    constructor(text:string = "") {
        super();
        this.text = text;
    }
    
    get kind() {return 'text'}

    getText(): string {return this.text}
    setText(text: string): void {this.text = text}
}
