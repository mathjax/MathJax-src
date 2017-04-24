import {AbstractInputJax} from "../core/InputJax.js";
import {DefaultOptions, SeparateOptions, OptionList} from "../util/Options.js";
import {FunctionList} from "../util/FunctionList.js";
import {MathItem, ProtoItem} from "../core/MathItem.js";

import {FindMathML} from "./mathml/FindMathML.js";
import {MathMLCompile} from "./mathml/MathMLCompile.js";

export class MathML extends AbstractInputJax {

    public static NAME: string = "MathML";
    public static OPTIONS: OptionList = DefaultOptions({
        parseAs: 'html',
        forceReparse: false,
        FindMathML: null,
        MathMLCompile: null,
        DOMParser: null,
        parseError: function (node: Element) {this.Error(node.textContent.replace(/\n.*/g,''))}
    }, AbstractInputJax.OPTIONS);

    protected FindMathML: FindMathML;
    protected MathML: MathMLCompile;
    protected parser: DOMParser;
    protected mmlFilters: FunctionList;

    constructor(options: OptionList) {
        let [mml, find, compile] = SeparateOptions(options, FindMathML.OPTIONS, MathMLCompile.OPTIONS);
        super(mml);
        this.processStrings = false;
        this.FindMathML = this.options['FindMathML'] || new FindMathML(find);
        this.MathML = this.options['MathMLCompile'] || new MathMLCompile(compile);
        this.parser = this.options['DOMParser'] || new DOMParser();
        this.mmlFilters = new FunctionList();
    }

    Compile(math: MathItem) {
        let mml = math.start.node;
        if (!mml || this.options['forceReparse']) {
            let mathml = this.executeFilters(this.preFilters, math, math.math || '<math></math>');
            let doc = this.parser.parseFromString(mathml, "text/" + this.options['parseAs']);
            doc = this.checkForErrors(doc);
            if (doc.body) {
                if (doc.body.childNodes.length !== 1) {
                    this.Error('MathML must consist of a single element');
                }
                mml = doc.body.removeChild(doc.body.firstChild) as Element;
            } else {
                mml = doc.removeChild(doc.firstChild) as Element;
            }
            if (mml.nodeName.toLowerCase().replace(/^[a-z]+:/,"") !== "math") {
                this.Error('MathML must be formed by a <math> element, not <' +
                           mml.nodeName.toLowerCase() + '>');
            }
        }
        mml = this.executeFilters(this.mmlFilters, math, mml);
        return this.executeFilters(this.postFilters, math, this.MathML.Compile(mml as HTMLElement));
    }

    executeFilters(filters: FunctionList, math: MathItem, data: any) {
        let args = {math: math, data: data};
        filters.Execute(args);
        return args.data;
    }

    checkForErrors(doc: Document) {
        let err = doc.querySelector('parsererror');
        if (err) {
            if (err.textContent === '') {
                this.Error('Error processing MathML');
            }
            this.options['parseError'].call(this,err);
        }
        return doc;
    }

    FindMath(node: Element) {
        return this.FindMathML.FindMath(node);
    }

    Error(message: string) {
        // FIXME:  should this be creating merror nodes instead?
        throw new Error(message);
    }

};
