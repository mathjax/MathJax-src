import {AbstractOutputJax} from '../core/OutputJax.js';
import {LegacyCHTML} from '../../mathjax2/output/CommonHTML.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';

export class CHTML extends AbstractOutputJax {

    public static NAME: string = 'CHTML';
    public static OPTIONS: OptionList = {
        ...AbstractOutputJax.OPTIONS
    };

    //
    //  Typeset a MathItem tree
    //
    public Typeset(math: MathItem, html: MathDocument) {
        return LegacyCHTML.Typeset(math, html);
    }

    //
    //  Handle an escaped character
    //  (put it in a span so that it won't be a delimiter if
    //  the page is typeset again).
    //
    public Escaped(math: MathItem, html: MathDocument) {
        let span = html.document.createElement('span');
        span.appendChild(html.document.createTextNode(math.math));
        return span;
    }

    //
    //  Determine metrics for the locations of the math elements
    //
    public GetMetrics(html: MathDocument) {
        return LegacyCHTML.GetMetrics(html);
    }

    //
    //  Produces the CSS style element for the CommonHTML output
    //
    public StyleSheet(html: MathDocument) {
        return LegacyCHTML.StyleSheet(html);
    }

};
