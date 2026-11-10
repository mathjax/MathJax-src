import { describe, expect, it, jest } from '@jest/globals';
import { parseAst } from '@r4ai/typst-ast-node';
import { liteAdaptor } from '#js/adaptors/liteAdaptor.js';
import { MmlFactory } from '#js/core/MmlTree/MmlFactory.js';
import { AbstractMmlTokenNode, MmlNode } from '#js/core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '#js/core/MmlTree/SerializedMmlVisitor.js';
import {
  TypstCompile,
  TypstParseResult,
} from '#js/input/typst/TypstCompile.js';
import { OptionList } from '#js/util/Options.js';
// The lite adaptor loads uncommon entities separately, including &apos;.
import '#js/util/entities/a.js';

const serialize = (root: MmlNode) => new SerializedMmlVisitor().visitTree(root);

const textContent = (root: MmlNode) => {
  let text = '';
  root.walkTree((node) => {
    if (node.kind === 'mtext') text += (node as AbstractMmlTokenNode).getText();
  });
  return text;
};

const compiler = (options: OptionList = {}) => {
  const result = new TypstCompile({ parseAst, ...options });
  result.setAdaptor(liteAdaptor());
  result.setMmlFactory(new MmlFactory());
  return result;
};

describe('TypstCompile', () => {
  it.each([false, true])(
    'compiles real Typst to an internal MathML tree (display: %s)',
    (display) => {
      const root = compiler().compile('frac(x_1, sqrt(2))', display);
      expect(root.kind).toBe('math');
      expect(root.attributes.get('display')).toBe(display ? 'block' : 'inline');
      expect(serialize(root)).toMatchSnapshot();
    }
  );

  it('passes delimiter-free source and math mode to the supplied parser', () => {
    const parser = jest.fn(() => ({ root: [{ kind: 'int', value: 7 }] }));
    expect(
      serialize(compiler({ parseAst: parser }).compile('source'))
    ).toContain('<mn>7</mn>');
    expect(parser).toHaveBeenCalledTimes(1);
    expect(parser).toHaveBeenCalledWith('source', { mode: 'math' });
  });

  it('preserves text containing XML metacharacters', () => {
    const root = compiler().compile('text("<&>")');
    expect(textContent(root)).toBe('<&>');
    expect(serialize(root)).not.toContain('<merror');
  });

  it('renders a useful error when no parser is configured', () => {
    expect(serialize(compiler({ parseAst: null }).compile('x'))).toContain(
      'No Typst parser configured; pass parseAst from @r4ai/typst-ast-node or @r4ai/typst-ast-web'
    );
  });

  it.each([false, true])(
    'renders real parser errors with the requested display mode (%s)',
    (display) => {
      const root = compiler().compile('x /', display);
      expect(root.attributes.get('display')).toBe(display ? 'block' : 'inline');
      expect(serialize(root)).toContain('<merror>');
      expect(serialize(root)).toContain(
        'Typst parse error: expected expression'
      );
    }
  );

  it('combines string, message, error, and unstructured parser diagnostics', () => {
    const parseAst = (): TypstParseResult => ({
      root: [],
      errors: ['first', { message: 'second' }, { error: 'third' }, { code: 4 }],
    });
    const root = compiler({ parseAst }).compile('x');
    expect(textContent(root)).toBe(
      'Typst parse error: first; second; third; {"code":4}'
    );
  });

  it.each([null, {}])('reports a missing AST root: %j', (parsed) => {
    expect(
      serialize(compiler({ parseAst: () => parsed }).compile('x'))
    ).toContain('Typst parser returned no AST root');
  });

  it('escapes parser exceptions and preserves their text in an merror', () => {
    const message = '<bad>&"\'';
    const root = compiler({
      parseAst: () => {
        throw new Error(message);
      },
    }).compile('x');
    expect(serialize(root)).toContain('<merror>');
    expect(textContent(root)).toBe(message);
  });

  it('handles non-Error exceptions', () => {
    expect(
      serialize(
        compiler({
          parseAst: () => {
            throw 'parser failed';
          },
        }).compile('x')
      )
    ).toContain('parser failed');
  });

  it('rethrows the original exception when throwOnError is enabled', () => {
    const error = new Error('parser failed');
    expect(() =>
      compiler({
        parseAst: () => {
          throw error;
        },
        throwOnError: true,
      }).compile('x')
    ).toThrow(error);
    expect(() => compiler({ throwOnError: true }).compile('x /')).toThrow(
      'Typst parse error: expected expression'
    );
  });

  it('keeps unsupported-node policy separate from exception propagation', () => {
    const parseAst = (): TypstParseResult => ({ root: [{ kind: 'unknown' }] });
    expect(
      serialize(compiler({ parseAst, throwOnError: true }).compile('x'))
    ).toContain('Unsupported Typst node: unknown');
    expect(
      serialize(compiler({ parseAst, unsupported: 'throw' }).compile('x'))
    ).toContain('Unsupported Typst AST node: unknown');
    expect(() =>
      compiler({ parseAst, unsupported: 'throw', throwOnError: true }).compile(
        'x'
      )
    ).toThrow('Unsupported Typst AST node: unknown');
  });

  it('requires both a DOM adaptor and a MathML factory', () => {
    const result = new TypstCompile({ parseAst });
    expect(() => result.compile('x')).toThrow(
      'TypstCompile has no DOM adaptor'
    );
    result.setAdaptor(liteAdaptor());
    expect(() => result.compile('x')).toThrow('TypstCompile has no MmlFactory');
  });

  it('recovers after a parser error without leaking state to the next expression', () => {
    const result = compiler();
    expect(serialize(result.compile('x /', true))).toContain('<merror>');
    const root = result.compile('x');
    expect(root.attributes.get('display')).toBe('inline');
    expect(serialize(root)).toContain('<mi>x</mi>');
    expect(serialize(root)).not.toContain('<merror>');
  });
});
