/*
 * Escape HTML special characters for use in attribute strings
 */
function escapeHTML(text) {
    return text.replace(/&/g,'&amp;')
               .replace(/</g,'&lt;')
               .replace(/>/g,'&gt;')
               .replace(/"/g,'&quot;');
}

/*
 * A minimal replacement for the HTMLElement classList object
 * (Only implements what is needed by CHTML)
 */
class myClassList {
    constructor() {
        this.classes = new Map();
    }

    add(name) {
        this.classes.set(name, 1);
    }

    /*
     * Returns the class attribute as class="name name..."
     */
    get asAttribute() {
        const keys = Array.from(this.classes.keys());
        return (keys.length ? ' class="' + escapeHTML(keys.join(' ')) + '"' : '');
    }

    /*
     * Returns the list of classes separated by spaces
     */
    toString() {
        return Array.from(this.classes.keys()).join(' ');
    }
}

/*
 * A minimal replacement for HTMLElement, just to show that
 * MathJax can use an arbitrary implementation.
 * (Only implements what is needed by CHTML) 
 */
export class myNode {
    /*
     * Set up the node's styles, attributes, classList, and child structures
     */
    constructor(kind) {
        this.kind = kind;
        this.styles = {};
        this.attributes = {};
        this.classList = new myClassList();
        this.childNodes = [];
    }

    /*
     * Add a child node
     */
    appendChild(child) {
        this.childNodes.push(child);
        return child;
    }

    /*
     * Set an attribute for the element
     * (We don't currently handle setting of attributes by setting the element
     *  properties directly)
     */
    setAttribute(key, value) {
        if (key === 'class') {
            this.className = value;
        } else if (key === 'style') {
            console.log('Styles not yet implemented');
        } else {
            this.attributes[key] = value;
        }
    }

    /*
     * Get the className propery from the classList
     */
    get className() {
        return this.classList.toString();
    }

    /*
     * Set the classList from a string of class names
     */
    set className(names) {
        for (const name of names.split(/ /)) {
            this.classList.add(name);
        }
    }

    /*
     * Serialize the element as a string
     * (marked 'my-' so you can see it is being used)
     */
    get outerHTML() {
        let html = '<my-' + this.kind + this.classList.asAttribute + this.getAttributes() + '>';
        for (let child of this.childNodes) {
            html += child.outerHTML;
        }
        html += '</my-' + this.kind + '>';
        return html;
    }

    /*
     * Get the list or attributes as a string
     */
    getAttributes() {
        return Object.keys(this.attributes).map(
            key => ' ' + key + '="' + escapeHTML(this.attributes[key]) + '"'
        ).join('');
    }
}

/*
 * Minimal implementation of a text node
 */
export class myText {
    constructor(text) {
        this.text = text;
    }

    get outerHTML() {
        return escapeHTML(this.text);
    }
}

/*
 * Replacement for Document (does nothing -- just needed as a sample)
 */
export class myDocument {
}
