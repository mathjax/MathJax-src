import {TeX} from '#js/input/tex.js';
import {AbstractParseMap, RegExpMap, CommandMap} from '#js/input/tex/TokenMap.js';
import {ConfigurationHandler} from '#js/input/tex/Configuration.js';
import {HandlerType, ConfigurationType} from '#js/input/tex/HandlerTypes.js';
import {MapHandler} from '#js/input/tex/MapHandler.js';
import {HTMLDocument} from '#js/handlers/html/HTMLDocument.js';
import {RegisterHTMLHandler} from '#js/handlers/html.js';
import {liteAdaptor} from '#js/adaptors/liteAdaptor.js';
import {MathItem, STATE} from '#js/core/MathItem.js';
import {SerializedMmlVisitor} from '#js/core/MmlTree/SerializedMmlVisitor.js';
import {MmlNode} from '#js/core/MmlTree/MmlNode.js';
import {mathjax} from '#js/mathjax.js';
import {OptionList} from '#js/util/Options.js';
import {tmpJsonFile} from '#src/constants.js';
import * as fs from 'fs';
// @ts-ignore
import {init} from '#source/node-main/node-main.mjs';
import {expect} from '@jest/globals';
// @ts-ignore
import {source} from '#source/source.js';

declare const MathJax: any;
type MATHITEM = MathItem<any, any, any>;
type PackageList = (string | [string, number])[];

/**
 * The various conversion functions (set up in setupTex... function below).
 */
let convert: (tex: string, display: boolean) => string;
let render: (text: string, display: boolean) => string;
let typeset: (text: string, display: boolean) => Promise<string>;
let page: (text: string) => Promise<string[]>;

/**
 * A promise that resolves when the components are loaded and set up.
 */
let componentPromise: Promise<void | typeof MathJax>;

/**
 * Get the adaptor, and register HTML documents.
 */
const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);

/**
 * A vistor to convert MmlNodes to serialized MathML.
 */
const visitor = new SerializedMmlVisitor();
export const toMathML = ((node: MmlNode) => visitor.visitTree(node));

/*********************************************************************/

/**
 * Trap output produced while running code.
 * @param method The console method to trap.
 * @param code The code to run.
 * @return The output sent to the given method.
 */
export function trapOutput(method: string, code: () => void) {
  const saved = (console as any)[method];
  let message = '';
  (console as any)[method] = (...msg: any[]) => {message += (message ? '\n' : '') + msg.join(' ')};
  code();
  (console as any)[method] = saved;
  return message;
}

/**
 * Trap errors produced while running code.
 * @param code The code to run.
 * @return The error message produced.
 */
export function trapErrors(code: () => void) {
  let message = '(no error)';
  reportErrors = true;
  try {code()} catch (e) {message = e.message}
  reportErrors = false;
  return message;
}

/**
 * Trap errors produced while running code.
 * @param code The code to run.
 * @return The error message produced.
 */
export async function trapAsyncErrors(code: () => Promise<void>) {
  let message = '(no error)';
  reportErrors = true;
  await code().catch((e) => {message = e.message});
  reportErrors = false;
  return message;
}

/**
 * When true, errors will throw rather than produce merror elements.
 */
let reportErrors = false;

/**
 * Configuration that causes TeX errors to throw rather than
 * generate merror elements, so we can trap them with trapErrors().
 */
export const throwTexErrors = {
  formatError(jax: any, err: Error) {
    if (reportErrors) throw err;
    return jax.formatError(err);
  }
}

/**
 * Configuration that causes compile errors to throw rather than
 * generate merror elements, so we can trap them with trapErrors().
 */
export const throwCompileErrors = {
  options: {
    compileError(jax: any, math: any, err: Error) {
      if (reportErrors) throw err;
      return jax.compileError(math, err);
    }
  }
}

/**
 * Trap TeX processing errors and return an expect() result
 * @param string The TeX string to process
 * @param display True for display style, false for in-line
 * @param typeset The function used to typeset the TeX (tex2mml, typeset2mml, etc)
 */
export function expectTexError(
  tex: string,
  display: boolean = true,
  fn: (((tex: string, display?: boolean) => any) | ((tex: string) => any)) = tex2mml,
): any {
  return expect(trapErrors(() => fn(tex, display)));
}

/**
 * Trap TeX processing errors and return an expect() result
 * @param string The TeX string to process
 * @param display True for display style, false for in-line
 * @param typeset The function used to typeset the TeX (tex2mml, typeset2mml, etc)
 */
export function expectTypesetError(
  tex: string,
  display: boolean = true,
  fn: (((tex: string, display?: boolean) => Promise<any>) | ((tex: string) => Promise<any>)) = typeset2mml,
): any {
  return expect(trapAsyncErrors(() => fn(tex, display))).resolves;
}

/*********************************************************************/

/**
 * Set up TeX input packages and options for tex2mml(), and create the convert() function,
 *   which uses MathDocument.convert() to compile the TeX.
 *
 * @param {string[]} packages    The TeX packages to configure
 * @param {OptionList} options   The TeX options to include
 */
export function setupTex(packages: PackageList = ['base'], options: OptionList = {}) {
  const parserOptions = Object.assign({}, {packages}, throwTexErrors, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', adaptor, {InputJax: tex});
  convert = (expr: string, display: boolean) =>
    toMathML(html.convert(expr, {display: display, end: STATE.CONVERT}));
}

/**
 * Set up TeX input packages and options for render2mml(), and create the render() function,
 *   which uses MathDocument.findMath().compile() to compile the TeX from within a document.
 *
 * @param {string[]} packages    The TeX packages to configure
 * @param {OptionList} options   The TeX options to include
 */
export function setupTexRender(packages: PackageList = ['base'], options: OptionList = {}) {
  const parserOptions = Object.assign(
    {},
    {packages: packages, inlineMath: {'[+]': [['$', '$']]}},
    throwTexErrors,
    options
  );
  const tex = new TeX(parserOptions);
  render = (text: string, display: boolean) => {
    const delim = display ? '$$' : '$';
    const document = `<html><head></head><body>${delim}${text}${delim}</body></html>`;
    const html = mathjax.document(document, {InputJax: tex});
    html.findMath().compile();
    return toMathML((Array.from(html.math)[0] as MATHITEM).root);
  }
}

/**
 * Set up TeX input packages and options for typeset2mml(), and create the typeset() function,
 *   which uses MathDocument.findMath().compile() wrapped in handleRetriesFor() to
 *   compile the TeX from within a document asynchronously.
 *
 * @param {string[]} packages    The TeX packages to configure
 * @param {OptionList} options   The TeX options to include
 */
export function setupTexTypeset(packages: PackageList = ['base'], options: OptionList = {}) {
  MathJax.config.tex = Object.assign(
    {},
    {packages: packages, inlineMath: {'[+]': [['$', '$']]}},
    throwTexErrors,
    options
  );
  typeset = async (text: string, display: boolean) => {
    await componentPromise;
    const delim = display ? '$$' : '$';
    MathJax.config.startup.document =
      `<html><head></head><body>${delim}${text}${delim}</body></html>`;
    MathJax.startup.getComponents();
    const mathdoc = MathJax.startup.document;
    await mathjax.handleRetriesFor(() => mathdoc.findMath().compile());
    return toMathML((Array.from(mathdoc.math) as MATHITEM[])[0].root);
  }
}

/**
 * Set up TeX input packages and options for page2mml(), and create the page() function,
 *   which uses MathDocument.findMath().compile() wrapped in handleRetriesFor() to
 *   compile a pagefrom within a document asynchronously, and test an array of results,
 *   one for each expression in the page.
 *
 * @param {string[]} packages    The TeX packages to configure
 * @param {OptionList} options   The TeX options to include
 */
export function setupTexPage(packages: PackageList = ['base'], options: OptionList = {}) {
  MathJax.config.tex = Object.assign(
    {},
    {packages: packages, inlineMath: {'[+]': [['$', '$']]}},
    throwTexErrors,
    options
  );
  page = async (text: string) => {
    await componentPromise;
    MathJax.config.startup.document =
      `<html><head></head><body>${text}</body></html>`;
    MathJax.startup.getComponents();
    const mathdoc = MathJax.startup.document;
    await mathjax.handleRetriesFor(() => mathdoc.findMath().compile());
    const math = Array.from(mathdoc.math) as MATHITEM[];
    return math.map((mi) => toMathML(mi.root));
  }
}

import {SVG} from '#js/output/svg.js';

/**
 * Set up TeX input packages and options for tex2mml(), and create the convert() function,
 *   which uses MathDocument.convert() to typeset the Tex, with an SVG output jax available.
 *
 * @param {string[]} packages    The TeX packages to configure
 * @param {OptionList} options   The TeX options to include
 */
export function setupTexWithOutput(packages: string[] = ['base'], options: OptionList = {}) {
  const parserOptions = Object.assign({}, {packages: packages}, options);
  const tex = new TeX(parserOptions);
  const html = new HTMLDocument('', adaptor, {InputJax: tex, OutputJax: new SVG()});
  const visitor = new SerializedMmlVisitor();
  const toMathML = ((node: MmlNode) => visitor.visitTree(node));
  convert = (expr: string, display: boolean) =>
    toMathML(html.convert(expr, {display: display, end: STATE.CONVERT}));
}

/*********************************************************************/

/**
 * Convert TeX to MathML using MathDocument.convert
 *
 * @param {string} tex        The math to convert
 * @param {boolean} display   True for display math, false for in-line math
 * @returns {string}          The MathML for the TeX expression
 */
export function tex2mml(tex: string, display: boolean = true): string {
  return convert(tex, display);
};

/**
 * Convert TeX to MathML using MathDocument.findMath().compile() on a document
 *   (allows embedded HTML tags when texhtml is present).
 *
 * @param {string} tex        The math to convert
 * @param {boolean} display   True for display math, false for in-line math
 * @returns {string}          The MathML for the TeX expression
 */
export function render2mml(tex: string, display: boolean = true): string {
  return render(tex, display);
}

/**
 * Convert TeX to MathML using MathDocument.findMath().compile() wrapped in
 * handleRetriesFor() on a document (allows retries to be processed).
 *
 * @param {string} tex          The math to convert
 * @param {boolean} display     True for display math, false for in-line math
 * @returns {Promise<string>}   A promise for the MathML for the TeX expression
 */
export function typeset2mml(tex: string, display: boolean = true): Promise<string> {
  return typeset(tex, display);
}

/**
 * Convert TeX to MathML using MathDocument.findMath().compile() wrapped in
 * handleRetriesFor() on a whole document (allowing retries to be processed).
 * Returns an array of MathML, one for each expression in the page
 *
 * @param {string} text           The serialized HTML document to process.
 * @returns {Promise<string[]>}   A promise for the array of MathML from the document
 */
export function page2mml(text: string): Promise<string[]> {
  return page(text);
}

/*********************************************************************/

/**
 * Initialize the component framework (for typeset2mml() and
 * page2mml()), setting a promise for when that is complete (the
 * conversion functions with for that promise to resolve).
 * @param config The MathJax configuration
 */
export async function setupComponents(config: any) {
  mathjax.handlers.unregister(handler);
  //
  // Jest import() doesn't return a promise that is an instance of Promise,
  //   so wrap it in a real promise, so Package will properly identify it.
  //
  MathJax.config.loader.require = (file: string) => {
    return new Promise((ok, fail) => import(file).then(ok).catch(e => fail(e)));
  }
  MathJax.config.loader.source = source;
  config.startup ??= {};
  config.startup.typeset ??= false;
  config = Object.assign({}, throwCompileErrors, config);
  componentPromise = init(config);
}

/*********************************************************************/

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

//
// Force the original lookup to be called (so we get coverage for it) before we change it.
//
(function () {new CommandMap('', {}).lookup('x')})();

// A prototype extension for the macro table lookups.
AbstractParseMap.prototype.lookup = function(token: string) {
  const result = this.map.get(token);
  if (result) {
    addToken(this.name, token);
  }
  return result;
}
