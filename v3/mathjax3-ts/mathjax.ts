import {HandlerList} from './core/HandlerList.js';
import {HandleRetriesFor, RetryAfter} from './util/Retries.js';
import {OptionList} from './util/Options.js';

export const MathJax = {
    version: '3.0.0',
    handlers: new HandlerList(),

    Document: function (document: any, options: OptionList) {
        return this.handlers.Document(document, options);
    },

    HandleRetriesFor: HandleRetriesFor,
    RetryAfter: RetryAfter
};
