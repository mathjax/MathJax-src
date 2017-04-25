export interface PrioritizedListItem<DataClass> {
    priority: number;
    item: DataClass;
}

export class PrioritizedList<DataClass> {
    public static DEFAULTPRIORITY: number = 5;

    protected items: PrioritizedListItem<DataClass>[] = [];
    protected i: number;

    constructor() {
        this.items = [];
    }

    public [Symbol.iterator]() {
        let i = 0;
        let items = this.items;
        return {
            next() {
                return {value: items[i++], done: (i > items.length)};
            }
        };
    }

    public Add(item: DataClass, priority = PrioritizedList.DEFAULTPRIORITY) {
        let i = this.items.length;
        do { i--; } while (i >= 0 && priority < this.items[i].priority);
        this.items.splice(i + 1, 0, {item: item, priority: priority});
        return item;
    }

    public Remove(item: DataClass) {
        let i = this.items.length;
        do { i--; } while (i >= 0 && this.items[i].item !== item);
        if (i >= 0) {
            this.items.splice(i, 1);
        }
    }

    public toArray() {
        return Array.from(this);
    }

}
