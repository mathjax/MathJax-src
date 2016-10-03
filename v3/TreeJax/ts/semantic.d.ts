/**
 * Type interface for SRE's semantic module.
 */
declare module 'semantic' {

  export namespace Type {
    export var UNKNOWN: string;
    export var OPERATOR: string;
    export var ROOT: string;
    export var SQRT: string;
    export var TABLE: string;
    export var ROW: string;
    export var CELL: string;
    export var ENCLOSE: string;
  }

  export namespace Role {
    export var UNKNOWN: string;
    export var TABLE: string;
  }

  export class Node {
    public type: string;
    public role: string;
    public appendChild(node: Node): void;
  }

  export class Tree {
    public root: Node;
  }

  export function emptyTree(): Tree;

  export class NodeFactory {
    public makeEmptyNode(): Node;
    public makeUnprocessed(rest: any): Node;
    public makeBranchNode(kind: string,
                          children: Node[],
                          content: Node[]): Node;
    public makeLeafNode(content: string, font: string): Node;
  }

  namespace Processor {
    export function setFactory(factory: NodeFactory): void;
    export function row(nodes: Node[]): Node;
    export function identifierNode(content: string,
                                   font: string,
                                   kind: string): Node;
    export function fractionLikeNode(linethickness: string,
                                     denom: Node,
                                     enume: Node): Node;
    export function limitNode(tag: string, nodes: Node[]): Node;
    export function text(content: string,
                         font: string,
                         kind: string): Node;
    export function number(node: Node): Node;
    export function mfenced(open: string,
                            close: string,
                            sepValue: string,
                            nodes: Node[]): Node;
    export function tablesInRow(nodes: Node[]): Node;
    export function tableToMultiline(table: Node): Node;
    export function pseudoTensor(base: Node,
                                 sub: Node[],
                                 sup: Node[]): Node;
    export function tensor(base: Node,
                           lsub: Node[],
                           lsup: Node[],
                           rsub: Node[],
                           rsup: Node[]): Node;
  }

}
