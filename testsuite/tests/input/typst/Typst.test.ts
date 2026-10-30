import { describe, expect, it, jest } from '@jest/globals';
import { parseAst } from '@r4ai/typst-ast-node';
import { liteAdaptor } from '#js/adaptors/liteAdaptor.js';
import { STATE } from '#js/core/MathItem.js';
import { MmlNode } from '#js/core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '#js/core/MmlTree/SerializedMmlVisitor.js';
import { HTMLDocument } from '#js/handlers/html/HTMLDocument.js';
import { HTMLMathItem } from '#js/handlers/html/HTMLMathItem.js';
import { Typst } from '#js/input/typst.js';
import { FindTypst } from '#js/input/typst/FindTypst.js';
import { TypstCompile } from '#js/input/typst/TypstCompile.js';

const serialize = (root: MmlNode) => new SerializedMmlVisitor().visitTree(root);

describe('Typst input jax', () => {
  it('finds and compiles inline and display math in an HTML document', () => {
    const input = new Typst({ parseAst });
    const adaptor = liteAdaptor();
    const document = new HTMLDocument(
      adaptor.parse('<p>Inline $x + 1$ and display $$frac(a, b)$$.</p>'),
      adaptor,
      { InputJax: input }
    );
    document.findMath({}).compile();
    const items = Array.from(document.math);
    expect(input.name).toBe('Typst');
    expect(input.processStrings).toBe(true);
    expect(items.map(({ math, display }) => [math, display])).toEqual([
      ['x + 1', false],
      ['frac(a, b)', true],
    ]);
    expect(items.map(({ root }) => serialize(root))).toMatchSnapshot();
  });

  it('routes delimiter and compiler options through the constructor', () => {
    const input = new Typst({
      parseAst,
      inlineDelimiters: [['\\(', '\\)']],
      displayDelimiters: [],
      processEscapes: false,
      throwOnError: true,
      unsupported: 'throw',
    });
    const document = new HTMLDocument('', liteAdaptor(), { InputJax: input });
    expect(
      input.findMath([String.raw`$ignored$ \(x\)`]).map(({ math }) => math)
    ).toEqual(['x']);
    expect(() =>
      input.compile(new HTMLMathItem('x /', input), document)
    ).toThrow('Typst parse error');
    const root = document.convert('sqrt(x)', {
      display: false,
      end: STATE.CONVERT,
    }) as MmlNode;
    expect(serialize(root)).toContain('<msqrt>');
    expect(root.attributes.get('display')).toBe('inline');
  });

  it('supports injected finder and compiler instances and initializes their dependencies', () => {
    const finder = new FindTypst({
      inlineDelimiters: [['[', ']']],
      displayDelimiters: [],
    });
    const compiler = new TypstCompile({ parseAst });
    const find = jest.spyOn(finder, 'findMath');
    const compile = jest.spyOn(compiler, 'compile');
    const input = new Typst({ FindTypst: finder, TypstCompile: compiler });
    const adaptor = liteAdaptor();
    const document = new HTMLDocument('', adaptor, { InputJax: input });
    expect(compiler.adaptor).toBe(adaptor);
    expect(compiler.factory).toBe(input.mmlFactory);
    expect(input.findMath(['[x]'])[0].math).toBe('x');
    expect(find).toHaveBeenCalledWith(['[x]']);
    const root = input.compile(new HTMLMathItem('x', input, true), document);
    expect(compile).toHaveBeenCalledWith('x', true);
    expect(serialize(root)).toContain('<mi>x</mi>');
  });

  it('passes filter context, uses replacement data, and updates the display flag', () => {
    const parser = jest.fn(parseAst);
    const input = new Typst({ parseAst: parser });
    const document = new HTMLDocument('', liteAdaptor(), { InputJax: input });
    const item = new HTMLMathItem('original', input, false);
    const replacement = input.mmlFactory.create('math', { display: 'block' });
    const stages: string[] = [];
    input.preFilters.add((args) => {
      expect(args.math).toBe(item);
      expect(args.document).toBe(document);
      expect(args.data).toBe('original');
      stages.push('pre');
      args.data = 'x';
    });
    input.postFilters.add((args) => {
      expect(args.math).toBe(item);
      expect(args.document).toBe(document);
      expect(serialize(args.data)).toContain('<mi>x</mi>');
      stages.push('post');
      args.data = replacement;
    });
    expect(input.compile(item, document)).toBe(replacement);
    expect(parser).toHaveBeenCalledWith('x', { mode: 'math' });
    expect(stages).toEqual(['pre', 'post']);
    expect(item.display).toBe(true);
  });

  it('normalizes a missing source and display flag before invoking the parser', () => {
    const parser = jest.fn(parseAst);
    const input = new Typst({ parseAst: parser });
    const document = new HTMLDocument('', liteAdaptor(), { InputJax: input });
    const item = new HTMLMathItem(null, input, null);
    expect(input.compile(item, document).kind).toBe('math');
    expect(parser).toHaveBeenCalledWith('', { mode: 'math' });
    expect(item.display).toBe(false);
  });
});
