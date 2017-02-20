import {PrioritizedList} from "./PrioritizedList.js";

export class FunctionList extends PrioritizedList {
  Execute(...data) {
    for (const item of this) {
      let result = item.item(...data);
      if (result === false) return false;
    }
    return true;
  }
  
  asyncExecute(...data) {
    let i = -1;
    let items = this.items;
    return new Promise((ok,fail) => {
      (function execute() {
        while (++i < items.length) {
          let result = items[i].item(...data);
          if (result instanceof Promise) return result.then(execute).catch(err => fail(err));
          if (result === false) return ok(false);
        }
        ok(true);
      })();
    });
  }
};
