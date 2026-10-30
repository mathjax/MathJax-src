import { describe, expect, it } from '@jest/globals';
import { parseAst } from '@r4ai/typst-ast-node';
import {
  astToMathML,
  escapeXml,
  nodeToMathML,
  TypstNode,
  UnsupportedTypstNodeError,
} from '#js/input/typst/ASTToMathML.js';

const x: TypstNode = { kind: 'mathIdent', name: 'x' };
const two: TypstNode = { kind: 'int', value: 2 };
const call = (name: string, ...args: TypstNode[]): TypstNode => ({
  kind: 'funcCall',
  callee: { kind: 'mathIdent', name },
  args: args.map((expr) => ({ kind: 'pos', expr })),
});

describe('Typst AST to MathML', () => {
  it('escapes all XML metacharacters without double-escaping replacements', () => {
    expect(escapeXml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&apos;');
    expect(escapeXml(12)).toBe('12');
  });

  it('wraps single roots, arrays, and empty input in a MathML document', () => {
    expect(astToMathML(x)).toBe(
      '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>'
    );
    expect(astToMathML([x, two], { display: true })).toBe(
      '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mn>2</mn></mrow></math>'
    );
    expect(astToMathML([])).toBe(
      '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow></mrow></math>'
    );
    expect(nodeToMathML(null)).toBe('<mrow></mrow>');
  });

  it.each<[TypstNode, string]>([
    [
      { kind: 'mathText', text: { kind: 'number', value: '12.5' } },
      '<mn>12.5</mn>',
    ],
    [
      { kind: 'mathText', text: { kind: 'character', value: 'x' } },
      '<mi>x</mi>',
    ],
    [{ kind: 'mathShorthand', character: '≤' }, '<mo>≤</mo>'],
    [{ kind: 'mathIdent', name: 'alpha' }, '<mi>α</mi>'],
    [{ kind: 'ident', name: 'sin' }, '<mi mathvariant="normal">sin</mi>'],
    [
      { kind: 'mathIdent', name: 'sum' },
      '<mo largeop="true" movablelimits="true">∑</mo>',
    ],
    [{ kind: 'mathIdent', name: 'integral' }, '<mo largeop="true">∫</mo>'],
    [
      {
        kind: 'fieldAccess',
        target: {
          kind: 'fieldAccess',
          target: { kind: 'mathIdent', name: 'arrow' },
          field: 'r',
        },
        field: 'double',
      },
      '<mo>⇒</mo>',
    ],
    [{ kind: 'str', value: '<&' }, '<mtext>&lt;&amp;</mtext>'],
    [{ kind: 'float', value: 1.5 }, '<mn>1.5</mn>'],
    [
      { kind: 'numeric', value: 3, unit: 'cm' },
      '<mrow><mn>3</mn><mi mathvariant="normal">cm</mi></mrow>',
    ],
    [
      { kind: 'mathFrac', num: x, denom: two },
      '<mfrac><mi>x</mi><mn>2</mn></mfrac>',
    ],
    [{ kind: 'mathRoot', radicand: x }, '<msqrt><mi>x</mi></msqrt>'],
    [
      { kind: 'mathRoot', radicand: x, index: 3 },
      '<mroot><mi>x</mi><mn>3</mn></mroot>',
    ],
    [{ kind: 'mathPrimes', count: 2 }, '<mo>′′</mo>'],
    [{ kind: 'mathAttach', base: x }, '<mi>x</mi>'],
    [
      { kind: 'mathAttach', base: x, bottom: two },
      '<msub><mi>x</mi><mn>2</mn></msub>',
    ],
    [
      { kind: 'mathAttach', base: x, top: two },
      '<msup><mi>x</mi><mn>2</mn></msup>',
    ],
    [
      { kind: 'mathAttach', base: x, bottom: two, top: two },
      '<msubsup><mi>x</mi><mn>2</mn><mn>2</mn></msubsup>',
    ],
    [
      { kind: 'mathAttach', base: x, top: two, primes: 2 },
      '<msup><mi>x</mi><mrow><mn>2</mn><mo>′′</mo></mrow></msup>',
    ],
    [
      { kind: 'unary', op: 'neg', expr: x },
      '<mrow><mo>−</mo><mi>x</mi></mrow>',
    ],
    [
      { kind: 'binary', op: 'lt', lhs: x, rhs: two },
      '<mrow><mi>x</mi><mo>&lt;</mo><mn>2</mn></mrow>',
    ],
  ])('converts %j', (node, expected) => {
    expect(nodeToMathML(node)).toBe(expected);
  });

  it.each(['math', 'contentBlock'])(
    'omits alignment points and whitespace in %s',
    (kind) => {
      expect(
        nodeToMathML({
          kind,
          body: [{ kind: 'space' }, x, { kind: 'mathAlignPoint' }],
        })
      ).toBe('<mi>x</mi>');
    }
  );

  it.each<[string, TypstNode[], string]>([
    ['sqrt', [x], '<msqrt><mi>x</mi></msqrt>'],
    ['root', [two, x], '<mroot><mi>x</mi><mn>2</mn></mroot>'],
    ['frac', [x, two], '<mfrac><mi>x</mi><mn>2</mn></mfrac>'],
    ['text', [{ kind: 'str', value: '<&' }], '<mtext>&lt;&amp;</mtext>'],
    [
      'text',
      [
        {
          kind: 'contentBlock',
          body: [
            { kind: 'mathText', text: { value: '<' } },
            { kind: 'str', value: '&' },
          ],
        },
      ],
      '<mtext>&lt;&amp;</mtext>',
    ],
    [
      'op',
      [{ kind: 'str', value: 'rank' }],
      '<mi mathvariant="normal">rank</mi>',
    ],
    [
      'vec',
      [x],
      '<mover accent="true"><mi>x</mi><mo stretchy="true" accent="true">→</mo></mover>',
    ],
    [
      'overline',
      [x],
      '<mover accent="true"><mi>x</mi><mo stretchy="true" accent="true">¯</mo></mover>',
    ],
    [
      'underline',
      [x],
      '<munder accentunder="true"><mi>x</mi><mo stretchy="true" accentunder="true">_</mo></munder>',
    ],
  ])('converts %s calls', (name, args, expected) => {
    expect(nodeToMathML(call(name, ...args))).toBe(expected);
  });

  it.each([
    ['abs', '|', '|'],
    ['norm', '‖', '‖'],
    ['floor', '⌊', '⌋'],
    ['ceil', '⌈', '⌉'],
  ])('uses stretchy fences for %s', (name, open, close) => {
    expect(nodeToMathML(call(name, x))).toBe(
      `<mrow><mo fence="true" stretchy="true">${open}</mo><mi>x</mi><mo fence="true" stretchy="true">${close}</mo></mrow>`
    );
  });

  it('retains unknown function names and comma-separated arguments', () => {
    expect(nodeToMathML(call('foo', x, two))).toBe(
      '<mrow><mi mathvariant="normal">foo</mi><mrow><mo fence="true" stretchy="true">(</mo><mrow><mi>x</mi><mo>,</mo><mn>2</mn></mrow><mo fence="true" stretchy="true">)</mo></mrow></mrow>'
    );
  });

  it('reports unsupported nodes and propagates the selected policy to children', () => {
    const root = { kind: 'math', body: [x, { kind: '<unknown>' }] };
    expect(() => astToMathML(root)).toThrow(UnsupportedTypstNodeError);
    expect(() => astToMathML(root, { unsupported: 'throw' })).toThrow(
      'Unsupported Typst AST node: <unknown>'
    );
    expect(nodeToMathML(root, { unsupported: 'merror' })).toBe(
      '<mrow><mi>x</mi><merror><mtext>Unsupported Typst node: &lt;unknown&gt;</mtext></merror></mrow>'
    );
    const error = new UnsupportedTypstNodeError('unknown');
    expect(error.name).toBe('UnsupportedTypstNodeError');
    expect(error.kind).toBe('unknown');
  });

  // Use the actual parser here so AST schema changes cannot silently break the adapter.
  it.each([
    'alpha + beta <= arrow.r.double',
    'x_1^2',
    "f''",
    'a/b',
    'sqrt(x)',
    'root(3, x)',
    'binom(n, k)',
    'abs(x)',
    'norm(x)',
    'floor(x)',
    'ceil(x)',
    'vec(x)',
    'overline(x)',
    'underline(x)',
    '(x + 1)',
    'mat(1, 2; 3, 4)',
    'mat(delim: "[", 1, 2; 3, 4)',
    'mat(delim: "{", 1, 2)',
    'mat(delim: none, 1; 2)',
    'cases(x, x > 0; 0, "otherwise")',
    'text("a<&")',
    'op("rank")(A)',
  ])('converts parsed source: %s', (source) => {
    const parsed = parseAst(source, { mode: 'math' });
    expect(parsed.errors).toEqual([]);
    expect(astToMathML(parsed.root)).toMatchSnapshot();
  });
});
