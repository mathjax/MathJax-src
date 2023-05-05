import {AsciiMath} from '../legacy/Shim.js';
import {MmlFactory} from '../../../../core/MmlTree/MmlFactory.js';

var factory = new MmlFactory();

export const LegacyAsciiMath = {
  Compile: function (am,display) {
    var script = {
      type: "math/asciimath",
      innerText: am,
      MathJax: {}
    };
    var node = AsciiMath.Translate(script).root.toMmlNode(factory);
    node.setInheritedAttributes({}, display, 0, false);
    return node;
  },
  Translate: function (am,display) {
    return this.Compile(am,display);
  }
};
