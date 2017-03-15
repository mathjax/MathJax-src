import {MmlVisitor} from './MmlVisitor';
import {MmlFactory} from './MmlFactory';
import {MmlNode, TextNode, XMLNode} from './MmlNode';
import {PropertyList} from './Node';

export class TestMmlVisitor extends MmlVisitor {
    visitTree(node: MmlNode) {
        return this.visitNode(node,'');
    }
    visitTextNode(node: TextNode, space: string) {
        return node.getText();
    }
    visitXMLNode(node: XMLNode, space: string) {
        return 'XML Node not implemented';
    }
    visitInferredMrowNode(node: MmlNode, space: string) {
        let mml = [];
        for (const child of node.childNodes) {
            mml.push(this.visitNode(child, space));
        }
        return mml.join("\n");
    }
    visitDefault(node: MmlNode, space: string) {
        let kind = node.kind;
        let [nl, endspace] = (node.isToken || node.childNodes.length === 0 ? ['',''] : ['\n',space]);
        let mml = space + '<' + kind + this.getAttributes(node) +
            this.getInherited(node) + this.getProperties(node) + '\n' + space + '   ' +
            this.attributeString({
                isEmbellished: node.isEmbellished,
                isSpacelike: node.isSpacelike,
                texClass: node.texClass
            }, '{', '}') +
            '>' + nl;
        space += "  ";
        for (const child of node.childNodes) {
            mml += this.visitNode(child, space ) + nl;
        }
        mml += endspace + '</' + kind + '>';
        return mml;
    }
    getAttributes(node: MmlNode) {
        return this.attributeString(node.attributes.getAllAttributes(), '', '');
    }
    getInherited(node: MmlNode) {
        return this.attributeString(node.attributes.getAllInherited(), '[', ']');
    }
    getProperties(node: MmlNode) {
        return this.attributeString(node.getAllProperties(), '[[', ']]');
    }
    attributeString(attributes: PropertyList, open: string, close: string) {
        let ATTR = '';
        for (const name of Object.keys(attributes)) {
            ATTR += ' ' + open + name + '="' + this.quoteAttribute(String(attributes[name])) + '"' + close;
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
    }
}
