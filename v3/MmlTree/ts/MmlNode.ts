import {Property, PropertyList, ChildNodes, Node, TextNode, ANode, AContainerNode, INode, INodeClass} from './Node';
import {MmlFactory} from './MmlFactory';

export type MmlNode = AMmlNode | TextNode | XMLNode;
export type MmlNodeClass = IMmlNodeClass | INodeClass;

export type MmlChildParams = (MmlNode | string | (MmlNode | string)[])[];
export type MmlChildArray = (MmlNode | string)[];

export type AttributeList = {[attribute: string]: [string, Property]};

export interface IMmlNode extends INode {
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly texClass: number;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly defaults: PropertyList;

    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;

    setTeXclass(): void;
    updateTeXclass(core: MmlNode): void;
    texSpacing(): string;

    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;

    setAttribute(name: string, value: Property): void;
    setAttributes(attributes: PropertyList): void;
    setInherited(name: string, value: Property): void;

    getAttribute(name: string): Property;
    getAttributes(): PropertyList;
    getInherited(name: string): Property;
    getDefault(name: string): Property;

    Get(...name: string[]): Property | PropertyList;
    autoDefault(name: string): Property;
}

export interface IMmlNodeClass extends INodeClass {
    new (factory: MmlFactory, ...children: MmlChildParams): MmlNode;
    defaults: PropertyList;
    defaultProperties?: PropertyList;
}

export const DEFAULT = {
    INHERIT: "_inherit_",
    AUTO: "_auto_"
};

export const TEXCLASS = {
    ORD:   0,
    OP:    1,
    BIN:   2,
    REL:   3,
    OPEN:  4,
    CLOSE: 5,
    PUNCT: 6,
    INNER: 7,
    VCENTER: 8,
    NONE:   -1
};

export const TEXCLASSNAMES = ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"];

export function MmlChildNodes(children: MmlChildParams): MmlChildArray {
    return ChildNodes(children) as MmlChildArray;
}

export abstract class AMmlNode extends AContainerNode implements IMmlNode {
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
                side: true, minlabelspacing: true
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

    protected attributes: PropertyList = {};
    protected inherited:  PropertyList = {};

    childNodes: MmlNode[] = [];

    constructor(factory: MmlFactory, ...children: MmlChildParams) {
        super(factory);
        if (this.arity < 0) {
            this.childNodes = [factory.create('inferredMrow') as MmlNode];
            this.childNodes[0].setParent(this);
        }
        this.setChildren(MmlChildNodes(children));
    }
    
    get isToken() {return false}
    get isEmbellished() {return false}
    get isSpacelike() {return false}
    get linebreakContainer() {return false}
    get texClass() {return this._texClass}
    get parent(): Node {
        let parent = this._parent as AMmlNode;
        if (parent.isInferred) return parent.parent;
        return parent;
    }
    get hasNewLine() {return false}
    get arity() {return Infinity}
    get isInferred() {return false}
    get defaults() {return (this.constructor as IMmlNodeClass).defaults}

    appendChild(child: MmlNode) {
        if (this.arity < 0) {
            (this.childNodes[0] as AMmlNode).appendChild(child);
            return child;
        }
        return super.appendChild(child);
    }
    replaceChild(oldChild: MmlNode, newChild: MmlNode) {
        if (this.arity < 0) {
            (this.childNodes[0] as AMmlNode).replaceChild(oldChild,newChild);
            return newChild;
        }
        return super.replaceChild(oldChild,newChild);
    }

    core(): MmlNode {return this}
    coreMO(): MmlNode {return this}
    coreIndex() {return 0}

    setTeXclass() {}
    updateTeXclass(core: MmlNode) {}
    texSpacing() {return ''}

    setInheritedAttributes(attributes: AttributeList = {},
                           display: boolean = false, level: number = 0, prime: boolean = false) {
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
        let displaystyle = this.getAttribute("displaystyle");
        if (displaystyle === undefined) {
            this.setInherited("displaystyle",display);
        } else {
            display = !!displaystyle;
        }
        let scriptlevel = this.getAttribute("scriptlevel");
        if (scriptlevel === undefined) {
            this.setInherited("scriptlevel",level);
        }
        if (prime) {
            this.setProperty("texprimestyle", prime);
        }
        let arity = this.arity;
        if (arity >= 0 && arity !== Infinity && ((arity === 1 && this.childNodes.length === 0) ||
                                                 (arity !== 1 && this.childNodes.length !== arity))) {
            //
            // FIXME: should create merror element surrounding this one.
            //
            throw Error("Incorrect number of child nodes for '"+this.kind+"'");
        }
        this.setChildInheritedAttributes(attributes, display, level, prime);
    }
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        for (const child of this.childNodes) {
            if (child instanceof AMmlNode) {
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
    }
    protected addInheritedAttributes(current: AttributeList, attributes: PropertyList) {
        let updated: AttributeList = {...current};
        for (const name of Object.keys(attributes)) {
            if (name !== 'displaystyle' && name !== 'scriptlevel' && name !== 'style') {
                updated[name] = [this.kind, attributes[name]];
            }
        }
        return updated;
    }

    setAttribute(name: string, value: Property) {this.attributes[name] = value}
    setAttributes(attributes: PropertyList) {Object.assign(this.attributes,attributes)}
    setInherited(name: string, value: Property) {this.inherited[name] = value}

    getAttribute(name: string) {return this.attributes[name]}
    getAttributes() {return this.attributes}
    getInherited(name: string) {return this.inherited[name]}
    getDefault(name: string) {return this.defaults[name]}

    Get(...names: string[]) {
        let values: PropertyList = {};
        let defaults = this.defaults;
        let math = (this.factory.getNodeClass('math') || {defaults:{}, defaultProperties:{}}) as IMmlNodeClass;
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
                else if (value === DEFAULT.INHERIT) value = math.defaults[name];
                values[name] = value;
            } else if (name in math.defaultProperties) {
                values[name] = math.defaultProperties[name];
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


export class XMLNode extends ANode {
    protected xml: Object;

    constructor(factory: MmlFactory, xml:Object = {}) {
        super(factory);
        this.xml = xml;
    }

    get kind() {return 'xml'}

    getXML(): Object {return this.xml}
    setXML(xml: Object): void {this.xml = xml}
}
