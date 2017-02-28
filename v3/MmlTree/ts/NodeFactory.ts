import {Node, NodeClass, ChildParams, ChildNodes} from './Node.js';

export interface INodeFactory {
    create(kind: string, children: Node[]): Node;
    setNodeClass(kind: string, nodeClass: NodeClass): void;
    getNodeClass(kind: string): NodeClass;
    deleteNodeClass(kind: string): void;
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
    
    create(kind: string, ...children: ChildParams) {
        return this.node[kind](ChildNodes(children));
    }

    setNodeClass(kind: string, nodeClass: NodeClass) {
        this.nodeMap.set(kind, nodeClass);
        let THIS = this;
        let KIND = this.nodeMap.get(kind);
        this.node[kind] = function (...children: ChildParams) {
            return new KIND(THIS, ChildNodes(children));
        }
    }
    getNodeClass(kind: string): NodeClass {return this.nodeMap.get(kind)}
    deleteNodeClass(kind: string) {
        this.nodeMap.delete(kind);
        delete this.node[kind];
    }

    getKinds() {
        return Object.keys(this.node);
    }
}
