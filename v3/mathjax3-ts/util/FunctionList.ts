import {PrioritizedList, PrioritizedListItem} from './PrioritizedList.js';

export interface FunctionListItem extends PrioritizedListItem<Function> {}

export class FunctionList extends PrioritizedList<Function> {
    public Execute(...data: any[]) {
        for (const item of this.toArray()) {
            let result = item.item(...data);
            if (result === false) return false;
        }
        return true;
    }

    public asyncExecute(...data: any[]) {
        let i = -1;
        let items = this.items;
        return new Promise((ok: Function, fail: Function) => {
            (function execute() {
                while (++i < items.length) {
                    let result = items[i].item(...data);
                    if (result instanceof Promise) {
                        result.then(execute).catch(err => fail(err));
                        return;
                    }
                    if (result === false) {
                        ok(false);
                        return;
                    }
                }
                ok(true);
            })();
        });
    }
};
