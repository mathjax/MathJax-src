import {UserOptions, DefaultOptions, OptionList} from '../util/Options.js';
import {MathDocument} from './MathDocument.js';
import {MathItem} from './MathItem.js';

export interface OutputJax {
    name: string;
    options: OptionList;

    Typeset(math: MathItem, document?: MathDocument): any;
    Escaped(math: MathItem, document?: MathDocument): any;
    GetMetrics(document: MathDocument): void;
    StyleSheet(document: MathDocument): any;
}

export interface OutputJaxClass {
    NAME: string;
    OPTIONS: OptionList;
    new(options?: OptionList): OutputJax;
}

export abstract class AbstractOutputJax implements OutputJax {
    public static NAME: string = 'generic';
    public static OPTIONS: OptionList = {};

    public options: OptionList;

    constructor(options: OptionList = {}) {
        let CLASS = this.constructor as OutputJaxClass;
        this.options = UserOptions(DefaultOptions({}, CLASS.OPTIONS), options);
    }

    public get name() {
        return (this.constructor as OutputJaxClass).NAME;
    }

    public Typeset(math: MathItem, document: MathDocument = null) {}

    public Escaped(math: MathItem, document: MathDocument = null) {}

    public GetMetrics(document: MathDocument) {}

    public StyleSheet(document: MathDocument) {}

}
