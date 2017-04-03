import {Handler} from "../../core/Handler.js";
import {HTMLDocument} from "./HTMLDocument.js";

import {document, window, DOMParser} from "../../util/document.js";

const VERSION = "3.0.0";

const parser = new DOMParser();
const DOCUMENT = document.constructor;
const HTMLELEMENT = window.HTMLElement;
const FRAGMENT = window.DocumentFragment;

export class HTMLHandler extends Handler {
  HandlesDocument(document) {
    if (typeof(document) === "string") {
      try {document = parser.parseFromString(document, 'text/html')} catch (err) {}
    }
    if (document instanceof DOCUMENT) return true;
    if (document instanceof HTMLELEMENT) return true;
    if (document instanceof FRAGMENT) return true;
    return false;
  }

  Create(document,options) {
    if (typeof(document) === "string") {
      document = parser.parseFromString(document, 'text/html');
    }
    return new HTMLDocument(document,options);
  }
};

HTMLHandler.version = VERSION;
