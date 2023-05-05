import {MmlNode} from '../../../../core/MmlTree/MmlNode.js';

export const LegacyAsciiMath: {
  Compile(am: any, display: boolean): MmlNode;
  Translate(am: any, display: boolean): MmlNode;
}
