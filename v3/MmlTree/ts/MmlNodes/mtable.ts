import {PropertyList} from '../Node';
import {AMmlNode, MmlNode, AttributeList, DEFAULT, TEXCLASS} from '../MmlNode';
import {ANode} from '../Node';

export class MmlMtable extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        align: 'axis',
        rowalign: 'baseline',
        columnalign: 'center',
        groupalign: '{left}',
        alignmentscope: true,
        columnwidth: 'auto',
        width: 'auto',
        rowspacing: '1ex',
        columnspacing: '.8em',
        rowlines: 'none',
        columnlines: 'none',
        frame:'none',
        framespacing: '0.4em 0.5ex',
        equalrows: false,
        equalcolumns: false,
        displaystyle: false,
        side: 'right',
        minlabelspacing: '0.8em'
    };
    properties = {
        useHeight: 1
    }
    _texClass = TEXCLASS.ORD;

    get kind() {return 'mtable'}
    get linebreakContainer() {return true}
    //
    //  FIXME:  this should be in MathML input jax, not here
    //
    appendChild(child: MmlNode) {
        if (!(child instanceof this.factory.getNodeClass('mtr')) &&
            !(child instanceof this.factory.getNodeClass('mlabeledtr'))) {
            child = this.factory.create('mtr',child);
        }
        return super.appendChild(child);
    }

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        display = !!(this.getAttribute('displaystyle') || this.defaults['displaystyle']);
        attributes = this.addInheritedAttributes(attributes, this.getAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }
}
