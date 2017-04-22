declare var System: {nodeRequire: Function};
declare var document: Document;
declare var window: Window;
declare var DOMParser: DOMParser;
declare var XMLSerializer: XMLSerializer;

let theDocument: Document;
let theWindow: Window;
let theDOMParser: DOMParser;
let theXMLSerializer: XMLSerializer;

try {

    //
    //  Browser version
    //
    document;  // errors if not in browser
    theDocument = document;
    theWindow =  window;
    theDOMParser = DOMParser;
    theXMLSerializer = XMLSerializer;

} catch (err) {

    //
    //  Node version
    //
    let jsdom = System.nodeRequire("jsdom");

    interface DOMWindow extends Window {
        DOMParser: DOMParser;
    }
    class DOMXMLSerializer implements XMLSerializer {
        public serializeToString(node: Element) {
            return jsdom.serializeDocument(node);
        }
        public static serializeToString(node: Element) {
            return jsdom.serializeDocument(node);
        }
    }

    theDocument = jsdom.jsdom();
    theWindow = theDocument.defaultView;
    theDOMParser = (theWindow as DOMWindow).DOMParser;
    theXMLSerializer = DOMXMLSerializer;

}

export {theDocument as document};
export {theWindow as window};
export {theDOMParser as DOMParser};
export {theXMLSerializer as XMLSerializer};
