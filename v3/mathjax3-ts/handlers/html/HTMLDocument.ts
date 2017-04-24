import {MathDocument, AbstractMathDocument} from "../../core/MathDocument.js";
import {DefaultOptions, UserOptions, OptionList} from "../../util/Options.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {HTMLMathList} from "./HTMLMathList.js";
import {HTMLDomStrings} from "./HTMLDomStrings.js";
import {InputJax} from "../../core/InputJax.js";
import {MathItem, ProtoItem} from "../../core/MathItem.js";

export type HTMLNodeList = [Element, number][][];

export class HTMLDocument extends AbstractMathDocument {

    public static KIND: string = 'HTML';
    public static OPTIONS = DefaultOptions({
        MathList: HTMLMathList,
        DomStrings: null
    }, AbstractMathDocument.OPTIONS);
    public static STATE = AbstractMathDocument.STATE;

    public DomStrings: HTMLDomStrings;

    constructor(document: any, options: OptionList) {
        super(document,options);
        this.DomStrings = this.options['DomStrings'] || new HTMLDomStrings();
    }

    protected FindPosition(N: number, index: number, delim: string, nodes: HTMLNodeList) {
        for (const list of nodes[N]) {
            let [node, n] = list;
            if (index <= n) {
                return {node:node, n:index, delim:delim};
            } else {
                index -= n;
            }
        }
        return {node:null, n:0, delim:delim};
    }

    protected MathItem(item: ProtoItem, jax: InputJax, nodes: HTMLNodeList) {
        let math = item.math;
        let start = this.FindPosition(item.n, item.start.n, item.open, nodes);
        let end = this.FindPosition(item.n, item.end.n, item.close, nodes);
        return new HTMLMathItem(math, jax, item.display, start, end);
    }

    protected getElements(nodes: (string | Element | Element[])[], document: Document) {
        let containers: Element[] = [];
        for (const node of nodes) {
            if (typeof(node) === 'string') {
                containers = containers.concat(Array.from(document.querySelectorAll(node)));
            } else if (Array.isArray(node)) {
                containers = containers.concat(node);
            } else {
                containers.push(node);
            }
        }
        return containers;
    }

    FindMath(options: OptionList) {
        options = UserOptions({elements: [this.document.body]}, options);
        if (!this.processed.FindMath) {
            for (const container of this.getElements(options['elements'], this.document)) {
                let [strings, nodes] = this.DomStrings.Find(container);
                for (const jax of this.InputJax) {
                    let list = new (this.options['MathList'])();
                    if (jax.processStrings) {
                        for (const math of jax.FindMath(strings)) {
                            list.push(this.MathItem(math, jax, nodes));
                        }
                    } else {
                        for (const math of jax.FindMath(container)) {
                            let item = new HTMLMathItem(math.math,jax,math.display,math.start,math.end);
                            list.push(item);
                        }
                    }
                    this.math.merge(list);
                }
            }
            this.processed.FindMath = true;
        }
        return this;
    }

    UpdateDocument() {
        if (!this.processed.UpdateDocument) {
            super.UpdateDocument();
            let sheet = this.DocumentStyleSheet();
            if (sheet) {
                let styles = this.document.getElementById(sheet.id);
                if (styles) {
                    styles.parentNode.replaceChild(sheet,styles);
                } else {
                    this.document.head.appendChild(sheet);
                }
            }
            this.processed.UpdateDocument = true;
        }
        return this;
    }

    RemoveFromDocument(restore: boolean = false) {
        if (this.processed.UpdateDocument) {
            for (const math of this.math.toArray()) {
                if (math.State() >= STATE.INSERTED) {
                    math.State(STATE.TYPESET,restore);
                }
            }
        }
        this.processed.UpdateDocument = false;
        return this;
    }

    DocumentStyleSheet() {
        return this.OutputJax.StyleSheet(this);
    }

    TestMath(string: string, display: boolean = true) {
        if (!this.processed['TestMath']) {
            let math = new HTMLMathItem(string,this.InputJax[0],display)
            math.setMetrics(6,14,1000000,1000000,1);
            this.math.push(math);
            this.processed['TestMath'] = true;
        }
        return this;
    }

};

let STATE = HTMLDocument.STATE;
