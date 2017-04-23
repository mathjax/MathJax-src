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
    new(options?: OptionList): OutputJax;
    NAME: string;
    OPTIONS: OptionList;
}

export abstract class AbstractOutputJax implements OutputJax {
    public static NAME: string = 'Generic';
    public static OPTIONS: OptionList = {};

    public name: string;
    public options: OptionList;

    constructor(options: OptionList = {}) {
        let CLASS = this.constructor as OutputJaxClass;
        this.name = CLASS.NAME;
        this.options = UserOptions(DefaultOptions({}, CLASS.OPTIONS), options);
    }

    Typeset(math: MathItem, document: MathDocument = null) {
    }

    Escaped(math: MathItem, document: MathDocument = null) {
    }

    GetMetrics(document: MathDocument) {
    }

    StyleSheet(document: MathDocument) {
    }

};
