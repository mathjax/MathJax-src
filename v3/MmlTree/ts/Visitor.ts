import {Node} from './Node.js';
import {NodeFactory} from './NodeFactory.js';

export type VisitorFunction = (visitor: NodeFactory, node: Node, ...args: any[]) => any;

export interface IVisitor {
    visitTree(tree: Node, ...args: any[]): any;
    visitNode(node: Node, ...args: any[]): any;
    visitDefault(node: Node, ...args: any[]): any;
    setNodeHandler(kind: string, handler: VisitorFunction): void;
    removeNodeHandler(kind: string): void;
    [kind: string]: any;
}

export class Visitor implements IVisitor {
    protected nodeHandlers: Map<string, VisitorFunction> = new Map();

    constructor(factory: NodeFactory) {
        for (const kind of factory.getKinds()) {
            let method = this[Visitor.methodName(kind)] as VisitorFunction;
            if (method) {
                this.nodeHandlers.set(kind, method);
            }
        }
    }

    visitTree(tree: Node, ...args: any[]) {
        return this.visitNode(tree, ...args);
    }
    visitNode(node: Node, ...args: any[]) {
        let handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        return handler.call(this, node, ...args);
    }
    visitDefault(node: Node, ...args: any[]) {
        if (node instanceof Node) {
            for (const child of node.childNodes) {
                this.visitNode(child, ...args);
            }
        }
    }

    setNodeHandler(kind: string, handler: VisitorFunction) {
        this.nodeHandlers.set(kind, handler);
    }
    removeNodeHandler(kind: string) {
        this.nodeHandlers.delete(kind);
    }

    static methodName(kind: string) {
        return "visit" + kind.charAt(0).toUpperCase() + kind.substr(1) + "Node";
    }

    [kind: string]: any;
}
