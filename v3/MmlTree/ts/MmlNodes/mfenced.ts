import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, IMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMfenced extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        open: '(',
        close: ')',
        separators: ','
    };
    texClass = TEXCLASS.INNER;

    protected separators: MmlNode[] = [];
    protected open: MmlNode = null;
    protected close: MmlNode = null;

    get kind() {return 'mfenced'}

    setTeXclass(prev: MmlNode) {
        this.addFakeNodes();
        this.getPrevClass(prev);
        if (this.open) {
            prev = this.open.setTeXclass(prev);
        }
        if (this.childNodes[0]) {
            prev = this.childNodes[0].setTeXclass(prev);
        }
        for (let i = 0, m = this.childNodes.length; i < m; i++) {
            if (this.separators[i]) {
                prev = this.separators[i].setTeXclass(prev);
            }
            if (this.childNodes[i]) {
                prev = this.childNodes[i].setTeXclass(prev);
            }
        }
        if (this.close) {
            prev = this.close.setTeXclass(prev);
        }
        this.updateTeXclass(this.open);
        return prev;
    }

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        this.addFakeNodes();
        for (const child of [this.open, this.close].concat(this.separators)) {
            if (child) {
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }

    addFakeNodes() {
        let {open, close, separators} = this.attributes.getList('open', 'close', 'separators') as
                                            {open: string, close: string, separators: string};
        open = open.replace(/[ \t\n\r]/g,'');
        close = close.replace(/[ \t\n\r]/g,'');
        separators = separators.replace(/[ \t\n\r]/g,'');
        //
        // Create open node
        //
        if (open) {
            let text = this.factory.create('text').setText(open);
            this.open = this.factory.create('mo', {fence: true, form: 'prefix'}, [text]);
            this.open.texClass = TEXCLASS.OPEN;
            this.open.parent = this;
        }
        //
        // Create nodes for the separators
        //
        if (separators) {
            while (separators.length < this.childNodes.length - 1) {
                separators += separators.charAt(separators.length - 1);
            }
            let i = 0;
            for (const child of this.childNodes.slice(1)) {
                if (child) {
                    let text = this.factory.create('text').setText(separators.charAt(i));
                    let mo = this.factory.create('mo', {}, [text]);
                    mo.parent = this;
                    this.separators.push(mo);
                }
            }
        }
        //
        //  Crete close node
        //
        if (close) {
            let text = this.factory.create('text').setText(close);
            this.close = this.factory.create('mo', {fence: true, form: 'postfix'}, [text]);
            this.close.texClass = TEXCLASS.CLOSE;
            this.close.parent = this;
        }
    }
}
