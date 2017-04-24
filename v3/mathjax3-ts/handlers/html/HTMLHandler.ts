import {AbstractHandler} from "../../core/Handler.js";
import {HTMLDocument} from "./HTMLDocument.js";
import {OptionList} from "../../util/Options.js";
import {document, window, DOMParser} from "../../util/document.js";

const VERSION = "3.0.0";

interface DOMWindow {
    HTMLElement?: typeof HTMLElement;
    DocumentFragment?: typeof DocumentFragment;
}

const parser = new DOMParser();
const DOCUMENT = document.constructor;
const HTMLELEMENT = (window as DOMWindow).HTMLElement;
const FRAGMENT = (window as DOMWindow).DocumentFragment;

export class HTMLHandler extends AbstractHandler {
    public static version = VERSION;

    HandlesDocument(document: any) {
        if (typeof(document) === "string") {
            try {document = parser.parseFromString(document, 'text/html')} catch (err) {}
        }
        if (document instanceof DOCUMENT ||
            document instanceof HTMLELEMENT ||
            document instanceof FRAGMENT) return true;
        return false;
    }

    Create(document: any, options: OptionList) {
        if (typeof(document) === "string") {
            document = parser.parseFromString(document, 'text/html');
        } else if (document instanceof HTMLELEMENT) {
            let child = document;
            document = parser.parseFromString('', 'text/html');
            document.body.appendChild(child);
        } else if (document instanceof FRAGMENT) {
            let fragment = document;
            document = parser.parseFromString('', 'text/html');
            document.body.appendChild(fragment);
        }
        return new HTMLDocument(document, options);
    }
};
