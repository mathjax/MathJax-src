import {UserOptions, DefaultOptions} from "../../util/Options.js";

//
//  Make sure an option is an Array
//
const MAKEARRAY = function (x) {return (Array.isArray(x) ? x : [x])};

//
//  A class for finding the strings in a DOM object
//
export class HTMLDomStrings {
  
  constructor(options) {
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
    this.Init();
    this.GetPatterns();
  }

  //
  //  Set the initial values of the main properties
  //
  Init() {
    this.strings = [];
    this.string = '';
    this.snodes = [];
    this.nodes = [];
    this.stack = [];
  }
  
  //
  //  Create the search pattersn for skipTags, ignoreClass, and processClass
  //
  GetPatterns() {
    let skip = MAKEARRAY(this.options.skipTags);
    let ignore = MAKEARRAY(this.options.ignoreClass);
    let process = MAKEARRAY(this.options.processClass);
    this.skipTags = new RegExp("^(?:"+skip.join("|")+")$","i");
    this.ignoreClass = new RegExp("(?:^| )(?:"+ignore.join("|")+")(?: |$)");
    this.processClass = new RegExp("(?:^| )(?:"+process+")(?: |$)");
  }

  //
  //  Add a string to the string array (and record its node)
  //
  PushString() {
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
  ExtendString(node,string) {
    this.snodes.push([node,string.length]);
    this.string += string;
  }
  
  //
  //  Handle a #text node
  //
  HandleText(node,ignore) {
    if (!ignore) this.ExtendString(node,node.nodeValue);
    return node.nextSibling;
  }
  
  //
  //  Handle a BR, WBR, or #comment element (or others
  //  in the includeTag object).
  //
  HandleTag(node,ignore) {
    if (!ignore) {
      let text = this.options.includeTags[node.nodeName.toLowerCase()];
      this.ExtendString(node,text);
    }
    return node.nextSibling;
  }
  
  //
  //  Handle an arbitrary DOM node
  //
  HandleContainer(node,ignore) {
    this.PushString();
    let cname = node.className || '';
    let tname = node.tagName || '';
    let process = this.processClass.exec(cname);
    if (node.firstChild && !node.getAttribute("data-MJX") &&
        (process || !this.skipTags.exec(tname))) {
      this.stack.push([node.nextSibling,ignore]);
      node = node.firstChild;
      ignore = (ignore || this.ignoreClass.exec(cname)) && !process;
    } else {
      node = node.nextSibling;
    }
    return [node, ignore];
  }

  //
  //  Find the strings for a given DOM element
  //
  Find(node) {
    this.Init();
    let stop = node.nextSibling;
    let ignore = false;
    let include = this.options.includeTags;
  
    while (node && node !== stop) {
      if (node.nodeName === '#text') {
        node = this.HandleText(node,ignore);
      } else if (include[node.nodeName.toLowerCase()] !== undefined) {
        node = this.HandleTag(node,ignore);
      } else {
        [node, ignore] = this.HandleContainer(node,ignore);
      }
      if (!node && this.stack.length) {
        this.PushString();
        [node, ignore] = this.stack.pop();
      }
    }
    
    this.PushString();
    let result = [this.strings, this.nodes];
    this.Init(); // free up memory
    return result;
  }

}

HTMLDomStrings.OPTIONS = {
  skipTags: ["script","noscript","style","textarea","pre","code","annotation","annotation-xml"],
                                    // The names of the tags whose contents will not be
                                    // scanned for math delimiters

  includeTags: {br: "\n", wbr: "", "#comment": ""},
                                    //  tags to be included in the text (and what
                                    //  text to replace them with)
 
  ignoreClass: "tex2jax_ignore",    // the class name of elements whose contents should
                                    // NOT be processed by tex2jax.  Note that this
                                    // is a regular expression, so be sure to quote any
                                    // regexp special characters

  processClass: "tex2jax_process"   // the class name of elements whose contents SHOULD
                                    // be processed when they appear inside ones that
                                    // are ignored.  Note that this is a regular expression,
                                    // so be sure to quote any regexp special characters
};
