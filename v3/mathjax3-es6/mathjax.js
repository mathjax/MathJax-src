import {HandlerList} from "./core/HandlerList.js";
import {HandleRetriesFor,RetryAfter} from "./util/Retries.js";

export const MathJax = {
  version: "3.0.0",
  handlers: new HandlerList(),
  
  HandlerFor: function (document,options) {
    return this.handlers.HandlerFor(document,options);
  },
  
  HandleRetriesFor: HandleRetriesFor,
  RetryAfter: RetryAfter
};
