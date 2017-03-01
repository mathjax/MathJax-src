import {MmlVisitor} from './MmlVisitor';
import {MmlFactory} from './MmlFactory';
import {AMmlNode} from './MmlNode';
import {TextNode} from './Node';


export class SerlializedMmlVisitor extends MmlVisitor {
    visitTree(node: AMmlNode) {
        return this.visitNode(node,'');
    }
    visitTextNode(node: TextNode, space: string) {
        return (node as TextNode).getText();
    }
    visitInferredMrowNode(node: AMmlNode, space: string) {
        let mml = [];
        for (const child of node.childNodes) {
            mml.push(this.visitNode(child, space));
        }
        return mml.join("\n");
    }
    visitDefault(node: AMmlNode, space: string) {
        let kind = node.kind;
        let [nl, endspace] = (node.isToken || node.childNodes.length === 0 ? ['',''] : ['\n',space]);
        let mml = space + '<' + kind + this.getAttributes(node) + '>' + nl;
        space += "  ";
        for (const child of node.childNodes) {
            mml += this.visitNode(child, space ) + nl;
        }
        mml += endspace + '</' + kind + '>';
        return mml;
    }
    getAttributes(node: AMmlNode) {
        let ATTR = '';
        let attributes = node.getAttributes();
        for (const name of Object.keys(attributes)) {
            ATTR += ' ' + name + '="' + this.quoteAttribute(attributes[name].toString()) + '"';
        }
        return ATTR;
    }
    quoteAttribute(value: string) {
        return value
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/\"/g,'&quot;')
            .replace(/([\uD800-\uDBFF].)/g,(m,c) => {
                return '&#x' + ((c.charCodeAt(0) - 0xD800) * 0x400 +
                                (c.charCodeAt(1) - 0xDC00) + 0x10000).toString(16).toUpperCase() + ';';
            })
            .replace(/([\u0080-\uD7FF\uE000-\uFFFF])/g,(m,c) => {
                return '&#x' + c.charCodeAt(0).toString(16).toUpperCase() + ';';
            });
        ;
    }
}
