/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


/**
 * @fileoverview Base mappings for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {RegExpMap, CharacterMap, MacroMap, CommandMap, EnvironmentMap} from './symbol_map.js';
import {TexConstant} from './tex_constants.js';
import {BaseMethods} from './base_methods.js';


export namespace BaseMappings {

  // TODO: Thes parsing methods are currently overwritten in the legacy code.
  RegExpMap.create('letter', BaseMethods.variable, /[a-z]/i);

  RegExpMap.create('digit', BaseMethods.digit, /[0-9.]/);

  // Currently not in use!
  RegExpMap.create('number', BaseMethods.num,
                /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/);

  RegExpMap.create('command', BaseMethods.controlSequence, /^\\/);  //


  MacroMap.create('special', {

    // This is now handled with a RegExp!
    // '\\':  'ControlSequence',

    '{':   'Open',
    '}':   'Close',
    '~':   'Tilde',
    '^':   'Superscript',
    '_':   'Subscript',
    ' ':   'Space',
    '\t':  'Space',
    '\r':  'Space',
    '\n':  'Space',
    '\'':  'Prime',
    '%':   'Comment',
    '&':   'Entry',
    '#':   'Hash',
    '\u00A0': 'Space',
    '\u2019': 'Prime'
  });

  CharacterMap.create('remap', null, {
    '-':   '2212',
    '*':   '2217',
    '`':   '2018'   // map ` to back quote
  });

  CharacterMap.create('mathchar0mi', null, {
    // Lower-case greek
    alpha:        '03B1',
    beta:         '03B2',
    gamma:        '03B3',
    delta:        '03B4',
    epsilon:      '03F5',
    zeta:         '03B6',
    eta:          '03B7',
    theta:        '03B8',
    iota:         '03B9',
    kappa:        '03BA',
    lambda:       '03BB',
    mu:           '03BC',
    nu:           '03BD',
    xi:           '03BE',
    omicron:      '03BF', // added for completeness
    pi:           '03C0',
    rho:          '03C1',
    sigma:        '03C3',
    tau:          '03C4',
    upsilon:      '03C5',
    phi:          '03D5',
    chi:          '03C7',
    psi:          '03C8',
    omega:        '03C9',
    varepsilon:   '03B5',
    vartheta:     '03D1',
    varpi:        '03D6',
    varrho:       '03F1',
    varsigma:     '03C2',
    varphi:       '03C6',

    // Ord symbols
    S:            ['00A7', {mathvariant: TexConstant.Variant.NORMAL}],
    aleph:        ['2135', {mathvariant: TexConstant.Variant.NORMAL}],
    hbar:         ['210F', {variantForm: true}],
    imath:        '0131',
    jmath:        '0237',
    ell:          '2113',
    wp:           ['2118', {mathvariant: TexConstant.Variant.NORMAL}],
    Re:           ['211C', {mathvariant: TexConstant.Variant.NORMAL}],
    Im:           ['2111', {mathvariant: TexConstant.Variant.NORMAL}],
    partial:      ['2202', {mathvariant: TexConstant.Variant.NORMAL}],
    infty:        ['221E', {mathvariant: TexConstant.Variant.NORMAL}],
    prime:        ['2032', {mathvariant: TexConstant.Variant.NORMAL,
                            variantForm: true}],
    emptyset:     ['2205', {mathvariant: TexConstant.Variant.NORMAL}],
    nabla:        ['2207', {mathvariant: TexConstant.Variant.NORMAL}],
    top:          ['22A4', {mathvariant: TexConstant.Variant.NORMAL}],
    bot:          ['22A5', {mathvariant: TexConstant.Variant.NORMAL}],
    angle:        ['2220', {mathvariant: TexConstant.Variant.NORMAL}],
    triangle:     ['25B3', {mathvariant: TexConstant.Variant.NORMAL}],
    backslash:    ['2216', {mathvariant: TexConstant.Variant.NORMAL,
                            variantForm: true}],
    forall:       ['2200', {mathvariant: TexConstant.Variant.NORMAL}],
    exists:       ['2203', {mathvariant: TexConstant.Variant.NORMAL}],
    neg:          ['00AC', {mathvariant: TexConstant.Variant.NORMAL}],
    lnot:         ['00AC', {mathvariant: TexConstant.Variant.NORMAL}],
    flat:         ['266D', {mathvariant: TexConstant.Variant.NORMAL}],
    natural:      ['266E', {mathvariant: TexConstant.Variant.NORMAL}],
    sharp:        ['266F', {mathvariant: TexConstant.Variant.NORMAL}],
    clubsuit:     ['2663', {mathvariant: TexConstant.Variant.NORMAL}],
    diamondsuit:  ['2662', {mathvariant: TexConstant.Variant.NORMAL}],
    heartsuit:    ['2661', {mathvariant: TexConstant.Variant.NORMAL}],
    spadesuit:    ['2660', {mathvariant: TexConstant.Variant.NORMAL}]
  });

  CharacterMap.create('mathchar0mo', null, {
    surd:         '221A',

    // big ops
    coprod:       ['2210', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigvee:       ['22C1', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigwedge:     ['22C0', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    biguplus:     ['2A04', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigcap:       ['22C2', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigcup:       ['22C3', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    'int':        ['222B', {texClass: TexConstant.TexClass.OP}],
    intop:        ['222B', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true, movablelimits: true}],
    iint:         ['222C', {texClass: TexConstant.TexClass.OP}],
    iiint:        ['222D', {texClass: TexConstant.TexClass.OP}],
    prod:         ['220F', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    sum:          ['2211', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigotimes:    ['2A02', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigoplus:     ['2A01', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    bigodot:      ['2A00', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    oint:         ['222E', {texClass: TexConstant.TexClass.OP}],
    bigsqcup:     ['2A06', {texClass: TexConstant.TexClass.OP,
                            movesupsub: true}],
    smallint:     ['222B', {largeop: false}],

    // binary operations
    triangleleft:      '25C3',
    triangleright:     '25B9',
    bigtriangleup:     '25B3',
    bigtriangledown:   '25BD',
    wedge:        '2227',
    land:         '2227',
    vee:          '2228',
    lor:          '2228',
    cap:          '2229',
    cup:          '222A',
    ddagger:      '2021',
    dagger:       '2020',
    sqcap:        '2293',
    sqcup:        '2294',
    uplus:        '228E',
    amalg:        '2A3F',
    diamond:      '22C4',
    bullet:       '2219',
    wr:           '2240',
    div:          '00F7',
    odot:         ['2299', {largeop: false}],
    oslash:       ['2298', {largeop: false}],
    otimes:       ['2297', {largeop: false}],
    ominus:       ['2296', {largeop: false}],
    oplus:        ['2295', {largeop: false}],
    mp:           '2213',
    pm:           '00B1',
    circ:         '2218',
    bigcirc:      '25EF',
    setminus:     ['2216', {variantForm: true}],
    cdot:         '22C5',
    ast:          '2217',
    times:        '00D7',
    star:         '22C6',

    // Relations
    propto:       '221D',
    sqsubseteq:   '2291',
    sqsupseteq:   '2292',
    parallel:     '2225',
    mid:          '2223',
    dashv:        '22A3',
    vdash:        '22A2',
    leq:          '2264',
    le:           '2264',
    geq:          '2265',
    ge:           '2265',
    lt:           '003C',
    gt:           '003E',
    succ:         '227B',
    prec:         '227A',
    approx:       '2248',
    succeq:       '2AB0',  // or '227C',
    preceq:       '2AAF',  // or '227D',
    supset:       '2283',
    subset:       '2282',
    supseteq:     '2287',
    subseteq:     '2286',
    'in':         '2208',
    ni:           '220B',
    notin:        '2209',
    owns:         '220B',
    gg:           '226B',
    ll:           '226A',
    sim:          '223C',
    simeq:        '2243',
    perp:         '22A5',
    equiv:        '2261',
    asymp:        '224D',
    smile:        '2323',
    frown:        '2322',
    ne:           '2260',
    neq:          '2260',
    cong:         '2245',
    doteq:        '2250',
    bowtie:       '22C8',
    models:       '22A8',

    notChar:      '29F8',


    // Arrows
    Leftrightarrow:     '21D4',
    Leftarrow:          '21D0',
    Rightarrow:         '21D2',
    leftrightarrow:     '2194',
    leftarrow:          '2190',
    gets:               '2190',
    rightarrow:         '2192',
    to:                 '2192',
    mapsto:             '21A6',
    leftharpoonup:      '21BC',
    leftharpoondown:    '21BD',
    rightharpoonup:     '21C0',
    rightharpoondown:   '21C1',
    nearrow:            '2197',
    searrow:            '2198',
    nwarrow:            '2196',
    swarrow:            '2199',
    rightleftharpoons:  '21CC',
    hookrightarrow:     '21AA',
    hookleftarrow:      '21A9',
    longleftarrow:      '27F5',
    Longleftarrow:      '27F8',
    longrightarrow:     '27F6',
    Longrightarrow:     '27F9',
    Longleftrightarrow: '27FA',
    longleftrightarrow: '27F7',
    longmapsto:         '27FC',


    // Misc.
    ldots:            '2026',
    cdots:            '22EF',
    vdots:            '22EE',
    ddots:            '22F1',
    dotsc:            '2026',  // dots with commas
    dotsb:            '22EF',  // dots with binary ops and relations
    dotsm:            '22EF',  // dots with multiplication
    dotsi:            '22EF',  // dots with integrals
    dotso:            '2026',  // other dots

    ldotp:            ['002E', {texClass: TexConstant.TexClass.PUNCT}],
    cdotp:            ['22C5', {texClass: TexConstant.TexClass.PUNCT}],
    colon:            ['003A', {texClass: TexConstant.TexClass.PUNCT}]
  });

  CharacterMap.create('mathchar7', null, {
    Gamma:        '0393',
    Delta:        '0394',
    Theta:        '0398',
    Lambda:       '039B',
    Xi:           '039E',
    Pi:           '03A0',
    Sigma:        '03A3',
    Upsilon:      '03A5',
    Phi:          '03A6',
    Psi:          '03A8',
    Omega:        '03A9',

    '_':          '005F',
    '#':          '0023',
    '$':          '0024',
    '%':          '0025',
    '&':          '0026',
    And:          '0026'
  });

  CharacterMap.create('delimiter', null, {
    '(':                '(',
    ')':                ')',
    '[':                '[',
    ']':                ']',
    '<':                '27E8',
    '>':                '27E9',
    '\\lt':             '27E8',
    '\\gt':             '27E9',
    '/':                '/',
    '|':                ['|', {texClass: TexConstant.TexClass.ORD}],
    '.':                '',
    '\\\\':             '\\',
    '\\lmoustache':     '23B0',  // non-standard
    '\\rmoustache':     '23B1',  // non-standard
    '\\lgroup':         '27EE',  // non-standard
    '\\rgroup':         '27EF',  // non-standard
    '\\arrowvert':      '23D0',
    '\\Arrowvert':      '2016',
    '\\bracevert':      '23AA',  // non-standard
    '\\Vert':           ['2225', {texClass: TexConstant.TexClass.ORD}],
    '\\|':              ['2225', {texClass: TexConstant.TexClass.ORD}],
    '\\vert':           ['|', {texClass: TexConstant.TexClass.ORD}],
    '\\uparrow':        '2191',
    '\\downarrow':      '2193',
    '\\updownarrow':    '2195',
    '\\Uparrow':        '21D1',
    '\\Downarrow':      '21D3',
    '\\Updownarrow':    '21D5',
    '\\backslash':      '\\',
    '\\rangle':         '27E9',
    '\\langle':         '27E8',
    '\\rbrace':         '}',
    '\\lbrace':         '{',
    '\\}':              '}',
    '\\{':              '{',
    '\\rceil':          '2309',
    '\\lceil':          '2308',
    '\\rfloor':         '230B',
    '\\lfloor':         '230A',
    '\\lbrack':         '[',
    '\\rbrack':         ']'
  });

  CommandMap.create('macros', {
    displaystyle:      ['SetStyle', 'D', true, 0],
    textstyle:         ['SetStyle', 'T', false, 0],
    scriptstyle:       ['SetStyle', 'S', false, 1],
    scriptscriptstyle: ['SetStyle', 'SS', false, 2],

    rm:                ['SetFont', TexConstant.Variant.NORMAL],
    mit:               ['SetFont', TexConstant.Variant.ITALIC],
    oldstyle:          ['SetFont', TexConstant.Variant.OLDSTYLE],
    cal:               ['SetFont', TexConstant.Variant.CALIGRAPHIC],
    it:                ['SetFont', '-tex-mathit'], // needs special handling
    bf:                ['SetFont', TexConstant.Variant.BOLD],
    bbFont:            ['SetFont', TexConstant.Variant.DOUBLESTRUCK],
    scr:               ['SetFont', TexConstant.Variant.SCRIPT],
    frak:              ['SetFont', TexConstant.Variant.FRAKTUR],
    sf:                ['SetFont', TexConstant.Variant.SANSSERIF],
    tt:                ['SetFont', TexConstant.Variant.MONOSPACE],

    //      font:

    tiny:              ['SetSize', 0.5],
    Tiny:              ['SetSize', 0.6],  // non-standard
    scriptsize:        ['SetSize', 0.7],
    small:             ['SetSize', 0.85],
    normalsize:        ['SetSize', 1.0],
    large:             ['SetSize', 1.2],
    Large:             ['SetSize', 1.44],
    LARGE:             ['SetSize', 1.73],
    huge:              ['SetSize', 2.07],
    Huge:              ['SetSize', 2.49],

    arcsin:            ['NamedFn'],
    arccos:            ['NamedFn'],
    arctan:            ['NamedFn'],
    arg:               ['NamedFn'],
    cos:               ['NamedFn'],
    cosh:              ['NamedFn'],
    cot:               ['NamedFn'],
    coth:              ['NamedFn'],
    csc:               ['NamedFn'],
    deg:               ['NamedFn'],
    det:                'NamedOp',
    dim:               ['NamedFn'],
    exp:               ['NamedFn'],
    gcd:                'NamedOp',
    hom:               ['NamedFn'],
    inf:                'NamedOp',
    ker:               ['NamedFn'],
    lg:                ['NamedFn'],
    lim:                'NamedOp',
    liminf:            ['NamedOp', 'lim&thinsp;inf'],
    limsup:            ['NamedOp', 'lim&thinsp;sup'],
    ln:                ['NamedFn'],
    log:               ['NamedFn'],
    max:                'NamedOp',
    min:                'NamedOp',
    Pr:                 'NamedOp',
    sec:               ['NamedFn'],
    sin:               ['NamedFn'],
    sinh:              ['NamedFn'],
    sup:                'NamedOp',
    tan:               ['NamedFn'],
    tanh:              ['NamedFn'],

    limits:            ['Limits', 1],
    nolimits:          ['Limits', 0],

    overline:            ['UnderOver', '00AF', null, 1],
    underline:           ['UnderOver', '005F'],
    overbrace:           ['UnderOver', '23DE', 1],
    underbrace:          ['UnderOver', '23DF', 1],
    overparen:           ['UnderOver', '23DC'],
    underparen:          ['UnderOver', '23DD'],
    overrightarrow:      ['UnderOver', '2192'],
    underrightarrow:     ['UnderOver', '2192'],
    overleftarrow:       ['UnderOver', '2190'],
    underleftarrow:      ['UnderOver', '2190'],
    overleftrightarrow:  ['UnderOver', '2194'],
    underleftrightarrow: ['UnderOver', '2194'],

    overset:            'Overset',
    underset:           'Underset',
    stackrel:           ['Macro', '\\mathrel{\\mathop{#2}\\limits^{#1}}', 2],

    over:               'Over',
    overwithdelims:     'Over',
    atop:               'Over',
    atopwithdelims:     'Over',
    above:              'Over',
    abovewithdelims:    'Over',
    brace:             ['Over', '{', '}'],
    brack:             ['Over', '[', ']'],
    choose:            ['Over', '(', ')'],

    frac:               'Frac',
    sqrt:               'Sqrt',
    root:               'Root',
    uproot:            ['MoveRoot', 'upRoot'],
    leftroot:          ['MoveRoot', 'leftRoot'],

    left:               'LeftRight',
    right:              'LeftRight',
    middle:             'Middle',

    llap:               'Lap',
    rlap:               'Lap',
    raise:              'RaiseLower',
    lower:              'RaiseLower',
    moveleft:           'MoveLeftRight',
    moveright:          'MoveLeftRight',

    ', ':              ['Spacer', TexConstant.Length.THINMATHSPACE],
    ':':               ['Spacer', TexConstant.Length.MEDIUMMATHSPACE],
    '>':               ['Spacer', TexConstant.Length.MEDIUMMATHSPACE],
    ';':               ['Spacer', TexConstant.Length.THICKMATHSPACE],
    '!':               ['Spacer', TexConstant.Length.NEGATIVETHINMATHSPACE],
    enspace:           ['Spacer', '.5em'],
    quad:              ['Spacer', '1em'],
    qquad:             ['Spacer', '2em'],
    thinspace:         ['Spacer', TexConstant.Length.THINMATHSPACE],
    negthinspace:      ['Spacer', TexConstant.Length.NEGATIVETHINMATHSPACE],

    hskip:              'Hskip',
    hspace:             'Hskip',
    kern:               'Hskip',
    mskip:              'Hskip',
    mspace:             'Hskip',
    mkern:              'Hskip',
    Rule:              ['Rule'],
    Space:             ['Rule', 'blank'],

    big:               ['MakeBig', TexConstant.TexClass.ORD, 0.85],
    Big:               ['MakeBig', TexConstant.TexClass.ORD, 1.15],
    bigg:              ['MakeBig', TexConstant.TexClass.ORD, 1.45],
    Bigg:              ['MakeBig', TexConstant.TexClass.ORD, 1.75],
    bigl:              ['MakeBig', TexConstant.TexClass.OPEN, 0.85],
    Bigl:              ['MakeBig', TexConstant.TexClass.OPEN, 1.15],
    biggl:             ['MakeBig', TexConstant.TexClass.OPEN, 1.45],
    Biggl:             ['MakeBig', TexConstant.TexClass.OPEN, 1.75],
    bigr:              ['MakeBig', TexConstant.TexClass.CLOSE, 0.85],
    Bigr:              ['MakeBig', TexConstant.TexClass.CLOSE, 1.15],
    biggr:             ['MakeBig', TexConstant.TexClass.CLOSE, 1.45],
    Biggr:             ['MakeBig', TexConstant.TexClass.CLOSE, 1.75],
    bigm:              ['MakeBig', TexConstant.TexClass.REL, 0.85],
    Bigm:              ['MakeBig', TexConstant.TexClass.REL, 1.15],
    biggm:             ['MakeBig', TexConstant.TexClass.REL, 1.45],
    Biggm:             ['MakeBig', TexConstant.TexClass.REL, 1.75],

    mathord:           ['TeXAtom', TexConstant.TexClass.ORD],
    mathop:            ['TeXAtom', TexConstant.TexClass.OP],
    mathopen:          ['TeXAtom', TexConstant.TexClass.OPEN],
    mathclose:         ['TeXAtom', TexConstant.TexClass.CLOSE],
    mathbin:           ['TeXAtom', TexConstant.TexClass.BIN],
    mathrel:           ['TeXAtom', TexConstant.TexClass.REL],
    mathpunct:         ['TeXAtom', TexConstant.TexClass.PUNCT],
    mathinner:         ['TeXAtom', TexConstant.TexClass.INNER],

    vcenter:           ['TeXAtom', TexConstant.TexClass.VCENTER],

    mathchoice:        ['Extension', 'mathchoice'],
    buildrel:           'BuildRel',

    hbox:               ['HBox', 0],
    text:               'HBox',
    mbox:               ['HBox', 0],
    fbox:               'FBox',

    strut:              'Strut',
    mathstrut:         ['Macro', '\\vphantom{(}'],
    phantom:            'Phantom',
    vphantom:          ['Phantom', 1, 0],
    hphantom:          ['Phantom', 0, 1],
    smash:              'Smash',

    acute:             ['Accent', '00B4'],  // or 0301 or 02CA
    grave:             ['Accent', '0060'],  // or 0300 or 02CB
    ddot:              ['Accent', '00A8'],  // or 0308
    tilde:             ['Accent', '007E'],  // or 0303 or 02DC
    bar:               ['Accent', '00AF'],  // or 0304 or 02C9
    breve:             ['Accent', '02D8'],  // or 0306
    check:             ['Accent', '02C7'],  // or 030C
    hat:               ['Accent', '005E'],  // or 0302 or 02C6
    vec:               ['Accent', '2192'],  // or 20D7
    dot:               ['Accent', '02D9'],  // or 0307
    widetilde:         ['Accent', '007E', 1], // or 0303 or 02DC
    widehat:           ['Accent', '005E', 1], // or 0302 or 02C6

    matrix:             'Matrix',
    array:              'Matrix',
    pmatrix:           ['Matrix', '(', ')'],
    cases:             ['Matrix', '{', '', 'left left', null, '.1em', null,
                        true],
    eqalign:           ['Matrix', null, null, 'right left',
                        TexConstant.Length.THICKMATHSPACE, '.5em', 'D'],
    displaylines:      ['Matrix', null, null, 'center', null, '.5em', 'D'],
    cr:                 'Cr',
    '\\':               'CrLaTeX',
    newline:            'Cr',
    hline:             ['HLine', 'solid'],
    hdashline:         ['HLine', 'dashed'],
    //      noalign:            'HandleNoAlign',
    eqalignno:         ['Matrix', null, null, 'right left',
                        TexConstant.Length.THICKMATHSPACE, '.5em', 'D', null,
                        'right'],
    leqalignno:        ['Matrix', null, null, 'right left',
                        TexConstant.Length.THICKMATHSPACE, '.5em', 'D', null,
                        'left'],
    hfill:              'HFill',
    hfil:               'HFill',   // \hfil treated as \hfill for now
    hfilll:             'HFill',   // \hfilll treated as \hfill for now

    //  TeX substitution macros
    bmod:              ['Macro', '\\mmlToken{mo}[lspace="thickmathspace"' +
                        ' rspace="thickmathspace"]{mod}'],
    pmod:              ['Macro', '\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}', 1],
    mod:               ['Macro', '\\mathchoice{\\kern18mu}{\\kern12mu}' +
                        '{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1',
                        1],
    pod:               ['Macro', '\\mathchoice{\\kern18mu}{\\kern8mu}' +
                        '{\\kern8mu}{\\kern8mu}(#1)', 1],
    iff:               ['Macro', '\\;\\Longleftrightarrow\\;'],
    skew:              ['Macro', '{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}', 3],
    mathcal:           ['Macro', '{\\cal #1}', 1],
    mathscr:           ['Macro', '{\\scr #1}', 1],
    mathrm:            ['Macro', '{\\rm #1}', 1],
    mathbf:            ['Macro', '{\\bf #1}', 1],
    mathbb:            ['Macro', '{\\bbFont #1}', 1],
    Bbb:               ['Macro', '{\\bbFont #1}', 1],
    mathit:            ['Macro', '{\\it #1}', 1],
    mathfrak:          ['Macro', '{\\frak #1}', 1],
    mathsf:            ['Macro', '{\\sf #1}', 1],
    mathtt:            ['Macro', '{\\tt #1}', 1],
    textrm:            ['Macro', '\\mathord{\\rm\\text{#1}}', 1],
    textit:            ['Macro', '\\mathord{\\it\\text{#1}}', 1],
    textbf:            ['Macro', '\\mathord{\\bf\\text{#1}}', 1],
    textsf:            ['Macro', '\\mathord{\\sf\\text{#1}}', 1],
    texttt:            ['Macro', '\\mathord{\\tt\\text{#1}}', 1],
    pmb:               ['Macro', '\\rlap{#1}\\kern1px{#1}', 1],
    TeX:               ['Macro', 'T\\kern-.14em\\lower.5ex{E}\\kern-.115em X'],
    LaTeX:             ['Macro', 'L\\kern-.325em\\raise.21em' +
                        '{\\scriptstyle{A}}\\kern-.17em\\TeX'],
    ' ':               ['Macro', '\\text{ }'],

    //  Specially handled
    not:                'Not',
    dots:               'Dots',
    space:              'Tilde',
    '\u00A0':           'Tilde',


    //  LaTeX
    // TODO: These should be in a special structure.
    begin:              'BeginEnd',
    end:                'BeginEnd',

    newcommand:        ['Extension', 'newcommand'],
    renewcommand:      ['Extension', 'newcommand'],
    newenvironment:    ['Extension', 'newcommand'],
    renewenvironment:  ['Extension', 'newcommand'],
    def:               ['Extension', 'newcommand'],
    'let':               ['Extension', 'newcommand'],

    verb:              ['Extension', 'verb'],

    boldsymbol:        ['Extension', 'boldsymbol'],

    tag:               ['Extension', 'AMSmath'],
    notag:             ['Extension', 'AMSmath'],
    label:             ['Extension', 'AMSmath'],
    ref:               ['Extension', 'AMSmath'],
    eqref:             ['Extension', 'AMSmath'],
    nonumber:          ['Macro', '\\notag'],

    //  Extensions to TeX
    unicode:           ['Extension', 'unicode'],
    color:              'Color',

    href:              ['Extension', 'HTML'],
    'class':           ['Extension', 'HTML'],
    style:             ['Extension', 'HTML'],
    cssId:             ['Extension', 'HTML'],
    bbox:              ['Extension', 'bbox'],

    mmlToken:           'MmlToken',

    require:            'Require'

  });

  EnvironmentMap.create('environment', {
    array:        ['AlignedArray'],
    matrix:       ['Array', null, null, null, 'c'],
    pmatrix:      ['Array', null, '(', ')', 'c'],
    bmatrix:      ['Array', null, '[', ']', 'c'],
    Bmatrix:      ['Array', null, '\\{', '\\}', 'c'],
    vmatrix:      ['Array', null, '\\vert', '\\vert', 'c'],
    Vmatrix:      ['Array', null, '\\Vert', '\\Vert', 'c'],
    cases:        ['Array', null, '\\{', '.', 'll', null, '.2em', 'T'],

    // VS Q What are these with function null?
    //      What about the AMSmath argument?
    equation:     [null, 'Equation'],
    'equation*':  [null, 'Equation'],

    eqnarray:     ['ExtensionEnv', null, 'AMSmath'],
    'eqnarray*':  ['ExtensionEnv', null, 'AMSmath'],

    align:        ['ExtensionEnv', null, 'AMSmath'],
    'align*':     ['ExtensionEnv', null, 'AMSmath'],
    aligned:      ['ExtensionEnv', null, 'AMSmath'],
    multline:     ['ExtensionEnv', null, 'AMSmath'],
    'multline*':  ['ExtensionEnv', null, 'AMSmath'],
    split:        ['ExtensionEnv', null, 'AMSmath'],
    gather:       ['ExtensionEnv', null, 'AMSmath'],
    'gather*':    ['ExtensionEnv', null, 'AMSmath'],
    gathered:     ['ExtensionEnv', null, 'AMSmath'],
    alignat:      ['ExtensionEnv', null, 'AMSmath'],
    'alignat*':   ['ExtensionEnv', null, 'AMSmath'],
    alignedat:    ['ExtensionEnv', null, 'AMSmath']
  });

  CharacterMap.create('not_remap', null, {
    '\u2190': '219A',
    '\u2192': '219B',
    '\u2194': '21AE',
    '\u21D0': '21CD',
    '\u21D2': '21CF',
    '\u21D4': '21CE',
    '\u2208': '2209',
    '\u220B': '220C',
    '\u2223': '2224',
    '\u2225': '2226',
    '\u223C': '2241',
    '\u007E': '2241',
    '\u2243': '2244',
    '\u2245': '2247',
    '\u2248': '2249',
    '\u224D': '226D',
    '\u003D': '2260',
    '\u2261': '2262',
    '\u003C': '226E',
    '\u003E': '226F',
    '\u2264': '2270',
    '\u2265': '2271',
    '\u2272': '2274',
    '\u2273': '2275',
    '\u2276': '2278',
    '\u2277': '2279',
    '\u227A': '2280',
    '\u227B': '2281',
    '\u2282': '2284',
    '\u2283': '2285',
    '\u2286': '2288',
    '\u2287': '2289',
    '\u22A2': '22AC',
    '\u22A8': '22AD',
    '\u22A9': '22AE',
    '\u22AB': '22AF',
    '\u227C': '22E0',
    '\u227D': '22E1',
    '\u2291': '22E2',
    '\u2292': '22E3',
    '\u22B2': '22EA',
    '\u22B3': '22EB',
    '\u22B4': '22EC',
    '\u22B5': '22ED',
    '\u2203': '2204'
  });
  
  // TODO: This is temporary until we have merged with configuration options.
  export const Configuration = ['command', 'special', 'letter', 'digit'];

}
