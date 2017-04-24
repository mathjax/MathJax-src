import {AbstractMathItem, Location} from '../../core/MathItem.js';
import {InputJax} from '../../core/InputJax.js';
import {HTMLDocument} from './HTMLDocument.js';

export class HTMLMathItem extends AbstractMathItem {

    public static STATE = AbstractMathItem.STATE;

    constructor(math: string, jax: InputJax, display: boolean = true,
                start: Location = {node: null, n: 0, delim: ''},
                end: Location = {node: null, n: 0, delim: ''}) {
        super(math, jax, display, start, end);
    }

    public addEventHandlers() {}

    public UpdateDocument(html: HTMLDocument) {
        if (this.State() < STATE.INSERTED) {
            let node = this.start.node as Text;
            if (node === this.end.node) {
                if (this.end.n < this.end.node.nodeValue.length) {
                    this.end.node.splitText(this.end.n);
                }
                if (this.start.n) {
                    node = (this.start.node as Text).splitText(this.start.n);
                }
                node.parentNode.replaceChild(this.typeset, node);
            } else {
                if (this.start.n) node = node.splitText(this.start.n);
                while (node !== this.end.node) {
                    let next = node.nextSibling as Text;
                    node.parentNode.removeChild(node);
                    node = next;
                }
                node.parentNode.insertBefore(this.typeset, node);
                if (this.end.n < node.nodeValue.length) {
                    node.splitText(this.end.n);
                    node.parentNode.removeChild(node);
                }
            }
            this.start.node = this.end.node = this.typeset;
            this.start.n = this.end.n = 0;
            this.State(STATE.INSERTED);
        }
    }

    public RemoveFromDocument(restore: boolean = false) {
        let node = this.start.node;
        if (restore) {
            let document = node.ownerDocument;
            let text = this.start.delim + this.math + this.end.delim;
            let math;
            if (this.inputJax.processStrings) {
                math = document.createTextNode(text);
            } else {
                let span = document.createElement('span');
                span.innerHTML = text;
                math = span.firstChild;
            }
            node.parentNode.insertBefore(math, node);
        }
        node.parentNode.removeChild(node);
    }

};

let STATE = HTMLMathItem.STATE;
