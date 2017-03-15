import {Attributes, INHERIT} from './Attributes';
import {Property, PropertyList, Node, ANode, AEmptyNode, INode, INodeClass} from './Node';
import {MmlFactory} from './MmlFactory';

export type MmlNode = IMmlNode;
export type MmlNodeClass = IMmlNodeClass;

export type AttributeList = {[attribute: string]: [string, Property]};

export interface IMmlNode extends INode {
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly notParent: boolean;
    readonly Parent: MmlNode;
    readonly defaults: PropertyList;
    texClass: number;
    prevClass: number;
    prevLevel: number;
    attributes: Attributes;
    parent: MmlNode;

    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;

    childPosition(): number;

    setTeXclass(prev: MmlNode): MmlNode;
    texSpacing(): string;

    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}

export interface IMmlNodeClass extends INodeClass {
    new (factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]): MmlNode;
    defaults?: PropertyList;
}

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

export const TEXSPACELENGTH = ['', 'thinmathspace', 'mediummathspace', 'thickmathspace'];

//
// See TeXBook Chapter 18 (p. 170)
//
export const TEXSPACE = [
    [ 0,-1, 2, 3, 0, 0, 0, 1], // ORD
    [-1,-1, 0, 3, 0, 0, 0, 1], // OP
    [ 2, 2, 0, 0, 2, 0, 0, 2], // BIN
    [ 3, 3, 0, 0, 3, 0, 0, 3], // REL
    [ 0, 0, 0, 0, 0, 0, 0, 0], // OPEN
    [ 0,-1, 2, 3, 0, 0, 0, 1], // CLOSE
    [ 1, 1, 0, 1, 1, 1, 1, 1], // PUNCT
    [ 1,-1, 2, 3, 1, 0, 1, 1]  // INNER
];


export abstract class AMmlNode extends ANode implements IMmlNode {
    static defaults: PropertyList = {
        mathbackground: INHERIT,
        mathcolor: INHERIT,
        dir: INHERIT
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

    texClass: number = null;
    prevClass: number = null;
    prevLevel: number = null;

    attributes: Attributes;

    childNodes: MmlNode[];
    parent: MmlNode;

    constructor(factory: MmlFactory, attributes: PropertyList = {}, children: MmlNode[] = []) {
        super(factory);
        if (this.arity < 0) {
            this.childNodes = [factory.create('inferredMrow') as MmlNode];
            this.childNodes[0].parent = this;
        }
        this.setChildren(children);
        this.attributes = new Attributes(
            (factory.getNodeClass(this.kind) as MmlNodeClass).defaults,
            (factory.getNodeClass('math') as MmlNodeClass).defaults
        );
    }

    get isToken() {return false}
    get isEmbellished() {return false}
    get isSpacelike() {return false}
    get linebreakContainer() {return false}
    get Parent() {
        let parent = this.parent;
        while (parent && parent.notParent) {
            parent = parent.Parent;
        }
        return parent;
    }
    get hasNewLine() {return false}
    get arity() {return Infinity}
    get isInferred() {return false}
    get notParent() {return false}
    get defaults() {return (this.constructor as MmlNodeClass).defaults}

    appendChild(child: MmlNode) {
        if (this.arity < 0) {
            this.childNodes[0].appendChild(child);
            return child;
        }
        return super.appendChild(child);
    }
    replaceChild(oldChild: MmlNode, newChild: MmlNode) {
        if (this.arity < 0) {
            this.childNodes[0].replaceChild(oldChild,newChild);
            return newChild;
        }
        return super.replaceChild(oldChild,newChild);
    }

    core(): MmlNode {return this}
    coreMO(): MmlNode {return this}
    coreIndex() {return 0}

    childPosition() {
        let child: MmlNode = this;
        let parent = child.parent;
        while (parent && parent.notParent) {
            child = parent;
            parent = parent.parent;
        }
        if (parent) {
            let i = 0;
            for (const node of parent.childNodes) {
                if (node === child) return i;
                i++;
            }
        }
        return null;
    }

    setTeXclass(prev: MmlNode): MmlNode {
        this.getPrevClass(prev);
        return (this.texClass === null ? this : prev);
    }
    protected updateTeXclass(core: MmlNode) {
        if (core) {
            this.prevClass = core.prevClass;
            this.prevLevel = core.prevLevel;
            core.prevClass = core.prevLevel = null;
            this.texClass = core.texClass;
        }
    }
    protected getPrevClass(prev: MmlNode) {
        if (prev) {
            this.prevClass = prev.texClass;
            this.prevLevel = prev.attributes.get('scriptlevel') as number;
        }
    }

    texSpacing() {
        let prevClass = (this.prevClass != null ? this.prevClass : TEXCLASS.NONE);
        let texClass = this.texClass || TEXCLASS.ORD;
        if (prevClass === TEXCLASS.NONE || texClass === TEXCLASS.NONE) return '';
        if (prevClass === TEXCLASS.VCENTER) prevClass = TEXCLASS.ORD;
        if (texClass === TEXCLASS.VCENTER)  texClass = TEXCLASS.ORD;
        let space = TEXSPACE[prevClass][texClass];
        if (this.prevLevel > 0 && this.attributes.get('scriptlevel') > 0 && space >= 0) return '';
        return TEXSPACELENGTH[Math.abs(space)];
    }

    setInheritedAttributes(attributes: AttributeList = {},
                           display: boolean = false, level: number = 0, prime: boolean = false) {
        let defaults = this.defaults;
        for (const key of Object.keys(attributes)) {
            if (key in defaults) {
                let [node, value] = attributes[key];
                let noinherit = (AMmlNode.noInherit[node] || {})[this.kind] || {};
                if (!noinherit[key]) {
                    this.attributes.setInherited(key,value);
                }
            }
        }
        let displaystyle = this.attributes.getExplicit("displaystyle");
        if (displaystyle === undefined) {
            this.attributes.setInherited("displaystyle",display);
        } else {
            display = !!displaystyle;
        }
        let scriptlevel = this.attributes.getExplicit("scriptlevel");
        if (scriptlevel === undefined) {
            this.attributes.setInherited("scriptlevel",level);
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
            child.setInheritedAttributes(attributes, display, level, prime);
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

}

export abstract class AMmlTokenNode extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        mathvariant: 'normal',
        mathsize: INHERIT
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

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        for (const child of this.childNodes) {
            if (child instanceof AMmlNode) {
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
    }
    walkTree(func: (node: Node, data?: any) => void, data?: any) {
        func(this, data);
        for (const child of this.childNodes) {
            if (child instanceof AMmlNode) {
                child.walkTree(func, data);
            }
        }
        return data;
    }
}

export abstract class AMmlLayoutNode extends AMmlNode {
    static defaults: PropertyList = AMmlNode.defaults;
    get isSpacelike() {return this.childNodes[0].isSpacelike}
    get isEmbellished() {return this.childNodes[0].isEmbellished}
    core(): MmlNode {return this.childNodes[0]}
    coreMO(): MmlNode {return this.childNodes[0].coreMO()}
    setTeXclass(prev: MmlNode) {
        prev = this.childNodes[0].setTeXclass(prev);
        this.updateTeXclass(this.childNodes[0]);
        return prev;
    }
}

export abstract class AMmlBaseNode extends AMmlNode {
    static defaults: PropertyList = AMmlNode.defaults;
    get isEmbellished() {return this.childNodes[0].isEmbellished}
    core(): MmlNode {return this.childNodes[0]}
    coreMO(): MmlNode {return this.childNodes[0].coreMO()}
    setTeXclass(prev: MmlNode) {
        this.getPrevClass(prev);
        this.texClass = TEXCLASS.NONE;
        let base = this.childNodes[0];
        if (base) {
            if (this.isEmbellished || base.isKind('mi')) {
                prev = base.setTeXclass(prev);
                this.updateTeXclass(this.core());
            } else {
                base.setTeXclass(null);
                prev = this;
            }
        } else {
            prev = this;
        }
        for (const child of this.childNodes.slice(1)) {
            if (child) {
                child.setTeXclass(null);
            }
        }
        return prev;
    }
}

const dummyAttributes = new Attributes({}, {});

export abstract class AMmlEmptyNode extends AEmptyNode implements IMmlNode {
    attributes: Attributes = dummyAttributes;

    get isToken() {return false}
    get isEmbellished() {return false}
    get isSpacelike() {return false}
    get linebreakContainer() {return false}
    get hasNewLine() {return false}
    get arity() {return 0}
    get isInferred() {return false}
    get notParent() {return false}
    get Parent() {return this.parent}
    get defaults() {return {}}
    get texClass() {return 0}
    get prevClass() {return 0}
    get prevLevel() {return 0}
    parent: MmlNode;

    core() {return this}
    coreMO() {return this}
    coreIndex() {return 0}

    childPosition() {return 0}

    setTeXclass(prev: MmlNode) {return prev}
    texSpacing() {return ''}

    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {}
    protected setChildInheritedAttributes() {}
}

export class TextNode extends AMmlEmptyNode {
    protected text: string = '';

    get kind() {return 'text'}

    getText(): string {return this.text}
    setText(text: string) {this.text = text; return this}
}


export class XMLNode extends AMmlEmptyNode {
    protected xml: Object;

    constructor(factory: MmlFactory, xml:Object = {}) {
        super(factory);
        this.xml = xml;
    }

    get kind() {return 'XML'}

    getXML(): Object {return this.xml}
    setXML(xml: Object) {this.xml = xml; return this}
}
