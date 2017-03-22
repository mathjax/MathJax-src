import {PropertyList} from '../Node';
import {AMmlTokenNode, TEXCLASS} from '../MmlNode';

/*****************************************************************/
/*
 *  Implements the MmlMtext node class (subclass of AMmlTokenNode)
 */

export class MmlMtext extends AMmlTokenNode {
    public static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    public texClass = TEXCLASS.ORD;

    /*
     * @return {string}  The mtext kind
     */
    public get kind() {
        return 'mtext';
    }

    /*
     * @return {boolean}  <mtext> is always space-like according to the spec
     */
    public get isSpacelike() {
        return true;
    }
}
