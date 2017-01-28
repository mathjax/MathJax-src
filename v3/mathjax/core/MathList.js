import {LinkedList} from '../util/LinkedList.js';

export class MathList extends LinkedList {
  
  isBefore(a,b) {
    return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
  }
  
};
