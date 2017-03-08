import {NodeFactory} from './NodeFactory';

export type Property = string | number | boolean;
export type PropertyList = {[key: string]: Property};
export type ChildParams = (Node | string | (Node | string)[])[];
export type ChildArray = (Node | string)[];

export type Node = ANode;
export type NodeClass = INodeClass;

export interface INode {
    readonly kind: string;
    parent: Node;

    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getProperties(): PropertyList;
    removeProperty(...names: string[]): void;

    isKind(kind: string): boolean;

    walkTree(func: (node: Node, data?: any) => void, data?: any): void;
}

export interface INodeClass {
    new (factory: NodeFactory, ...children: ChildParams): Node;
}

export abstract class ANode implements INode {
    parent: Node = null;
    protected properties: PropertyList = {};
    factory: NodeFactory = null;

    constructor(factory: NodeFactory = null) {
        this.factory = factory;
    }

    get kind() {return 'unknown'}
    setProperty(name: string, value: Property) {this.properties[name] = value}
    getProperty(name: string) {return this.properties[name]}
    getProperties() {return this.properties}
    removeProperty(...names: string[]) {
        for (const name of names) {
            delete this.properties[name];
        }
    }
    isKind(kind: string) {return this.factory.nodeIsKind(this, kind)}

    walkTree(func: (node: Node, data?: any) => void, data?: any) {
        func(this, data);
        return data;
    }
}

export interface IContainerNode extends INode {
    setChildren(children: (Node | string)[]): void;
    appendChild(child: Node): Node;
    replaceChild(oldChild: Node, newChild: Node): Node;
    childIndex(child: Node): number;
    findNodes(kind: string): Node[];
}

export function ChildNodes(children: ChildParams): ChildArray {
    if (children.length === 1 && Array.isArray(children[0])) children = children[0] as ChildArray;
    return children as ChildArray;
}

export abstract class AContainerNode extends ANode implements IContainerNode {

    childNodes: Node[] = [];

    constructor(factory: NodeFactory, ...children: ChildParams) {
        super(factory);
        this.setChildren(ChildNodes(children));
    }

    setChildren(children: (Node | string)[]) {
        for (let child of children) {
            if (typeof child === 'string') child = this.factory.create("text",child);
            this.appendChild(child as Node);
        }
    }
    appendChild(child: Node) {
        this.childNodes.push(child);
        child.parent = this;
        return child;
    }
    replaceChild(oldChild: Node, newChild: Node) {
        let i = this.childIndex(oldChild);
        this.childNodes[i] = newChild;
        newChild.parent = this;
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

    walkTree(func: (node: Node, data?: any) => void, data?: any) {
        func(this, data);
        for (const child of this.childNodes) {
            child.walkTree(func, data);
        }
        return data;
    }

    findNodes(kind: string) {
        let nodes: Node[] = [];
        this.walkTree((node: Node) => {
            if (node.isKind(kind)) nodes.push(node);
        });
        return nodes;
    }
}

export class TextNode extends ANode {
    protected text: string;

    constructor(factory: NodeFactory, text:string = "") {
        super(factory);
        this.text = text;
    }

    get kind() {return 'text'}

    getText(): string {return this.text}
    setText(text: string): void {this.text = text}
}
