import {MathList} from '../../core/MathList.js';

export class HTMLMathList extends MathList {
  
  isBefore(a,b) {
    return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
  }
  
};
