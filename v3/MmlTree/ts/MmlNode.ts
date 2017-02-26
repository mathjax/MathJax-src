type Function = { [key:string]: any };

export type Property = string | number | boolean;
export type PropertyList = {[key: string]: Property};

export type MmlNode = AMmlNode | TextNode | XMLNode;

export interface IMmlNode {
    readonly kind: string;
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly texClass: number;
    readonly parent: MmlNode;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly defaults: PropertyList;

    setParent(node: MmlNode): void;

    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childIndex(child: MmlNode): number;

    setTeXclass(): void;
    updateTeXclass(core: MmlNode): void;
    texSpacing(): string;

    setInheritedAttributes(attributes: {[attribute: string]: [string, Property]}): void;

    setChildren(children: MmlNode[]): void;
    appendChild(child: MmlNode): MmlNode;
    replaceChild(oldChild: MmlNode, newChild: MmlNode): MmlNode;

    setAttribute(name: string, value: Property): void;
    setAttributes(attributes: PropertyList): void;
    setInherited(name: string, value: Property): void;
    setProperty(name: string, value: Property): void;

    getAttribute(name: string): Property;
    getInherited(name: string): Property;
    getProperty(name: string): Property;
    getDefault(name: string): Property;

    Get(...name: string[]): Property | PropertyList;
    autoDefault(name: string): Property;
}

interface IMmlNodeClass {
    (): MmlNode;
    defaults: PropertyList;
}

export const DEFAULT = {
    INHERIT: "_inherit_",
    AUTO: "_auto_"
};

export const TEXCLASS = {
    ORD: 0,
    NONE: -1
};

export abstract class AMmlNode implements IMmlNode {
    static defaults: PropertyList = {
        mathbackground: DEFAULT.INHERIT,
        mathcolor: DEFAULT.INHERIT,
        dir: DEFAULT.INHERIT
    };
    static globalDefaults: PropertyList = {
        mathvariant: "normal",
        mathsize: "normal",
        mathcolor: "", // should be "black", but allow it to inherit from surrounding text
        mathbackground: "transparent",
        dir: "ltr",
        scriptlevel: 0,
        displaystyle: false,
        display: "inline",
        maxwidth: "",
        overflow: "linebreak",
        altimg: "",
        'altimg-width': "",
        'altimg-height': "",
        'altimg-valign': "",
        alttext: "",
        cdgroup: "",
        scriptsizemultiplier: Math.sqrt(1/2),
        scriptminsize: "8px",    // should be 8pt, but that's too big
        infixlinebreakstyle: "before",
        lineleading: "1ex",
        indentshift: "auto",     // use user configuration
        indentalign: "auto",
        indentalignfirst: "indentalign",
        indentshiftfirst: "indentshift",
        indentalignlast:  "indentalign",
        indentshiftlast:  "indentshift"
    };
    static globalProperties: PropertyList = {
        decimalseparator: ".",
        texprimestyle: false     // is it in TeX's C' style?
    };
    static noInherit: {[node1: string]: {[node2: string]: {[attribute: string]: boolean}}} = {
        mstyle: {
            mpadded: {width: true, height: true, depth: true, lspace: true, voffset: true},
            mtable:  {width: true, height: true, depth: true, align: true}
        },
        mtable: {
            mover: {align: true},
            munder: {align: true},
            munderover: {align: true},
            mtable: {
                align: true, rowalign: true, columnalign: true, groupalign: true,
                alignmentscope: true, columnwidth: true, width: true, rowspacing: true,
                columnspacing: true, rowlines: true, columnlines: true, frame: true,
                framespacing: true, equalrows: true, equalcolumns: true, displaystyle: true,
                side: true, minlabelspacing: true, texClass: true, useHeight: true
            }
        },
        mtr: {
            mrow: {rowalign: true, columnalign: true, groupalign: true},
            mtable: {rowalign: true, columnalign: true, groupalign: true}
        },
        maligngroup: {
            mrow: {groupalign: true},
            mtable: {groupalign: true}
        }
    };

    protected _texClass: number = TEXCLASS.NONE;
    protected _parent: MmlNode = null;

    protected attributes: PropertyList = {};
    protected inherited:  PropertyList = {};
    protected properties: PropertyList = {};

    childNodes: MmlNode[] = [];

    constructor(...children: (MmlNode | string | (MmlNode | string)[])[]) {
        if (this.arity < 0) {
            this.childNodes = [new MmlInferredMrow()];
            this.childNodes[0].setParent(this);
        }
        if (children.length === 1 && Array.isArray(children[0])) children = children[0] as (MmlNode | string)[];
        for (let child of children) {
            if (typeof child === 'string') child = new TextNode(child as string);
            this.appendChild(child as MmlNode);
        }
    }
    
    get kind() {return ''}
    get isToken() {return false}
    get isEmbellished() {return false}
    get isSpacelike() {return false}
    get linebreakContainer() {return false}
    get texClass() {return this._texClass}
    get parent(): MmlNode {
        let parent = this._parent as AMmlNode;
        if (parent.isInferred) return parent.parent;
        return parent;
    }
    get hasNewLine() {return false}
    get arity() {return 0}
    get isInferred() {return false}
    get defaults() {return (this.constructor as IMmlNodeClass).defaults}

    setParent(node: MmlNode) {this._parent = node}

    core() {return this}
    coreMO() {return this}
    coreIndex() {return 0}
    childIndex(node: MmlNode) {
        let i = 0;
        for (const child of this.childNodes) {
            if (child === node) {
                return i;
            }
            i++;
        }
        return null;
    }

    setTeXclass() {}
    updateTeXclass(core: MmlNode) {}
    texSpacing() {return ''}

    setInheritedAttributes(attributes: {[attribute: string]: [string, Property]} = {},
                           displaystyle: boolean = false, scriptlevel: number = 0) {
        let defaults = this.defaults;
        for (const key of Object.keys(attributes)) {
            if (key in defaults) {
                let [node, value] = attributes[key];
                let noinherit = (AMmlNode.noInherit[node] || {})[this.kind] || {};
                if (!noinherit[key]) {
                    this.setInherited(key,value);
                }
            }
        }
        let display = this.getAttribute("displaystyle");
        if (display === undefined) {
            this.setInherited("displaystyle",displaystyle);
        } else {
            displaystyle = display as boolean;
        }
        let script = this.getAttribute("scriptlevel");
        if (script === undefined) {
            this.setInherited("scriptlevel",scriptlevel);
        } else {
            scriptlevel = script as number;
        }
        this.setChildInheritedAttributes(attributes, displaystyle, scriptlevel);
    }
    protected setChildInheritedAttributes(attributes: {[attribute: string]: [string, Property]},
                                          displaystyle: boolean, scriptlevel: number) {
        for (const child of this.childNodes) {
            if (child instanceof AMmlNode) {
                child.setInheritedAttributes(attributes, displaystyle, scriptlevel);
            }
        }
    }

    setChildren(children: MmlNode[]) {
        if (this.arity < 0) {
            (this.childNodes[0] as AMmlNode).setChildren(children);
        } else {
            this.childNodes = children;
            for (const child of children) {
                child.setParent(this);
            }
        }
    }
    appendChild(child: MmlNode) {
        if (this.arity < 0) {
            (this.childNodes[0] as AMmlNode).appendChild(child);
        } else {
            this.childNodes.push(child);
            child.setParent(this);
        }
        return child;
    }
    replaceChild(oldChild: MmlNode, newChild: MmlNode) {
        if (this.arity < 0) {
            (this.childNodes[0] as AMmlNode).replaceChild(oldChild,newChild);
        } else {
            let i = this.childIndex(oldChild);
            this.childNodes[i] = newChild;
            newChild.setParent(this);
        }
        return newChild;
    }

    setAttribute(name: string, value: Property) {this.attributes[name] = value}
    setAttributes(attributes: PropertyList) {Object.assign(this.attributes,attributes)}
    setInherited(name: string, value: Property) {this.inherited[name] = value}
    setProperty(name: string, value: Property) {this.properties[name] = value}

    getAttribute(name: string) {return this.attributes[name]}
    getInherited(name: string) {return this.inherited[name]}
    getProperty(name: string) {return this.properties[name]}
    getDefault(name: string) {return this.defaults[name]}

    Get(...names: string[]) {
        let values: PropertyList = {};
        let defaults = this.defaults;
        for (const name of names) {
            if (name in this.properties) {
                values[name] = this.properties[name];
            } else if (name in this.attributes) {
                values[name] = this.attributes[name];
            } else if (name in this.inherited) {
                values[name] = this.inherited[name];
            } else if (name in defaults) {
                let value = defaults[name];
                if (value === DEFAULT.AUTO) value = this.autoDefault(name);
                else if (value === DEFAULT.INHERIT) value = AMmlNode.globalDefaults[name];
                values[name] = value;
            } else if (name in AMmlNode.globalProperties) {
                values[name] = AMmlNode.globalProperties[name];
            }
        }
        return (names.length === 1 ? values[names[0]] : values);
    }

    autoDefault(name: string) {return ''}
    
}

export abstract class AMmlTokenNode extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        mathvariant: DEFAULT.AUTO,
        mathsize: DEFAULT.INHERIT
    };
    
    get isToken() {return true}

    getText(): string {
        let text = "";
        for (const child of this.childNodes) {
            if (child instanceof TextNode) {
                text += child.getText();
            }
        }
        return text;
    }
}

export class MmlMrow extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'mrow'}
}

export class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList = MmlMrow.defaults;
    get isInferred() {return true}
}

export class MmlMath extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'math'}
    get arity() {return -1}
}

export class MmlMi extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        mathvariant: DEFAULT.AUTO
    };
    _texClass = TEXCLASS.ORD;
    get kind() {return 'math'}

    autoDefault(name: string) {
        if (name === "mathvariant") {
            let text = this.getText();
            if (text.length === 1) return "italic";
            return "normal";
        }
        return "";
    }
}

export class TextNode {
    protected text: string;

    constructor(text:string = "") {
        this.text = text;
    }
    
    get kind() {return 'text'}

    getText(): string {return this.text}
    setText(text: string): void {this.text = text}

    setParent(node: MmlNode) {}
}

export class XMLNode {
    protected xml: Object;

    constructor(xml:Object = {}) {
        this.xml = xml;
    }

    get kind() {return 'xml'}

    getXML(): Object {return this.xml}
    setXML(xml: Object): void {this.xml = xml}

    setParent(node: MmlNode) {}
}
