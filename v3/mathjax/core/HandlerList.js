import {FunctionList} from "../util/FunctionList.js";

export class HandlerList extends FunctionList {

  Register(handler) {return this.Add(handler,handler.priority)}
  UnRegister(handler) {this.Remove(handler)}
  
  HandlesDocument(document) {
    for (let item of this) {
      let handler = item.item;
      if (handler.HandlesDocument(document)) return handler;
    }
    throw new Error("Can't find handler for document");
  }
  HandlerFor(document,options) {
    return this.HandlesDocument(document).Create(document,options);
  }
};
