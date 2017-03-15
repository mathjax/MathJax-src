import {TextNode, XMLNode} from './MmlNode';
import {MmlFactory} from './MmlFactory';
import {Visitor} from './Visitor';

export class MmlVisitor extends Visitor {
    constructor(factory: MmlFactory = null) {
        if (!factory) factory = new MmlFactory();
        super(factory);
    }
    visitTextNode(node: TextNode, ...args: any[]): any {}
    visitXMLNode(node: XMLNode, ...args: any[]): any {}
}
