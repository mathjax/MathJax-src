import {HandlerList} from './core/HandlerList.js';
import {DOMAdaptor} from './core/DOMAdaptor.js';
import {handleRetriesFor, retryAfter} from './util/Retries.js';
import {OptionList} from './util/Options.js';

export const MathJax = {
    version: '3.0.0',
    handlers: new HandlerList(),

    document: function (document: any, adaptor: DOMAdaptor<any, any, any>, options: OptionList) {
        return this.handlers.document(document, adaptor, options);
    },

    handleRetriesFor: handleRetriesFor,
    retryAfter: retryAfter
};
