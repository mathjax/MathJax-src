import {Node, NodeClass, PropertyList} from './Node.js';

export interface INodeFactory {
    create(kind: string, properties: PropertyList, children: Node[]): Node;
    setNodeClass(kind: string, nodeClass: NodeClass): void;
    getNodeClass(kind: string): NodeClass;
    deleteNodeClass(kind: string): void;
    nodeIsKind(node: Node, kind: string): boolean;
    getKinds(): string[];
}

export class NodeFactory implements INodeFactory {
    protected nodeMap: Map<string, NodeClass> = new Map();
    protected node: {[kind: string]: Function} = {};

    constructor(nodes: {[kind: string]: NodeClass} = {}) {
        for (const kind of Object.keys(nodes)) {
            this.setNodeClass(kind, nodes[kind]);
        }
    }

    create(kind: string, properties: PropertyList = {}, children: Node[] = []) {
        return this.node[kind](properties, children);
    }

    setNodeClass(kind: string, nodeClass: NodeClass) {
        this.nodeMap.set(kind, nodeClass);
        let THIS = this;
        let KIND = this.nodeMap.get(kind);
        this.node[kind] = function (properties: PropertyList, children: Node[]) {
            return new KIND(THIS, properties, children);
        }
    }
    getNodeClass(kind: string): NodeClass {return this.nodeMap.get(kind)}
    deleteNodeClass(kind: string) {
        this.nodeMap.delete(kind);
        delete this.node[kind];
    }

    nodeIsKind(node: Node, kind: string) {
        return (node instanceof this.getNodeClass(kind));
    }

    getKinds() {
        return Array.from(this.nodeMap.keys());
    }
}
