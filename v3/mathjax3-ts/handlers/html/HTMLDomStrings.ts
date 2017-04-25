import {UserOptions, DefaultOptions, OptionList} from '../../util/Options.js';

//
//  Make sure an option is an Array
//
const MAKEARRAY = function (x: string): string[] {
    return (Array.isArray(x) ? x : [x]);
};

//
//  Class interface for HTMLDomStrings
//
export interface HTMLDomStringsClass {
    OPTIONS: OptionList;
    new(options: OptionList): HTMLDomStrings;
}

//
//  List of nodes and their indices
//
export type HTMLNodeList = [Element, number][];

//
//  A class for finding the strings in a DOM object
//
export class HTMLDomStrings {

    public static OPTIONS: OptionList = {
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml'],
                                          // The names of the tags whose contents will not be
                                          // scanned for math delimiters

        includeTags: {br: '\n', wbr: '', '#comment': ''},
                                          //  tags to be included in the text (and what
                                          //  text to replace them with)

        ignoreClass: 'tex2jax_ignore',    // the class name of elements whose contents should
                                          // NOT be processed by tex2jax.  Note that this
                                          // is a regular expression, so be sure to quote any
                                          // regexp special characters

        processClass: 'tex2jax_process'   // the class name of elements whose contents SHOULD
                                          // be processed when they appear inside ones that
                                          // are ignored.  Note that this is a regular expression,
                                          // so be sure to quote any regexp special characters
    };

    protected options: OptionList;
    protected strings: string[];
    protected string: string;
    protected snodes: HTMLNodeList;
    protected nodes: HTMLNodeList[];
    protected stack: any[];
    protected skipTags: RegExp;
    protected ignoreClass: RegExp;
    protected processClass: RegExp;

    constructor(options: OptionList = null) {
        let CLASS = this.constructor as HTMLDomStringsClass;
        this.options = UserOptions(DefaultOptions({}, CLASS.OPTIONS), options);
        this.Init();
        this.GetPatterns();
    }

    //
    //  Set the initial values of the main properties
    //
    protected Init() {
        this.strings = [];
        this.string = '';
        this.snodes = [];
        this.nodes = [];
        this.stack = [];
    }

    //
    //  Create the search pattersn for skipTags, ignoreClass, and processClass
    //
    protected GetPatterns() {
        let skip = MAKEARRAY(this.options['skipTags']);
        let ignore = MAKEARRAY(this.options['ignoreClass']);
        let process = MAKEARRAY(this.options['processClass']);
        this.skipTags = new RegExp('^(?:' + skip.join('|') + ')$', 'i');
        this.ignoreClass = new RegExp('(?:^| )(?:' + ignore.join('|') + ')(?: |$)');
        this.processClass = new RegExp('(?:^| )(?:' + process + ')(?: |$)');
    }

    //
    //  Add a string to the string array (and record its node)
    //
    protected PushString() {
        if (this.string.match(/\S/)) {
            this.strings.push(this.string);
            this.nodes.push(this.snodes);
        }
        this.string = '';
        this.snodes = [];
    }

    //
    //  Add more text to the current string (and record the
    //  node and its position in the string)
    //
    protected ExtendString(node: Element, text: string) {
        this.snodes.push([node, text.length]);
        this.string += text;
    }

    //
    //  Handle a #text node
    //
    protected HandleText(node: Element, ignore: boolean) {
        if (!ignore) {
            this.ExtendString(node, node.nodeValue);
        }
        return node.nextSibling as Element;
    }

    //
    //  Handle a BR, WBR, or #comment element (or others
    //  in the includeTag object).
    //
    protected HandleTag(node: Element, ignore: boolean) {
        if (!ignore) {
            let text = this.options['includeTags'][node.nodeName.toLowerCase()];
            this.ExtendString(node, text);
        }
        return node.nextSibling as Element;
    }

    //
    //  Handle an arbitrary DOM node
    //
    protected HandleContainer(node: Element, ignore: boolean) {
        this.PushString();
        let cname = node.className || '';
        let tname = node.tagName || '';
        let process = this.processClass.exec(cname);
        if (node.firstChild && !node.getAttribute('data-MJX') &&
            (process || !this.skipTags.exec(tname))) {
            this.stack.push([node.nextSibling, ignore]);
            node = node.firstChild as Element;
            ignore = (ignore || this.ignoreClass.exec(cname)) && !process;
        } else {
            node = node.nextSibling as Element;
        }
        return [node, ignore] as [Element, boolean];
    }

    //
    //  Find the strings for a given DOM element
    //
    public Find(node: Element) {
        this.Init();
        let stop = node.nextSibling;
        let ignore = false;
        let include = this.options['includeTags'];

        while (node && node !== stop) {
            if (node.nodeName === '#text') {
                node = this.HandleText(node, ignore);
            } else if (include[node.nodeName.toLowerCase()] !== undefined) {
                node = this.HandleTag(node, ignore);
            } else {
                [node, ignore] = this.HandleContainer(node, ignore);
            }
            if (!node && this.stack.length) {
                this.PushString();
                [node, ignore] = this.stack.pop();
            }
        }

        this.PushString();
        let result = [this.strings, this.nodes] as [string[], HTMLNodeList[]];
        this.Init(); // free up memory
        return result;
    }

}
