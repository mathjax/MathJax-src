import {Node, NodeClass, ChildParams, ChildNodes} from './Node.js';

export interface INodeFactory {
    create(kind: string, children: Node[]): Node;
    setNodeClass(kind: string, nodeClass: NodeClass): void;
    getNodeClass(kind: string): NodeClass;
    deleteNodeClass(kind: string): void;
}

export class NodeFactory implements INodeFactory {
    protected nodeMap: Map<string, NodeClass> = new Map();
    node: {[kind: string]: Function} = {};
    
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
        this.node[kind] = function (...children: ChildParams) {
            return new (THIS.nodeMap.get(kind))(THIS, ChildNodes(children))
        }
    }
    getNodeClass(kind: string): NodeClass {return this.nodeMap.get(kind)}
    deleteNodeClass(kind: string) {this.nodeMap.delete(kind)}
}
