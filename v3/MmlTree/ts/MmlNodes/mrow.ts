import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, IMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMrow extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };

    protected _core: number = null;

    get kind() {return 'mrow'}
    get isSpacelike() {
        for (const child of this.childNodes) {
            if (!child.isSpacelike) return false;
        }
        return true;
    }
    get isEmbellished() {
        let embellished = false;
        let i = 0;
        for (const child of this.childNodes) {
            if (!child) continue;
            if (child.isEmbellished) {
                if (embellished) return false;
                embellished = true;
                this._core = i;
            } else if (!child.isSpacelike) {
                return false;
            }
        }
        return embellished;
    }

    core(): MmlNode {
        if (!this.isEmbellished || this._core == null) return this;
        return this.childNodes[this._core];
    }
    coreMO(): MmlNode {
        if (!this.isEmbellished || this._core == null) return this;
        return this.childNodes[this._core].coreMO();
    }

    nonSpaceLength() {
        let n = 0;
        for (const child of this.childNodes) {
            if (child && !child.isSpacelike) n++;
        }
        return n;
    }
    firstNonSpace() {
        for (const child of this.childNodes) {
            if (child && !child.isSpacelike) return child;
        }
        return null;
    }
    lastNonSpace() {
        let i = this.childNodes.length;
        while (--i >= 0) {
            let child = this.childNodes[i];
            if (child && !child.isSpacelike) return child;
        }
        return null;
    }

    setTeXclass(prev: MmlNode) {
        if ((this.getProperty('open') != null || this.getProperty('close') != null) &&
            (!prev || prev.getProperty('fnOp') != null)) {
            //
            // <mrow> came from \left...\right
            // so treat as subexpression (TeX class INNER).
            //
            this.getPrevClass(prev);
            prev = null;
            for (const child of this.childNodes) {
                prev = child.setTeXclass(prev);
            }
            if (this.texClass == null) {
                this.texClass = TEXCLASS.INNER;
            }
            return prev;
        } else {
            //
            //  Normal <mrow>, so treat as though mrow is not there
            //
            for (const child of this.childNodes) {
                prev = child.setTeXclass(prev);
            }
            if (this.childNodes[0]) {
                this.updateTeXclass(this.childNodes[0]);
            }
            return prev;
        }
    }
}

export class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList = MmlMrow.defaults;

    get kind() {return 'inferredMrow'}
    get isInferred() {return true}
    get notParent() {return true}
}
