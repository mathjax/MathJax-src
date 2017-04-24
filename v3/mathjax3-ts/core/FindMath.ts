import {UserOptions, DefaultOptions, OptionList} from '../util/Options.js';
import {ProtoItem} from './MathItem.js';

export interface FindMath {
    FindMath(node: Element): ProtoItem[];
    FindMath(strings: string[]): ProtoItem[];
}

export interface FindMathClass {
    new(options: OptionList): FindMath;
    OPTIONS: OptionList;
}

export abstract class AbstractFindMath implements FindMath {
    public static OPTIONS: OptionList = {};

    protected options: OptionList;

    constructor(options: OptionList) {
        let CLASS = this.constructor as FindMathClass;
        this.options = UserOptions(DefaultOptions({}, CLASS.OPTIONS), options);
    }

    //
    //  Locate math in an Element or a string array;
    //
    public FindMath(node: Element | string[]) {
        return [] as ProtoItem[];
    }

}
