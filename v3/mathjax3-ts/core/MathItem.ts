import {MathDocument} from './MathDocument.js';
import {InputJax} from './InputJax.js';
import {OptionList} from '../util/Options.js';
import {MmlNode} from './MmlTree/MmlNode.js';

export interface Location {
    i?: number;
    n?: number;
    delim?: string;
    node?: Text | Element;
}

export interface Metrics {
    em: number;
    ex: number;
    containerWidth: number;
    lineWidth: number;
    scale: number;
}

export interface BBox {
}

export interface MathItem {
    math: string;
    inputJax: InputJax;
    display: boolean;
    start: Location;
    end: Location;
    root: MmlNode;
    typeset: Element;
    metrics: Metrics;
    bbox: BBox;
    inputData: OptionList;
    outputData: OptionList;

    Compile(document: MathDocument): void;
    Typeset(document: MathDocument): void;
    addEventHandlers(): void;
    UpdateDocument(document: MathDocument): void;
    RemoveFromDocument(restore: boolean): void;
    setMetrics(em: number, ex: number, cwidth: number, lwidth: number, scale: number): void;
    State(state?: number, restore?: boolean): number;

}

export interface ProtoItem {
    math: string;
    start: Location;
    end: Location;
    open?: string;
    close?: string;
    n?: number;
    display: boolean;
}

export abstract class AbstractMathItem implements MathItem {
    public static STATE = {
        UNPROCESSED: 0,
        COMPILED: 1,
        TYPESET: 2,
        INSERTED: 3
    };

    public math: string;
    public inputJax: InputJax;
    public display: boolean;
    public start: Location;
    public end: Location;
    public root: MmlNode = null;
    public typeset: Element = null;
    public state: number = STATE.UNPROCESSED;
    public metrics: Metrics = {} as Metrics;
    public bbox: BBox = {};
    public inputData: OptionList = {};
    public outputData: OptionList = {};

    constructor (math: string, jax: InputJax, display: boolean = true,
                 start: Location = {i: 0, n: 0, delim: ''},
                 end: Location = {i: 0, n: 0, delim: ''}) {
        this.math = math;
        this.inputJax = jax;
        this.display = display;
        this.start = start;
        this.end = end;
        this.root = null;
        this.typeset = null;
        this.state = STATE.UNPROCESSED;
        this.metrics = {} as Metrics;
        this.bbox = {};
        this.inputData = {};
        this.outputData = {};
    }

    public Compile(document: MathDocument) {
        if (this.State() < STATE.COMPILED) {
            this.root = this.inputJax.Compile(this);
            this.State(STATE.COMPILED);
        }
    }

    public Typeset(document: MathDocument) {
        if (this.State() < STATE.TYPESET) {
            if (this.display === null) {
                this.typeset = document.OutputJax.Escaped(this, document);
            } else {
                this.typeset = document.OutputJax.Typeset(this, document);
            }
            this.State(STATE.TYPESET);
        }
    }

    public addEventHandlers() {}

    public UpdateDocument(document: MathDocument) {}

    public RemoveFromDocument(restore: boolean = false) {}

    public setMetrics(em: number, ex: number, cwidth: number, lwidth: number, scale: number) {
        this.metrics = {
            em: em, ex: ex,
            containerWidth: cwidth,
            lineWidth: lwidth,
            scale: scale
        };
    }

    public State(state: number = null, restore: boolean = false) {
        if (state != null) {
            if (state < STATE.INSERTED && this.state >= STATE.INSERTED) {
                this.RemoveFromDocument(restore);
            }
            if (state < STATE.TYPESET && this.state >= STATE.TYPESET) {
                this.bbox = {};
                this.outputData = {};
            }
            if (state < STATE.COMPILED && this.state >= STATE.COMPILED) {
                this.inputData = {};
            }
            this.state = state;
        }
        return this.state;
    }

}

let STATE = AbstractMathItem.STATE;
