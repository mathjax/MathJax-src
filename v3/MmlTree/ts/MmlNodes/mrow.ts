import {PropertyList} from '../Node';
import {AMmlNode, MmlNode} from '../MmlNode';

export class MmlMrow extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };

    protected _core: number = null;

    get kind() {return 'mrow'}
    get isSpacelike() {
        for (const child of this.childNodes) {
            if (!(child as AMmlNode).isSpacelike) return false;
        }
        return true;
    }
    get isEmbellished() {
        let embellished = false;
        let i = 0;
        for (const child of (this.childNodes as AMmlNode[])) {
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
        return (this.childNodes[this._core] as AMmlNode).coreMO();
    }

    nonSpaceLength() {
        let n = 0;
        for (const child of (this.childNodes as AMmlNode[])) {
            if (child && !child.isSpacelike) n++;
        }
        return n;
    }
    firstNonSpace() {
        for (const child of (this.childNodes as AMmlNode[])) {
            if (child && !child.isSpacelike) return child;
        }
        return null;
    }
    lastNonSpace() {
        for (const child of (this.childNodes as AMmlNode[]).reverse()) {
            if (child && !child.isSpacelike) return child;
        }
        return null;
    }
}

export class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList = MmlMrow.defaults;

    get kind() {return 'inferredMrow'}
    get isInferred() {return true}
    get notParent() {return true}
}
