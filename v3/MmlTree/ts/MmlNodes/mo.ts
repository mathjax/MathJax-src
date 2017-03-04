import {PropertyList} from '../Node';
import {AMmlTokenNode, AMmlNode, DEFAULT} from '../MmlNode';

export class MmlMo extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        mathvariant: DEFAULT.AUTO,
        form: DEFAULT.AUTO,
        fence: DEFAULT.AUTO,
        separator: DEFAULT.AUTO,
        lspace: DEFAULT.AUTO,
        rspace: DEFAULT.AUTO,
        stretchy: DEFAULT.AUTO,
        symmetric: DEFAULT.AUTO,
        maxsize: DEFAULT.AUTO,
        minsize: DEFAULT.AUTO,
        largeop: DEFAULT.AUTO,
        movablelimits: DEFAULT.AUTO,
        accent: DEFAULT.AUTO,
        linebreak: "auto",
        lineleading: DEFAULT.INHERIT,
        linebreakstyle: DEFAULT.AUTO,
        linebreakmultchar: DEFAULT.INHERIT,
        indentalign: DEFAULT.INHERIT,
        indentshift: DEFAULT.INHERIT,
        indenttarget: DEFAULT.INHERIT,
        indentalignfirst: DEFAULT.INHERIT,
        indentshiftfirst: DEFAULT.INHERIT,
        indentalignlast: DEFAULT.INHERIT,
        indentshiftlast: DEFAULT.INHERIT
    };

    get kind() {return 'mo'}
    get isEmbellished() {return true}
    get hasNewLine() {return this.Get('linebreak') === 'newline'}

    coreParent() {
        let parent: AMmlNode = this;
        let math = this.factory.getNodeClass('math');
        while (parent && parent.isEmbellished && parent.coreMO() === this && !(parent instanceof math)) {
            parent = (parent as AMmlNode).parent as AMmlNode;
        }
        return parent;
    }
    coreText(parent: AMmlNode) {
        if (!parent) return '';
        if (parent.isEmbellished) return (parent.coreMO() as MmlMo).getText();
        while ((((parent.isKind('mrow') || parent.isKind('TeXAtom') || parent.isKind('mstyle') ||
                  parent.isKind('mphantom')) && parent.childNodes.length === 1) ||
                parent.isKind('munderover')) && parent.childNodes[0]) {
            parent = parent.childNodes[0] as AMmlNode;
        }
        return (parent.isToken ? (parent as AMmlTokenNode).getText() : '');
    }
}
