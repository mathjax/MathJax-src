import {MathDocument, AbstractMathDocument} from './MathDocument.js';
import {OptionList} from '../util/Options.js';

export interface Handler {
    name: string;
    priority: number;

    HandlesDocument(document: any): boolean;
    Create(document: any, options: OptionList): MathDocument;
}

export interface HandlerClass {
    new(priority?: number): Handler;
    NAME: string;
}

class defaultMathDocument extends AbstractMathDocument {}

export abstract class AbstractHandler implements Handler {

    public static NAME: string = 'generic';

    public priority: number;

    constructor(priority: number = 5) {
        this.priority = priority;
    }

    public get name() {
        return (this.constructor as HandlerClass).NAME;
    }

    public HandlesDocument(document: any) {
        return false;
    }

    public Create(document: any, options: OptionList) {
        return new defaultMathDocument(document, options) as MathDocument;
    }

};
