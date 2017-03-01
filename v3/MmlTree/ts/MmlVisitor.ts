import {TextNode} from './Node';
import {XMLNode} from './MmlNode';
import {Visitor} from './Visitor';

export class MmlVisitor extends Visitor {
    visitTextNode(node: TextNode, ...args: any[]): any {}
    visitXmlNode(node: XMLNode, ...args: any[]): any {}
}
