import {PrioritizedList} from "./PrioritizedList.js";

function ARRAY(list: FunctionList) {
    return Array.from(list);
}

export class FunctionList extends PrioritizedList<Function> {
    Execute(...data: any[]) {
        for (const item of ARRAY(this)) {
            let result = item.item(...data);
            if (result === false) return false;
        }
        return true;
    }

    asyncExecute(...data: any[]) {
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
