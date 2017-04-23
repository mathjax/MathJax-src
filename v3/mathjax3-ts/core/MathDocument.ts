import {UserOptions, DefaultOptions, OptionList} from '../util/Options.js';
import {InputJax, AbstractInputJax} from './InputJax.js';
import {OutputJax, AbstractOutputJax} from './OutputJax.js';
import {MathList, MathListClass} from './MathList.js';
import {MathItem, AbstractMathItem} from './MathItem.js';

export interface MathDocument {
    document: any;
    kind: string;
    options: OptionList;
    math: MathList;
    processed: {[name: string]: boolean};
    InputJax: InputJax[];
    OutputJax: OutputJax;

    FindMath(options: OptionList): MathDocument;
    Compile(): MathDocument;
    Typeset(): MathDocument;
    GetMetrics(): MathDocument;
    AddEventHandlers(): MathDocument;
    UpdateDocument(): MathDocument;
    RemoveFromDocument(restore?: boolean): MathDocument;
    State(state: number, restore: boolean): MathDocument;
    Reset(): MathDocument;
    Clear(): MathDocument;
    Concat(collection: MathDocument): MathDocument;

}

export interface MathDocumentClass {
    new(document: any, options?: OptionList): MathDocument;
    KIND: string;
    OPTIONS: OptionList;
}

export interface MathProcessed {
    FindMath: boolean;
    Compile: boolean;
    Typeset: boolean;
    GetMetrics: boolean;
    AddEventHandlers: boolean;
    UpdateDocument: boolean;
    [name: string]: boolean;
}

class defaultInputJax extends AbstractInputJax {}
class defaultOutputJax extends AbstractOutputJax {}

export abstract class AbstractMathDocument implements MathDocument {

    public static KIND: string = 'MathDocument';
    public static OPTIONS: OptionList = {
        OutputJax: null,
        InputJax: null,
        MathList: MathList
    };
    public static STATE = AbstractMathItem.STATE;

    public document: any;
    public kind: string;
    public options: OptionList;
    public math: MathList;
    public processed: MathProcessed;
    public InputJax: InputJax[];
    public OutputJax: OutputJax;

    constructor (document: any, options: OptionList) {
        let CLASS = this.constructor as MathDocumentClass;
        this.document = document;
        this.kind = CLASS.KIND;
        this.options = UserOptions(DefaultOptions({}, CLASS.OPTIONS), options);
        this.math = new (this.options['MathList'] as MathListClass)();
        this.processed = {
            FindMath: false,
            Compile: false,
            Typeset: false,
            GetMetrics: false,
            AddEventHandlers: false,
            UpdateDocument: false
        };
        this.InputJax = this.options['InputJax'] || [new defaultInputJax()];
        this.OutputJax = this.options['OutputJax'] || new defaultOutputJax();
        if (!Array.isArray(this.InputJax)) this.InputJax = [this.InputJax];
    }

    FindMath(options: OptionList) {
        this.processed.FindMath = true;
        return this;
    }

    Compile() {
        if (!this.processed.Compile) {
            for (const math of this.math.toArray()) {
                if (math) math.Compile(this);
            }
            this.processed.Compile = true;
        }
        return this;
    }

    Typeset() {
        if (!this.processed.Typeset) {
            for (const math of this.math.toArray()) {
                if (math) math.Typeset(this);
            }
            this.processed.Typeset = true;
        }
        return this;
    }

    GetMetrics() {
        if (!this.processed.GetMetrics) {
            this.OutputJax.GetMetrics(this);
            this.processed.GetMetrics = true;
        }
        return this;
    }

    AddEventHandlers() {
        this.processed.AddEventHandlers = true;
        return this;
    }

    UpdateDocument() {
        if (!this.processed.UpdateDocument) {
            for (const math of this.math.reversed().toArray()) {
                math.UpdateDocument(this);
            }
            this.processed.UpdateDocument = true;
        }
        return this;
    }

    RemoveFromDocument(restore: boolean = false) {
        return this;
    }

    State(state: number, restore: boolean = false) {
        for (const math of this.math.toArray()) {
            math.State(state,restore);
        }
        if (state < STATE.INSERTED) {
            this.processed.UpdateDocument = false;
        }
        if (state < STATE.TYPESET) {
            this.processed.Typeset = false;
            this.processed.AddEventHandlers = false;
            this.processed.GetMetrics = false;
        }
        if (state < STATE.COMPILED) {
            this.processed.Compile = false;
        }
        return this;
    }

    Reset() {
        for (const key of Object.keys(this.processed)) {
            this.processed[key] = false;
        }
        return this;
    }

    Clear() {
        this.Reset();
        this.math.Clear();
        return this;
    }

    Concat(collection: MathDocument) {
        this.math.merge(collection.math);
        return this;
    }

};

let STATE = AbstractMathDocument.STATE;
