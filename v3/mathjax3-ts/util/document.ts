interface DOMWindow extends Window {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
}

declare var System: {nodeRequire: Function};
declare var document: Document;
declare var window: DOMWindow;

let theDocument: Document;
let theWindow: Window;
let theDOMParser: typeof DOMParser;
let theXMLSerializer: typeof XMLSerializer;

try {

    //
    //  Browser version
    //
    document;  // errors if not in browser
    theDocument = document;
    theWindow =  window as Window;
    theDOMParser = window.DOMParser;
    theXMLSerializer = window.XMLSerializer;

} catch (err) {

    //
    //  Node version
    //
    let jsdom = System.nodeRequire("jsdom");

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
