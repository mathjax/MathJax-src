declare var System: {nodeRequire: Function};
declare var document: Document;
declare var window: Window;

interface DOMWindow extends Window {
    DOMParser: typeof DOMParser;
}

export const DOM: {
    document: Document,
    window: Window,
    DOMParser: typeof DOMParser
} = {
    document: null,
    window: null,
    DOMParser: null
};

try {

    //
    //  Browser version
    //
    document;  // errors if not in browser
    DOM.document = document;
    DOM.window =  window;
    DOM.DOMParser = (window as DOMWindow).DOMParser;

} catch (err) {

    //
    //  Node version
    //
    const jsdom = System.nodeRequire('jsdom');
    const { JSDOM } = jsdom;

    DOM.window = new JSDOM().window;
    DOM.document = DOM.window.document;
    DOM.DOMParser = (DOM.window as DOMWindow).DOMParser;

}
