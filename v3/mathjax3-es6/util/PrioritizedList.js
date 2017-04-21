export class PrioritizedList {
  constructor() {
    this.items = [];
  }
  
  [Symbol.iterator]() {
    let i = 0;
    let items = this.items;
    return {
      next() {
        return {value: items[i++], done: (i > items.length)}
      }
    };
  }
  
  Add(item,priority=PrioritizedList.DEFAULTPRIORITY) {
    let i = this.items.length;
    do {i--} while (i >= 0 && priority < this.items[i].priority);
    this.items.splice(i+1,0,{item:item, priority:priority});
    return item;
  }
  Remove(item) {
    let i = this.items.length;
    do {i--} while (i >= 0 && this.items[i].item !== item);
    if (i >= 0) delete this.items[i];
  }

};

PrioritizedList.DEFAULTPRIORITY = 5;
