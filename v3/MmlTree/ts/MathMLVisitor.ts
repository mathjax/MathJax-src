import {MmlVisitor} from './MmlVisitor';
import {MmlFactory} from './MmlFactory';
import {MmlNode, TextNode, XMLNode} from './MmlNode';

export class MathMLVisitor extends MmlVisitor {
    protected document: any = null;
    visitTree(node: MmlNode, document: any) {
        this.document = document;
        let root = document.createElement('top');
        this.visitNode(node,root);
        this.document = null;
        return root.firstChild;
    }
    visitTextNode(node: TextNode, parent: Element) {
        parent.appendChild(this.document.createTextNode(node.getText()));
    }
    visitXMLNode(node: XMLNode, parent: Element) {
        parent.appendChild((node.getXML() as Element).cloneNode(true));
    }
    visitInferredMrowNode(node: MmlNode, parent: Element) {
        for (const child of node.childNodes) {
            this.visitNode(child, parent);
        }
    }
    visitDefault(node: MmlNode, parent: Element) {
        let mml = this.document.createElement(node.kind);
        this.addAttributes(node, mml);
        for (const child of node.childNodes) {
            this.visitNode(child, mml);
        }
        parent.appendChild(mml);
    }
    addAttributes(node: MmlNode, mml: Element) {
        let attributes = node.attributes;
        let names = attributes.getExplicitNames();
        for (const name of names) {
            mml.setAttribute(name, attributes.get(name).toString());
        }
    }
}
