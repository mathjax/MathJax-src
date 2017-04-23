import {MathDocument, AbstractMathDocument} from "./MathDocument.js";
import {OptionList} from "../util/Options.js";

export interface Handler {
    name: string;
    priority: number;

    HandlesDocument(document: any): boolean;
    Create(document: any, options: OptionList): MathDocument;
}

class defaultMathDocument extends AbstractMathDocument {}

export abstract class AbstractHandler implements Handler {

    public name: string;
    public priority: number;

    constructor(name: string, priority: number = 5) {
        this.name = name;
        this.priority = priority;
    }

    HandlesDocument(document: any) {
        return false;
    }

    Create(document: any, options: OptionList) {
        return new defaultMathDocument(document, options) as MathDocument;
    }

};
