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
import {tmpJsonFile} from './constants';
import * as fs from 'fs';

let convert: (tex: string, display: boolean) => string;

export function setupTex(packages: string[] = ['base'], options = {}) {
  const parserOptions = Object.assign({}, {packages: packages}, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', liteAdaptor(), {InputJax: tex});
  const visitor = new SerializedMmlVisitor();
  const toMathML = ((node: MmlNode) => visitor.visitTree(node));
  convert = (expr: string, display: boolean) =>
    toMathML(html.convert(expr, {display: display, end: STATE.CONVERT}));
}

import {SVG} from '#js/output/svg';

export function setupTexWithOutput(packages: string[] = ['base'], options = {}) {
  const parserOptions = Object.assign({}, {packages: packages}, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', liteAdaptor(), {InputJax: tex, OutputJax: new SVG()});
  const visitor = new SerializedMmlVisitor();
  const toMathML = ((node: MmlNode) => visitor.visitTree(node));
  convert = (expr: string, display: boolean) =>
    toMathML(html.convert(expr, {display: display, end: STATE.CONVERT}));
}

export function tex2mml(tex: string, display: boolean = true) {
  return convert(tex, display);
};

// Machinery for measuring the completeness of our macro tests.

const tokens: Map<string, Set<string>> = new Map();

/**
 * Adds a token to the token set.
 * @param {string} name Table name.
 * @param {string} token Token string.
 */
function addToken(name: string, token: string) {
  let tokenSet = tokens.get(name);
  if (!tokenSet) {
    tokenSet = new Set();
    tokens.set(name, tokenSet);
  }
  tokenSet.add(token);
}

/**
 * Set difference.
 * @param {Set<string>} exp Expected elements.
 * @param {Set<string>} act Actual elements.
 * @return {Set<string>} Expected setminus actual.
 */
function setdifference(exp: Set<string>, act: Set<string>): Set<string> {
  act.forEach(x => exp.delete(x));
  return exp;
}

/**
 * Diff between macros
 * @param {string} handler
 * @return {[Set<string>, number, number]}
 */
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

interface tables {
  table: string,
  size: number,
  actual: number,
  missing: string[]
}

/**
 * Gets tested tokens for a configuration and pushes them to the intermediary
 * test file.
 *
 * @param {string} configuration The name of the configuration.
 */
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
        actual: act,
        missing: Array.from(diff)
      })
    }
  });
  fs.appendFileSync(tmpJsonFile, ',' + JSON.stringify(outJSON, null, 2));
}

// A prototype extension for the macro table lookups.
AbstractParseMap.prototype.lookup = function(token: string) {
  const result = this.map.get(token);
  if (result) {
    addToken(this.name, token);
  }
  return result;
}
