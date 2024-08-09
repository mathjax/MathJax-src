import { AsciiMath } from './legacy/shim.js';
import { MmlFactory } from '../../core/MmlTree/MmlFactory.js';

const factory = new MmlFactory();

export const LegacyAsciiMath = {
  Compile: function (am: any, display: boolean) {
    const script = {
      type: 'math/asciimath',
      innerText: am,
      MathJax: {},
    };
    const node = AsciiMath.Translate(script).root.toMmlNode(factory);
    node.setInheritedAttributes({}, display, 0, false);
    return node;
  },
  Translate: function (am: any, display: boolean) {
    return this.Compile(am, display);
  },
};
