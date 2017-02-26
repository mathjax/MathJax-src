type Function = { [key:string]: any };

export type PropertyList = {[key: string]: string};

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

    setInheritedAttributes(attributes: {[attribute: string]: [string, string]}): void;

    setChildren(children: MmlNode[]): void;
    appendChild(child: MmlNode): MmlNode;
    replaceChild(oldChild: MmlNode, newChild: MmlNode): MmlNode;

    setAttribute(name: string, value: string): void;
    setAttributes(attributes: PropertyList): void;
    setInherited(name: string, value: string): void;
    setProperty(name: string, value: string): void;

    getAttribute(name: string): string;
    getInherited(name: string): string;
    getProperty(name: string): string;
    getDefault(name: string): string;

    Get(...name: string[]): string | PropertyList;
    autoDefault(name: string): string;
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
    get parent() {return this._parent}
    get hasNewLine() {return false}
    get arity() {return true}
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

    setInheritedAttributes(attributes: {[attribute: string]: [string, string]} = {}) {
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
        this.setChildInheritedAttributes(attributes);
    }
    protected setChildInheritedAttributes(attributes: {[attribute: string]: [string, string]} = {}) {
        for (const child of this.childNodes) {
            if (child instanceof AMmlNode) {
                child.setInheritedAttributes(attributes);
            }
        }
    }

    setChildren(children: MmlNode[]) {
        this.childNodes = children;
        for (const child of children) {
            child.setParent(this);
        }
    }
    appendChild(child: MmlNode) {
        this.childNodes.push(child);
        child.setParent(this);
        return child;
    }
    replaceChild(oldChild: MmlNode, newChild: MmlNode) {
        let i = this.childIndex(oldChild);
        this.childNodes[i] = newChild;
        newChild.setParent(this);
        return newChild;
    }

    setAttribute(name: string, value: string) {this.attributes[name] = value}
    setAttributes(attributes: PropertyList) {Object.assign(this.attributes,attributes)}
    setInherited(name: string, value: string) {this.inherited[name] = value}
    setProperty(name: string, value: string) {this.properties[name] = value}

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
                else if (value === DEFAULT.INHERIT) value = MmlMath.defaults[name];
                values[name] = value;
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

export class MmlMath extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'math'}
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
