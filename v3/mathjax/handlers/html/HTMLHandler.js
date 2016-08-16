import {Handler} from "../../core/handler.js";
import {HTMLDocument} from "./HTMLDocument.js";

const VERSION = "3.0.0";

export class HTMLHandler extends Handler {
  HandlesDocument(document) {
    // Implement testing for <html> in string, or DOM element, etc.
    return true;
  }
  Create(document,options) {
    return new HTMLDocument(document,options);
  }
};

HTMLHandler.version = VERSION;
