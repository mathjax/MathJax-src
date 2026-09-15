const XMLNS = 'http://www.w3.org/1998/Math/MathML';

export type TypstNode = {
  kind: string;
  [key: string]: any;
};

export type MathMLOptions = {
  display?: boolean;
  unsupported?: 'merror' | 'throw';
};

type XMLValue = string | number | boolean | null | undefined;
type XMLAttributes = Record<string, XMLValue>;
type NamedArgs = Record<string, TypstNode>;

export class UnsupportedTypstNodeError extends Error {

  public kind: string;

  constructor(kind: string) {
    super(`Unsupported Typst AST node: ${kind}`);
    this.name = 'UnsupportedTypstNodeError';
    this.kind = kind;
  }

}

/**
 *
 * @param value
 */
export function escapeXml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const NAMED_SYMBOLS = new Map<string, string>(Object.entries({
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ',
  sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε', Zeta: 'Ζ', Eta: 'Η', Theta: 'Θ',
  Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ', Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο', Pi: 'Π', Rho: 'Ρ',
  Sigma: 'Σ', Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ', Psi: 'Ψ', Omega: 'Ω',
  oo: '∞', infinity: '∞', partial: '∂', nabla: '∇',
  sum: '∑', product: '∏', prod: '∏', integral: '∫', integral2: '∬', integral3: '∭',
  union: '∪', inter: '∩', emptyset: '∅', in: '∈', 'not.in': '∉', subset: '⊂', subseteq: '⊆',
  superset: '⊃', superseteq: '⊇', forall: '∀', exists: '∃',
  plusminus: '±', minusplus: '∓', times: '×', divide: '÷', dot: '⋅', cdot: '⋅',
  approx: '≈', equiv: '≡', neq: '≠', lt: '<', gt: '>', leq: '≤', geq: '≥',
  'arrow.r': '→', 'arrow.l': '←', 'arrow.l.r': '↔', 'arrow.r.double': '⇒', 'arrow.l.double': '⇐',
  'arrow.l.r.double': '⇔', 'arrow.r.long': '⟶', 'arrow.l.long': '⟵', 'arrow.l.r.long': '⟷',
  'dots.h': '…', 'dots.v': '⋮', 'dots.down': '⋱', 'dots.up': '⋰',
  degree: '°', prime: '′', doubleprime: '″',
  NN: 'ℕ', ZZ: 'ℤ', QQ: 'ℚ', RR: 'ℝ', CC: 'ℂ',
}));

const NORMAL_WORDS = new Set<string>([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'sinh', 'cosh', 'tanh',
  'log', 'ln', 'exp', 'lim', 'min', 'max', 'arg', 'det', 'gcd', 'lcm', 'mod',
]);

const OPERATOR_CHARS = new Set<string>(Array.from(
  '+−-±∓×÷⋅*/=≠≈≡<≤>≥∈∉⊂⊆⊃⊇∪∩∧∨¬→←↔⇒⇐⇔⟶⟵⟷∑∏∫∬∭∀∃∂∇∞:,;!'
));

const FENCE_CHARS = new Set<string>([
  '(', ')', '[', ']', '{', '}', '⟨', '⟩', '|', '‖',
]);

const LARGE_OPERATORS = new Set<string>(['∑', '∏', '∫', '∬', '∭']);
const MOVABLE_LIMITS = new Set<string>(['∑', '∏']);

/**
 *
 * @param tag
 * @param body
 * @param attrs
 */
function xml(
  tag: string,
  body: string = '',
  attrs: XMLAttributes = {}
): string {
  const rendered = Object.entries(attrs)
    .filter(([, value]) =>
      value !== undefined && value !== null && value !== false
    )
    .map(([key, value]) =>
      ` ${key}="${escapeXml(value === true ? 'true' : value)}"`
    )
    .join('');

  return `<${tag}${rendered}>${body}</${tag}>`;
}

/**
 *
 * @param children
 */
function mrow(children: string[]): string {
  const content = children.filter(Boolean).join('');
  return xml('mrow', content);
}

/**
 *
 * @param parts
 */
function unwrapSingle(parts: string[]): string {
  const filtered = parts.filter(Boolean);
  return filtered.length === 1 ? filtered[0] : mrow(filtered);
}

/**
 *
 * @param value
 * @param attrs
 */
function mo(value: string, attrs: XMLAttributes = {}): string {
  const extra: XMLAttributes = LARGE_OPERATORS.has(value)
    ? {
      largeop: 'true',
      ...(MOVABLE_LIMITS.has(value) ? {movablelimits: 'true'} : {}),
      ...attrs,
    }
    : attrs;

  return xml('mo', escapeXml(value), extra);
}

/**
 *
 * @param value
 * @param attrs
 */
function mi(value: unknown, attrs: XMLAttributes = {}): string {
  return xml('mi', escapeXml(value), attrs);
}

/**
 *
 * @param value
 */
function mn(value: unknown): string {
  return xml('mn', escapeXml(value));
}

/**
 *
 * @param value
 */
function mtext(value: unknown): string {
  return xml('mtext', escapeXml(value));
}

/**
 *
 * @param value
 */
function classifyCharacter(value: string): string {
  if (FENCE_CHARS.has(value)) {
    return mo(value, {fence: 'true', stretchy: 'true'});
  }
  if (OPERATOR_CHARS.has(value)) {
    return mo(value);
  }
  if (/^[0-9]+(?:\.[0-9]+)?$/.test(value)) {
    return mn(value);
  }
  return mi(value);
}

/**
 *
 * @param node
 */
function resolveName(node: TypstNode | null | undefined): string | null {
  if (!node) {
    return null;
  }

  if (node.kind === 'mathIdent' || node.kind === 'ident') {
    return String(node.name);
  }

  if (node.kind === 'fieldAccess') {
    const target = resolveName(node.target as TypstNode);
    return target ? `${target}.${String(node.field)}` : null;
  }

  return null;
}

/**
 *
 * @param name
 */
function renderNamedIdentifier(name: string): string {
  const symbol = NAMED_SYMBOLS.get(name);

  if (symbol) {
    return classifyCharacter(symbol);
  }

  if (NORMAL_WORDS.has(name)) {
    return mi(name, {mathvariant: 'normal'});
  }

  return mi(name);
}

/**
 *
 * @param node
 */
function positionalArgs(node: TypstNode): TypstNode[] {
  return (node.args || [])
    .filter((arg: TypstNode) => arg.kind === 'pos')
    .map((arg: TypstNode) => arg.expr as TypstNode);
}

/**
 *
 * @param node
 */
function namedArgs(node: TypstNode): NamedArgs {
  return Object.fromEntries(
    (node.args || [])
      .filter((arg: TypstNode) => arg.kind === 'named')
      .map((arg: TypstNode) =>
        [String(arg.name), arg.expr as TypstNode]
      )
  ) as NamedArgs;
}

/**
 *
 * @param open
 * @param content
 * @param close
 */
function renderFence(
  open: string,
  content: string,
  close: string
): string {
  return mrow([
    mo(open, {fence: 'true', stretchy: 'true'}),
    content,
    mo(close, {fence: 'true', stretchy: 'true'}),
  ]);
}

/**
 *
 * @param args
 * @param options
 */
function renderMatrixRows(
  args: TypstNode[],
  options: MathMLOptions
): string {
  const rows: string[] = [];

  for (const expr of args) {
    if (expr?.kind === 'array') {
      const cells = (expr.items || [])
        .filter((item: TypstNode) => item.kind === 'pos')
        .map((item: TypstNode) =>
          xml('mtd', nodeToMathML(item.expr as TypstNode, options))
        );

      rows.push(xml('mtr', cells.join('')));
    } else {
      rows.push(xml('mtr', xml('mtd', nodeToMathML(expr, options))));
    }
  }

  return xml('mtable', rows.join(''));
}

/**
 *
 * @param node
 * @param options
 */
function renderFunctionCall(
  node: TypstNode,
  options: MathMLOptions
): string {
  const name = resolveName(node.callee as TypstNode);
  const args = positionalArgs(node);
  const named = namedArgs(node);

  if (!name) {
    throw new UnsupportedTypstNodeError('funcCall(callee)');
  }

  if (name === 'sqrt' && args.length >= 1) {
    return xml('msqrt', nodeToMathML(args[0], options));
  }

  if (name === 'root' && args.length >= 2) {
    return xml(
      'mroot',
      nodeToMathML(args[1], options) +
      nodeToMathML(args[0], options)
    );
  }

  if (name === 'frac' && args.length >= 2) {
    return xml(
      'mfrac',
      nodeToMathML(args[0], options) +
      nodeToMathML(args[1], options)
    );
  }

  if (name === 'binom' && args.length >= 2) {
    const frac = xml(
      'mfrac',
      nodeToMathML(args[0], options) +
      nodeToMathML(args[1], options),
      {linethickness: '0'}
    );
    return renderFence('(', frac, ')');
  }

  if (name === 'abs' && args.length >= 1) {
    return renderFence('|', nodeToMathML(args[0], options), '|');
  }

  if (name === 'norm' && args.length >= 1) {
    return renderFence('‖', nodeToMathML(args[0], options), '‖');
  }

  if (name === 'floor' && args.length >= 1) {
    return renderFence('⌊', nodeToMathML(args[0], options), '⌋');
  }

  if (name === 'ceil' && args.length >= 1) {
    return renderFence('⌈', nodeToMathML(args[0], options), '⌉');
  }

  if (name === 'text' && args.length >= 1) {
    const arg = args[0];
    if (arg.kind === 'str') {
      return mtext(arg.value);
    }
    return mtext(nodeToPlainText(arg));
  }

  if (name === 'op' && args.length >= 1) {
    const arg = args[0];
    const label = arg.kind === 'str'
      ? String(arg.value)
      : nodeToPlainText(arg);

    return mi(label, {mathvariant: 'normal'});
  }

  if (name === 'vec' && args.length >= 1) {
    return xml(
      'mover',
      nodeToMathML(args[0], options) +
      mo('→', {stretchy: 'true', accent: 'true'}),
      {accent: 'true'}
    );
  }

  if (name === 'overline' && args.length >= 1) {
    return xml(
      'mover',
      nodeToMathML(args[0], options) +
      mo('¯', {stretchy: 'true', accent: 'true'}),
      {accent: 'true'}
    );
  }

  if (name === 'underline' && args.length >= 1) {
    return xml(
      'munder',
      nodeToMathML(args[0], options) +
      mo('_', {stretchy: 'true', accentunder: 'true'}),
      {accentunder: 'true'}
    );
  }

  if (name === 'mat') {
    const table = renderMatrixRows(args, options);
    const delimiter = named.delim
      ? nodeToPlainText(named.delim)
      : '(';

    if (delimiter === 'none') {
      return table;
    }

    const [open, close]: [string, string] =
      delimiter === '[' ? ['[', ']'] :
      delimiter === '{' ? ['{', '}'] :
      ['(', ')'];

    return renderFence(open, table, close);
  }

  if (name === 'cases') {
    return mrow([
      mo('{', {fence: 'true', stretchy: 'true'}),
      renderMatrixRows(args, options),
    ]);
  }

  // Unknown function calls are represented semantically instead of discarded.
  // This keeps output readable while making it obvious that full Typst
  // evaluation has not happened.
  const renderedArgs = args.map(
    (arg: TypstNode) => nodeToMathML(arg, options)
  );

  return mrow([
    mi(name, {mathvariant: 'normal'}),
    renderFence(
      '(',
      mrow(
        renderedArgs.flatMap(
          (part: string, i: number) =>
            i ? [mo(','), part] : [part]
        )
      ),
      ')'
    ),
  ]);
}

/**
 *
 * @param node
 */
function nodeToPlainText(node: TypstNode | null | undefined): string {
  if (!node) {
    return '';
  }

  switch (node.kind) {
    case 'str':
      return String(node.value ?? '');

    case 'mathIdent':
    case 'ident':
      return String(node.name ?? '');

    case 'mathText':
      return String(node.text?.value ?? '');

    case 'mathShorthand':
      return String(node.character ?? '');

    case 'int':
    case 'float':
      return String(node.value ?? '');

    case 'contentBlock':
    case 'math':
      return (node.body || [])
        .map((child: TypstNode) => nodeToPlainText(child))
        .join('');

    default:
      return String(resolveName(node) ?? node.kind ?? '');
  }
}

/**
 *
 * @param node
 * @param options
 */
export function nodeToMathML(
  node: TypstNode | null | undefined,
  options: MathMLOptions = {}
): string {
  if (!node) {
    return mrow([]);
  }

  switch (node.kind) {
    case 'math':
    case 'contentBlock':
      return unwrapSingle(
        (node.body || []).map(
          (child: TypstNode) => nodeToMathML(child, options)
        )
      );

    case 'mathText': {
      const value = String(node.text?.value ?? '');
      return node.text?.kind === 'number'
        ? mn(value)
        : classifyCharacter(value);
    }

    case 'mathIdent':
    case 'ident':
      return renderNamedIdentifier(String(node.name));

    case 'fieldAccess': {
      const name = resolveName(node);
      return name
        ? renderNamedIdentifier(name)
        : mi(node.field);
    }

    case 'mathShorthand':
      return classifyCharacter(String(node.character));

    case 'space':
    case 'mathAlignPoint':
      return '';

    case 'mathDelimited': {
      const open = nodeToPlainText(node.open as TypstNode);
      const close = nodeToPlainText(node.close as TypstNode);
      const body = unwrapSingle(
        (node.body || []).map(
          (child: TypstNode) => nodeToMathML(child, options)
        )
      );

      return renderFence(open, body, close);
    }

    case 'mathAttach': {
      const base: string = nodeToMathML(
        node.base as TypstNode,
        options
      );

      const bottom: string | null = node.bottom
        ? nodeToMathML(node.bottom as TypstNode, options)
        : null;

      let top: string | null = node.top
        ? nodeToMathML(node.top as TypstNode, options)
        : null;

      if (node.primes) {
        const primes = mo('′'.repeat(Number(node.primes)));
        top = top ? mrow([top, primes]) : primes;
      }

      if (bottom && top) {
        return xml('msubsup', base + bottom + top);
      }
      if (bottom) {
        return xml('msub', base + bottom);
      }
      if (top) {
        return xml('msup', base + top);
      }

      return base;
    }

    case 'mathPrimes':
      return mo('′'.repeat(Number(node.count || 1)));

    case 'mathFrac':
      return xml(
        'mfrac',
        nodeToMathML(node.num as TypstNode, options) +
        nodeToMathML(node.denom as TypstNode, options)
      );

    case 'mathRoot': {
      const radicand: string = nodeToMathML(
        node.radicand as TypstNode,
        options
      );

      return node.index == null
        ? xml('msqrt', radicand)
        : xml('mroot', radicand + mn(node.index));
    }

    case 'str':
      return mtext(node.value);

    case 'int':
    case 'float':
      return mn(node.value);

    case 'numeric':
      return mrow([
        mn(node.value),
        mi(node.unit, {mathvariant: 'normal'}),
      ]);

    case 'parenthesized':
      return renderFence(
        '(',
        nodeToMathML(node.expr as TypstNode, options),
        ')'
      );

    case 'array': {
      const items = (node.items || [])
        .filter((item: TypstNode) => item.kind === 'pos')
        .map((item: TypstNode) =>
          nodeToMathML(item.expr as TypstNode, options)
        );

      const content = mrow(
        items.flatMap(
          (part: string, i: number) =>
            i ? [mo(','), part] : [part]
        )
      );

      return renderFence('(', content, ')');
    }

    case 'unary': {
      const unaryOps: Record<string, string> = {
        pos: '+',
        neg: '−',
        not: '¬',
      };

      const op = unaryOps[String(node.op)] ?? String(node.op);

      return mrow([
        mo(op),
        nodeToMathML(node.expr as TypstNode, options),
      ]);
    }

    case 'binary': {
      const binaryOps: Record<string, string> = {
        add: '+',
        sub: '−',
        mul: '×',
        div: '/',
        and: '∧',
        or: '∨',
        eq: '=',
        neq: '≠',
        lt: '<',
        leq: '≤',
        gt: '>',
        geq: '≥',
        assign: ':=',
        in: '∈',
        notIn: '∉',
        addAssign: '+=',
        subAssign: '−=',
        mulAssign: '×=',
        divAssign: '/=',
      };

      const op = binaryOps[String(node.op)] ?? String(node.op);

      return mrow([
        nodeToMathML(node.lhs as TypstNode, options),
        mo(op),
        nodeToMathML(node.rhs as TypstNode, options),
      ]);
    }

    case 'funcCall':
      return renderFunctionCall(node, options);

    default:
      if (options.unsupported === 'merror') {
        return xml(
          'merror',
          mtext(`Unsupported Typst node: ${node.kind}`)
        );
      }

      throw new UnsupportedTypstNodeError(node.kind);
  }
}

/**
 *
 * @param root
 * @param options
 */
export function astToMathML(
  root: unknown,
  options: MathMLOptions = {}
): string {
  const nodes = (
    Array.isArray(root) ? root : [root]
  ) as TypstNode[];

  const body = unwrapSingle(
    nodes.map(
      (node: TypstNode) => nodeToMathML(node, options)
    )
  );

  const display = options.display ? ' display="block"' : '';

  return `<math xmlns="${XMLNS}"${display}>${body}</math>`;
}
