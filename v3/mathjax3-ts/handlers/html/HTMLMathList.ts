import {AbstractMathList} from '../../core/MathList.js';
import {HTMLMathItem} from './HTMLMathItem.js';

export class HTMLMathList extends AbstractMathList {

    public isBefore(a: HTMLMathItem, b: HTMLMathItem) {
        return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
    }

}
