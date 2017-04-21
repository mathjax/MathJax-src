export interface PriorityListItem {
    priority: number;
    item: any;
}

export class PrioritizedList {
    public static DEFAULTPRIORITY: number = 5;

    protected items: PriorityListItem[] = [];
    protected i: number;

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

    Add(item: PriorityListItem, priority = PrioritizedList.DEFAULTPRIORITY) {
        let i = this.items.length;
        do {i--} while (i >= 0 && priority < this.items[i].priority);
        this.items.splice(i+1, 0, {item: item, priority: priority});
        return item;
    }

    Remove(item: PriorityListItem) {
        let i = this.items.length;
        do {i--} while (i >= 0 && this.items[i].item !== item);
        if (i >= 0) delete this.items[i];
    }

};
