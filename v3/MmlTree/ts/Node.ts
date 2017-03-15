import {NodeFactory} from './NodeFactory';

export type Property = string | number | boolean;
export type PropertyList = {[key: string]: Property};

export type Node = INode;
export type NodeClass = INodeClass;

export interface INode {
    readonly kind: string;
    parent: Node;
    childNodes: Node[];

    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getPropertyNames(): string[];
    getAllProperties(): PropertyList;
    removeProperty(...names: string[]): void;

    isKind(kind: string): boolean;

    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(oldChild: Node, newChild: Node): Node;
    childIndex(child: Node): number;
    findNodes(kind: string): Node[];

    walkTree(func: (node: Node, data?: any) => void, data?: any): void;
}

export interface INodeClass {
    new (factory: NodeFactory, properties?: PropertyList, children?: Node[]): Node;
}

export abstract class ANode implements INode {
    parent: Node = null;
    protected properties: PropertyList = {};
    factory: NodeFactory = null;
    childNodes: Node[] = [];

    constructor(factory: NodeFactory, properties: PropertyList = {}, children: Node[] = []) {
        this.factory = factory;
        for (const name of Object.keys(properties)) {
            this.setProperty(name, properties[name]);
        }
        this.setChildren(children);
    }

    get kind() {return 'unknown'}
    setProperty(name: string, value: Property) {this.properties[name] = value}
    getProperty(name: string) {return this.properties[name]}
    getPropertyNames() {return Object.keys(this.properties)}
    getAllProperties() {return this.properties}
    removeProperty(...names: string[]) {
        for (const name of names) {
            delete this.properties[name];
        }
    }

    isKind(kind: string): boolean {return this.factory.nodeIsKind(this, kind)}

    setChildren(children: Node[]) {
        for (let child of children) {
            this.appendChild(child);
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

export class AEmptyNode extends ANode {
    setChildren(children: Node[]) {}
    appendChild(child: Node) {return child}
    replaceChild(oldChild: Node, newChild: Node) {return oldChild}
    childIndex(node: Node) {return null as number}
}
