import {TeX} from '../../cjs/input/tex.js';
import {HTMLDocument} from '../../cjs/handlers/html/HTMLDocument.js';
import {liteAdaptor} from '../../cjs/adaptors/liteAdaptor.js';
import {STATE} from '../../cjs/core/MathItem.js';
import {SerializedMmlVisitor} from '../../cjs/core/MmlTree/SerializedMmlVisitor.js';
import {MmlNode} from '../../cjs/core/MmlTree/MmlNode.js';
import '../../cjs/input/tex/AllPackages.js';

let convert: (tex: string) => string;

export function setupTex(packages: string[] = ['base'], options = {}) {
  const parserOptions = Object.assign({}, {packages: packages}, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', liteAdaptor(), {InputJax: tex});
  const visitor = new SerializedMmlVisitor();
  const toMathML = ((node: MmlNode) => visitor.visitTree(node));
  convert = (expr: string) =>
    toMathML(html.convert(expr, {display: true, end: STATE.CONVERT}));
}

export function tex2mml(tex: string) {
  return convert(tex);
};

