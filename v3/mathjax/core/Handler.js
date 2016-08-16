import {Document} from "./Document.js";

export class Handler {
  constructor(name,priority = 5) {
    this.name = name;
    this.priority = priority;
  }
  
  HandlesDocument(document) {
    return false;
  }
  Create(document,options) {
    return new Document(document,"unknown",options);
  }
};
