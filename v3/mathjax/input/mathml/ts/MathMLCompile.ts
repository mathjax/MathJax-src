import {MmlFactory} from "../../../../MmlTree/js/MmlFactory.js";
import {MmlEntities} from "./MmlEntities.js";
import {MmlNode, AMmlNode, AMmlTokenNode, TEXCLASS} from "../../../../MmlTree/js/MmlNode.js";
import {OptionList, DefaultOptions, UserOptions} from "../../../util/Options.js";

export class MathMLCompile {
    public static OPTIONS: OptionList = {
        MmlFactory: null,
        MmlEntities: null,
        fixMisplacedChildren: true,
        verify: {},
        translateEntities: true
    };

    public static VERIFY: OptionList = {
        ...AMmlNode.verifyDefaults
    };

    protected factory: MmlFactory;
    protected entities: MmlEntities;
    protected options: OptionList;

    constructor(options: OptionList = {}) {
        const Class = this.constructor as typeof MathMLCompile;
        this.options = UserOptions(DefaultOptions({}, Class.OPTIONS), options);
        if (this.options['verify']) {
            this.options['verify'] = UserOptions(DefaultOptions({}, Class.VERIFY), this.options['verify']);
        }
        this.factory = this.options['MmlFactory'] || new MmlFactory();
        this.entities = this.options['MmlEntities'] || new MmlEntities();
    }

    public Compile(node: HTMLElement) {
        let mml = this.makeNode(node);
        mml.verifyTree(this.options['verify']);
        mml.setInheritedAttributes();
        mml.walkTree(this.markMrows);
        return mml;
    }

    public makeNode(node: HTMLElement) {
        let limits = false, texClass = '';
        let type = node.nodeName.toLowerCase().replace(/^.*:/,'');
        for (const name of Array.from(node.classList)) {
            if (name.match(/^MJX-TeXAtom-/)) {
                texClass = name.substr(12);
                type = 'TeXAtom';
            } else if (name === 'MJX-fixedlimits') {
                limits = true;
            }
        }
        this.factory.getNodeClass(type) || this.Error('Unknown node type "'+type+'"');
        let mml = this.factory.create(type);
        if (texClass) {
            this.TeXAtom(mml, texClass, limits);
        }
        this.addAttributes(mml, node);
        this.checkClass(mml, node);
        this.addChildren(mml, node);
        return mml;
    }

    protected addAttributes(mml: MmlNode, node: HTMLElement) {
        for (const attr of Array.from(node.attributes)) {
            let name = attr.name;
            if (name === 'class') continue;
            let value = this.filterAttribute(name,attr.value);
            if (value === null) continue;
            let val = value.toLowerCase();
            if (val === 'true' || val === 'false') {
                mml.attributes.set(name, val === 'true');
            } else {
                mml.attributes.set(name,value);
            }
        }
    }

    protected filterAttribute(name: string, value: string) {
        // allow Safe extension to filter attribute values by overriding this
        return value;
    }

    protected addChildren(mml: MmlNode, node: HTMLElement) {
        if (mml.arity === 0) return;
        for (const child of (Array.from(node.childNodes) as HTMLElement[])) {
            if (child.nodeName === '#comment') continue;
            if (child.nodeName === '#text') {
                this.addText(mml, child);
            } else if (mml.isKind('annotation-xml')) {
                mml.appendChild(this.factory.create('XML').setXML(child));
            } else {
                let childMml = mml.appendChild(this.makeNode(child)) as MmlNode;
                if (childMml.arity === 0 && child.childNodes.length) {
                    if (this.options['fixMisplacedChildren']) {
                        this.addChildren(mml, child);
                    } else {
                        // FIXME:  Should this produce an error?
                    }
                }
            }
        }
    }

    protected addText(mml: MmlNode, child: HTMLElement) {
        let text = child.nodeValue;
        if ((mml.isToken || mml.getProperty('isChars')) && mml.arity) {
            if (mml.isToken) {
                text = this.entities.translate(text);
                text = this.trimSpace(text);
            }
            mml.appendChild(this.factory.create('text').setText(text));
        } else if (text.match(/\S/)) {
            this.Error('Unexpected text node "'+text+'"');
        }
    }

    protected checkClass(mml: MmlNode, node: HTMLElement) {
        let classList = [];
        for (const name of Array.from(node.classList)) {
            if (name.substr(0,4) === 'MJX-') {
                if (name.substr(0,11) === 'MJX-TeXAtom') continue;
                if (name === 'MJX-variant') {
                    mml.setProperty('variantForm', true);
                } else {
                    mml.attributes.set('mathvariant',name.substr(3));
                }
            } else {
                classList.push(name);
            }
        }
        if (classList.length) mml.attributes.set('class',classList.join(' '));
    }

    protected TeXAtom(mml: MmlNode, texClass: string, limits: boolean) {
        mml.texClass = (TEXCLASS as {[name: string]: number})[texClass];
        if (texClass === 'OP' && !limits) {
            mml.setProperty('movesupsub', true);
            mml.attributes.setInherited('movablelimits', true);
        }
    }

    protected markMrows(mml: MmlNode) {
        if (mml.isKind('mrow') && !mml.isInferred && mml.childNodes.length >= 2) {
            let first = mml.childNodes[0] as MmlNode;
            let last = mml.childNodes[mml.childNodes.length-1] as MmlNode;
            if (first.isKind('mo') && first.attributes.get('fence') &&
                last.isKind('mo') && last.attributes.get('fence')) {
                if (first.childNodes.length) {
                    mml.setProperty('open', (first as AMmlTokenNode).getText());
                }
                if (last.childNodes.length) {
                    mml.setProperty('close', (last as AMmlTokenNode).getText());
                }
            }
        }
    }

    protected trimSpace(text: string) {
        return text.replace(/[\t\n\r]/g, ' ')    // whitespace to spaces
                   .replace(/^ +/, '')           // initial whitespace
                   .replace(/ +$/, '')           // trailing whitespace
                   .replace(/  +/g, ' ');        // internal multiple whitespace
    }

    protected Error(message: string) {
        throw new Error(message);
    }
}
