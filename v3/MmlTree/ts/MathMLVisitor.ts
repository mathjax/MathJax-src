import {MmlVisitor} from './MmlVisitor';
import {MmlFactory} from './MmlFactory';
import {AMmlNode} from './MmlNode';
import {TextNode} from './Node';

export class MathMLVisitor extends MmlVisitor {
    protected document: any = null;
    visitTree(node: AMmlNode, document: any) {
        this.document = document;
        let root = document.createElement('top');
        this.visitNode(node,root);
        this.document = null;
        return root.firstChild;
    }
    visitTextNode(node: TextNode, parent: Element) {
        parent.appendChild(this.document.createTextNode((node as TextNode).getText()));
    }
    visitInferredMrowNode(node: AMmlNode, parent: Element) {
        for (const child of node.childNodes) {
            this.visitNode(child, parent);
        }
    }
    visitDefault(node: AMmlNode, parent: Element) {
        let mml = this.document.createElement(node.kind);
        this.addAttributes(node, mml);
        for (const child of node.childNodes) {
            this.visitNode(child, mml);
        }
        parent.appendChild(mml);
    }
    addAttributes(node: AMmlNode, mml: Element) {
        let attributes = node.attributes;
        let names = attributes.getExplicitNames();
        for (const name of names) {
            mml.setAttribute(name, attributes.get(name).toString());
        }
    }
}
