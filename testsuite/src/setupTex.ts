import {TeX} from '#js/input/tex';
import {AbstractParseMap, RegExpMap} from '#js/input/tex/TokenMap';
import {ConfigurationHandler} from '#js/input/tex/Configuration';
import {HandlerType, ConfigurationType} from '#js/input/tex/HandlerTypes.js';
import {MapHandler} from '#js/input/tex/MapHandler.js';
import {HTMLDocument} from '#js/handlers/html/HTMLDocument';
import {liteAdaptor} from '#js/adaptors/liteAdaptor';
import {STATE} from '#js/core/MathItem';
import {SerializedMmlVisitor} from '#js/core/MmlTree/SerializedMmlVisitor';
import {MmlNode} from '#js/core/MmlTree/MmlNode';
import '#js/input/tex/AllPackages';
import * as fs from 'fs';


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

// Machinery for measuring the completeness of our macro tests.

const tokens: Map<string, Set<string>> = new Map();

function addToken(name: string, token: string) {
  let tokenSet = tokens.get(name);
  if (!tokenSet) {
    tokenSet = new Set();
    tokens.set(name, tokenSet);
  }
  tokenSet.add(token);
}

export function setdifference(exp: Set<string>, act: Set<string>): Set<string> {
  act.forEach(x => exp.delete(x));
  return exp;
}

function diffMacros(handler: string): [Set<string>, number, number] {
  const expected = MapHandler.getMap(handler);
  if (!expected || expected instanceof RegExpMap) {
    return [null, 0, 0];
  }
  const actual = tokens.get(handler);
  const expSet = new Set((expected as any).map.keys()) as Set<string>;
  const expSize = expSet.size;
  if (!actual) {
    return [expSet, expSize, 0];
  }
  return [setdifference(expSet, actual), expSize, actual.size];
}

declare const global: any;
interface tables {
  table: string,
  size: number,
  rest: number,
  missing: string[]
}

export function getTokens(configuration: string) {
  const config = ConfigurationHandler.get(configuration);
  if (!config) {
    console.error(`Something went wrong for configuration ${configuration}`);
  }
  const handlers = config[ConfigurationType.HANDLER];
  // We can omit `handlers[HandlerType.DELIMITER]`.
  const allHandlers = [].concat(
    handlers[HandlerType.CHARACTER],
    handlers[HandlerType.MACRO],
    handlers[HandlerType.ENVIRONMENT]);
  let tables: tables[] = [];
  let outJSON: {
    configuration: string,
    tables: tables[]
  } = {configuration: configuration, tables: tables};
  allHandlers.forEach((handler) => {
    const [diff, exp, act] = diffMacros(handler);
    if (diff) {
      tables.push({
        table: handler,
        size: exp,
        rest: act,
        missing: Array.from(diff)
      })
    }
  });
  fs.appendFile('/tmp/test.json', ',' + JSON.stringify(outJSON, null, 2), (_err) => {
    console.warn('could not write file test.json');
  });
  return tokens;
}

// A prototype extension!
AbstractParseMap.prototype.lookup = function(token: string) {
  const result = this.map.get(token);
  if (result && !token.match(/^\s$/)) {
    addToken(this.name, token);
  }
  return result;
}

