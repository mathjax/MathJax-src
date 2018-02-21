import {HandlerList} from './core/HandlerList.js';
import {handleRetriesFor, retryAfter} from './util/Retries.js';
import {OptionList} from './util/Options.js';

export const MathJax = {
    version: '3.0.0',
    handlers: new HandlerList(),

    document: function (document: any, options: OptionList) {
        return this.handlers.document(document, options);
    },

    handleRetriesFor: handleRetriesFor,
    retryAfter: retryAfter
};
