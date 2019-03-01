import {MathItem} from '../../core/MathItem.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {SerializedMmlVisitor} from '../../core/MmlTree/SerializedMmlVisitor.js';
import {OptionList, userOptions} from '../../util/Options.js';

export class MmlVisitor<N, T, D> extends SerializedMmlVisitor {

    public options: OptionList = {
        texHints: true,
        semantics: false,
    };

    public mathItem: MathItem<N, T, D> = null;

    /**
     * @override
     */
    public visitTree(node: MmlNode, math: MathItem<N, T, D> = null, options: OptionList = {}) {
        this.mathItem = math;
        userOptions(this.options, options);
        return this.visitNode(node, '');
    }

    /**
     * @override
     */
    public visitTeXAtomNode(node: MmlNode, space: string) {
        if (this.options.texHints) {
            return super.visitTeXAtomNode(node, space);
        }
        if (node.childNodes[0] && node.childNodes[0].childNodes.length === 1) {
            return this.visitNode(node.childNodes[0], space);
        }
        return space + '<mrow' +  this.getAttributes(node) + '>\n'
             + this.childNodeMml(node, space + '  ', '\n')
             + space + '</mrow>';
    }

    /**
     * @param {MmlNode} node    The math node to visit
     * @param {string} space    The number of spaces to use for indentation
     * @returns {string}        The serializied math element
     */
    public visitMathNode(node: MmlNode, space: string) {
        if (!this.options.semantics) {
            return super.visitDefault(node, space);
        }
        const addRow = node.childNodes.length && node.childNodes[0].childNodes.length > 1;
        return space + '<math' + this.getAttributes(node) + '>\n'
             + space + '  <semantics>\n'
             + (addRow ? space + '    <mrow>\n' : '')
             + this.childNodeMml(node, space + (addRow ? '      ' : '    '), '\n')
             + (addRow ? space + '    </mrow>\n' : '')
             + space + '    <annotation encoding="application/x-tex">' + this.mathItem.math + '</annotation>\n'
             + space + '  </semantics>\n'
             + space + '</math>';
    }

}
