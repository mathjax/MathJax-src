import {LinkedList, LinkedListClass} from '../util/LinkedList.js';
import {MathItem, AbstractMathItem} from './MathItem.js';

export interface MathListClass extends LinkedListClass<MathItem> {
    new(...args: MathItem[]): MathList;
}

export class MathList extends LinkedList<MathItem> {

    public isBefore(a: MathItem, b: MathItem) {
        return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
    }

};
