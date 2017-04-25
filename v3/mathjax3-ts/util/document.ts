interface DOMWindow extends Window {
    DOMParser: typeof DOMParser;
}

declare var System: {nodeRequire: Function};
declare var document: Document;
declare var window: DOMWindow;

let theDocument: Document;
let theWindow: Window;
let theDOMParser: typeof DOMParser;

try {

    //
    //  Browser version
    //
    document;  // errors if not in browser
    theDocument = document;
    theWindow =  window as Window;
    theDOMParser = window.DOMParser;

} catch (err) {

    //
    //  Node version
    //
    const jsdom = System.nodeRequire('jsdom');
    const { JSDOM } = jsdom;

    theWindow = new JSDOM().window;
    theDocument = theWindow.document;
    theDOMParser = (theWindow as DOMWindow).DOMParser;

}

export {theDocument as document};
export {theWindow as window};
export {theDOMParser as DOMParser};
