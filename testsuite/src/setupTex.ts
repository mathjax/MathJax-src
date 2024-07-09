import {TeX} from '#js/input/tex';
import {HTMLDocument} from '#js/handlers/html/HTMLDocument';
import {liteAdaptor} from '#js/adaptors/liteAdaptor';
import {STATE} from '#js/core/MathItem';
import {SerializedMmlVisitor} from '#js/core/MmlTree/SerializedMmlVisitor';
import {MmlNode} from '#js/core/MmlTree/MmlNode';

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

import {SVG} from '#js/output/svg';

export function setupTexWithOutput(packages: string[] = ['base'], options = {}) {
  const parserOptions = Object.assign({}, {packages: packages}, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', liteAdaptor(), {InputJax: tex, OutputJax: new SVG()});
  const visitor = new SerializedMmlVisitor();
  const toMathML = ((node: MmlNode) => visitor.visitTree(node));
  convert = (expr: string) =>
    toMathML(html.convert(expr, {display: true, end: STATE.CONVERT}));
}

export function tex2mml(tex: string) {
  return convert(tex);
};

