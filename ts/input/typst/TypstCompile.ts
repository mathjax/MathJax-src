/*************************************************************
 *
 *  Typst compiler adapter for the MathJax Typst InputJax.
 *
 *  Converts Typst math source to MathML via ASTToMathML and then
 *  reuses MathJax's native MathML compiler to produce MmlNodes.
 *
 *************************************************************/

import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {
  defaultOptions,
  OptionList,
  userOptions,
} from '../../util/Options.js';

import {MathMLCompile} from '../mathml/MathMLCompile.js';
import {astToMathML, escapeXml} from './ASTToMathML.js';


export type TypstParseError = {
  message?: string;
  error?: string;
  [key: string]: unknown;
};


export type TypstParseResult = {
  root: unknown;
  errors?: Array<TypstParseError | string>;
};


export type ParseAst = (
  source: string,
  options: {mode: 'math'}
) => TypstParseResult;


export type TYPSTCOMPILE_OPTIONS = {
  /**
   * Typst AST parser.  This is injected rather than imported here so that
   * the same MathJax source works with both @r4ai/typst-ast-node and
   * @r4ai/typst-ast-web.
   */
  parseAst: ParseAst | null;

  /**
   * Propagate parser/conversion errors rather than returning <merror>.
   */
  throwOnError: boolean;

  /**
   * Behaviour used by ASTToMathML for unsupported Typst AST nodes.
   */
  unsupported: 'merror' | 'throw';
};


const options: TYPSTCOMPILE_OPTIONS = {
  parseAst: null,
  throwOnError: false,
  unsupported: 'merror',
};


/**
 *
 * @param parsed
 */
function parserErrorMessage(parsed: TypstParseResult): string | null {
  const errors = parsed?.errors;

  if (!Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  return errors.map((error) => {
    if (typeof error === 'string') {
      return error;
    }

    return error?.message ?? error?.error ?? JSON.stringify(error);
  }).join('; ');
}


/**
 *
 * @param message
 * @param display
 */
function errorMathML(message: string, display: boolean): string {
  const attr = display ? ' display="block"' : '';

  return (
    '<math xmlns="http://www.w3.org/1998/Math/MathML"' +
    attr +
    '><merror><mtext>' +
    escapeXml(message) +
    '</mtext></merror></math>'
  );
}


/**
 * Parse Typst math, convert it to MathML, then use MathJax's existing
 * MathMLCompile implementation to construct the internal MmlNode tree.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class TypstCompile<N, T, D> {

  public static OPTIONS = options;

  /**
   * DOM adaptor supplied by the MathJax document handler.
   */
  public adaptor: DOMAdaptor<N, T, D> = null;

  /**
   * MmlFactory supplied by the MathJax document handler.
   */
  public factory: MmlFactory = null;

  /**
   * Effective compiler options.
   */
  public options: OptionList;

  /**
   * MathJax's native MathML -> MmlNode compiler.
   */
  protected mathml: MathMLCompile<N, T, D>;


  constructor(options: OptionList = {}) {
    const Class = this.constructor as typeof TypstCompile;
    this.options = userOptions(defaultOptions({}, Class.OPTIONS), options);
    this.mathml = new MathMLCompile<N, T, D>();
  }


  public setAdaptor(adaptor: DOMAdaptor<N, T, D>) {
    this.adaptor = adaptor;
    this.mathml.adaptor = adaptor;
  }


  public setMmlFactory(mmlFactory: MmlFactory) {
    this.factory = mmlFactory;
    this.mathml.setMmlFactory(mmlFactory);
  }


  /**
   * Convert Typst math source into MathJax's internal MML tree.
   *
   * @param source
   * @param display
   */
  public compile(source: string, display: boolean = false): MmlNode {
    let mathml: string;

    try {
      const parseAst = this.options.parseAst as ParseAst | null;

      if (typeof parseAst !== 'function') {
        throw new Error(
          'No Typst parser configured; pass parseAst from ' +
          '@r4ai/typst-ast-node or @r4ai/typst-ast-web'
        );
      }

      const parsed = parseAst(source, {mode: 'math'});
      const message = parserErrorMessage(parsed);

      if (message) {
        throw new Error(`Typst parse error: ${message}`);
      }

      if (!parsed || !('root' in parsed)) {
        throw new Error('Typst parser returned no AST root');
      }

      mathml = astToMathML(parsed.root, {
        display,
        unsupported: this.options.unsupported,
      });

    } catch (error) {
      if (this.options.throwOnError) {
        throw error;
      }

      const message = error instanceof Error
        ? error.message
        : String(error);

      mathml = errorMathML(message, display);
    }

    return this.compileMathML(mathml);
  }


  /**
   * Parse our generated MathML into the active DOM implementation and reuse
   * MathJax's MathMLCompile class to construct the internal MmlNode tree.
   *
   * @param mathml
   */
  protected compileMathML(mathml: string): MmlNode {
    if (!this.adaptor) {
      throw new Error('TypstCompile has no DOM adaptor');
    }

    if (!this.factory) {
      throw new Error('TypstCompile has no MmlFactory');
    }

    const html =
      `<html><head></head><body>${mathml}</body></html>`;

    const doc = this.adaptor.parse(html, 'text/html');
    const body = this.adaptor.body(doc);

    if (this.adaptor.childNodes(body).length !== 1) {
      throw new Error('Typst conversion did not produce a single <math> node');
    }

    const node = this.adaptor.remove(
      this.adaptor.firstChild(body)
    ) as N;

    if (this.adaptor.kind(node).replace(/^[a-z]+:/, '') !== 'math') {
      throw new Error(
        `Typst conversion produced <${this.adaptor.kind(node)}> rather than <math>`
      );
    }

    return this.mathml.compile(node);
  }

}
