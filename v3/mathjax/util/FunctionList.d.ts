import {PrioritizedList} from "./PrioritizedList.js";

export class FunctionList extends PrioritizedList {
    Execute(...data: any): boolean;
    asyncExecute(...data: any): void;
};
