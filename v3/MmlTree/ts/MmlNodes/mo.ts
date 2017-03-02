import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT} from '../MmlNode';

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
}
