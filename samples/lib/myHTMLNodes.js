import {HTMLNodes} from "../../mathjax3/util/HTMLNodes.js";
import {myNode, myText} from "./myDOM.js";

/*
 * Example replacement for util/HTMLnodes.js
 */
export class myHTMLNodes extends HTMLNodes {

    /*
     * Creates a replacement HTMLElement of the given type
     *  with the given properties, and the given child nodes
     */
    node(type, def = {}, children = []) {
        const node = new myNode(type);
        this.setProperties(node, def);
        for (const child of children) {
            node.appendChild(child);
        }
        return node;
    }

    /*
     *  Creates a replacement HTML text node
     */
    text(text) {
        return new myText(text);
    }
}

