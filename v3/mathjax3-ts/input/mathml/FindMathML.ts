import {AbstractFindMath} from '../../core/FindMath.js';
import {OptionList} from '../../util/Options.js';
import {ProtoItem} from '../../core/MathItem.js';

const NAMESPACE = 'http://www.w3.org/1998/Math/MathML';

export type NodeSet = Set<Element>;

//
//  Locates MathML expressions within DOM nodes
//
export class FindMathML extends AbstractFindMath {

    public static OPTIONS: OptionList = {};

    //
    //  Locate MathML nodes in the DOM
    //
    public FindMath(node: Element) {
        let set: NodeSet = new Set<Element>();
        this.FindMathNodes(node, set);
        this.FindMathPrefixed(node, set);
        if (node.ownerDocument.documentElement.nodeName === 'html' &&  set.size === 0) {
            this.FindMathNS(node, set);
        }
        return this.ProcessMath(set);
    }

    //
    //  Find plain <math> tags
    //
    protected FindMathNodes(node: Element, set: NodeSet) {
        for (const math of Array.from(node.getElementsByTagName('math'))) {
            set.add(math);
        }
    }

    //
    //  Find <m:math> tags (or whatever prefixes there are)
    //
    protected FindMathPrefixed(node: Element, set: NodeSet) {
        let html = node.ownerDocument.documentElement;
        for (const attr of Array.from(html.attributes)) {
            if (attr.nodeName.substr(0, 6) === 'xmlns:' && attr.nodeValue === NAMESPACE) {
                let prefix = attr.nodeName.substr(6);
                for (const math of Array.from(node.getElementsByTagName(prefix + ':math'))) {
                    set.add(math);
                }
            }
        }
    }

    //
    //  Find namespaced math in XHTML documents (is this really needed?)
    //
    protected FindMathNS(node: Element, set: NodeSet) {
        for (const math of Array.from(node.getElementsByTagNameNS(NAMESPACE, 'math'))) {
            set.add(math);
        }
    }

    //
    //  Produce the array of math records that can be converted into MathItems
    //
    protected ProcessMath(set: NodeSet) {
        let math: ProtoItem[] = [];
        for (const mml of Array.from(set)) {
            let display = (mml.getAttribute('display') === 'block' ||
                           mml.getAttribute('mode') === 'display');
            let start = {node: mml, n: 0, delim: ''};
            let end   = {node: mml, n: 0, delim: ''};
            math.push({math: (mml as HTMLElement).outerHTML, start, end, display});
        }
        return math;
    }

};
