import { beforeEach, describe, test, expect } from '@jest/globals';
import {
  toXmlMatch,
  toXmlArrayMatch,
  toMathML,
  tex2mml,
  page2mml,
  setupTex,
  setupTexPage,
  setupComponents,
  trapOutput,
  trapErrors,
  expectTexError
} from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/newcommand/NewcommandConfiguration';

import { TeX } from '#js/input/tex.js';
import { MmlFactory } from '#js/core/MmlTree/MmlFactory.js';

import { Configuration, ConfigurationHandler } from '#js/input/tex/Configuration.js';
import { HandlerType, ConfigurationType } from '#js/input/tex/HandlerTypes.js';
import { CommandMap } from '#js/input/tex/TokenMap.js';
import { Token } from '#js/input/tex/Token.js';
import { TagsFactory } from '#js/input/tex/Tags.js';
import TexError from '#js/input/tex/TexError.js';
import { ParseUtil, KeyValueTypes, KeyValueDef } from '#js/input/tex/ParseUtil.js';

/**********************************************************************************/
/**********************************************************************************/

const tex = new TeX();
tex.setMmlFactory(new MmlFactory());

describe('TeX', () => {
  test('Reset', () => expect(tex.reset()).toBe(undefined));
});

/**********************************************************************************/
/**********************************************************************************/

describe('NodeFactory', () => {

  test('createText null text', () => {
    expect(tex.parseOptions.nodeFactory.create('text', null)).toBe(null)
  });

  test('create null kind', () => {
    toXmlMatch(
      toMathML(tex.parseOptions.nodeFactory.create('undefined', 'mi')),
      `<mi></mi>`
    );
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('NodeUtil', () => {

  test('inferred propery', () => {
    const mrow = tex.parseOptions.nodeFactory.create('node', 'mrow', [], {inferred: true});
    expect(mrow.getProperty('inferred')).toBe(undefined);
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('Stack', () => {

  new CommandMap('stackMacros', {
    showStack: (parser) => {parser.stack.toString()},
    getTop: 'getTop'  // coverage for macro defined by name of method in methods object
  }, {
    getTop: (parser) => {
      const top = parser.stack.Top(5);
      const mtext = parser.create('token', 'mtext', {}, top === null ? 'yes' : 'no');
      parser.Push(mtext);
    },
  });

  Configuration.create('stackMacros', {
    [ConfigurationType.HANDLER]: {
      [HandlerType.MACRO]: ['stackMacros']
    }
  });

  beforeEach(() => setupTex(['base', 'stackMacros']));

  /********************************************************************************/

  test('toString', () => {
    toXmlMatch(
      tex2mml('\\showStack'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\showStack" display="block"></math>`
    );
  });

  /********************************************************************************/

  test('getTop', () => {
    setupTex(['base', 'stackMacros']);
    toXmlMatch(
      tex2mml('\\getTop'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\getTop" display="block">
         <mtext data-latex="\\getTop">yes</mtext>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Token', () => {

  test('token', () => {
    const token = new Token('x', 'y', {});
    expect(token.token).toBe('x');
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('Tags', () => {

  test('noTag', () => {
    expect((tex.parseOptions.tags as any).noTag).toBe(false);
  });

  test('Unknown default', () => {
    TagsFactory.setDefault('unknown');
    const message = trapErrors(() => {TagsFactory.create('error')});
    TagsFactory.setDefault('none');
    expect(message).toBe('Unknown tags class');
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('TexError', () => {

  test('Number argument', () => {
    const err = new TexError('test', 'Number: %1', 1 as any);
    expect(err.message).toBe('Number: 1');
  });

  test('Braced insertion', () => {
    const err = new TexError('test', 'Msg: %{1}, Number: %{2}', 'OK', 2 as any);
    expect(err.message).toBe('Msg: OK, Number: 2');
  });

  test('Plural', () => {
    const err = new TexError('test', '%{plural:%1|abc}', 'apple');
    expect(err.message).toBe('%{plural:%1|abc}');
  });

  test('Percent', () => {
    const err = new TexError('test', '10%%');
    expect(err.message).toBe('10%');
  });

});

/**********************************************************************************/
/**********************************************************************************/

setupComponents({
  loader: {load: ['input/tex-base']}
});

describe('FindTeX', () => {

  setupTexPage(['base']);

  /********************************************************************************/

  test('display math', async () => {
    toXmlArrayMatch(
      await page2mml('abc $$ x + 1 $$ def'),
      [
        `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex=" x + 1 " display="block">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mn data-latex="1">1</mn>
         </math>`
      ]
    );
  });

  /********************************************************************************/

  test('environment', async () => {
    toXmlArrayMatch(
      await page2mml('abc \\begin{equation} x=y \\end{equation} def'),
      [
        `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} x=y \\end{equation}" display="block">
           <mi data-latex="x">x</mi>
           <mo data-latex="=">=</mo>
           <mi data-latex="y">y</mi>
         </math>`
      ]
    );
  });

  /********************************************************************************/

  test('Nested braces', async () => {
    toXmlArrayMatch(
      await page2mml('abc $$a + {\\bf b} + c$$ def'),
      [
        `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a + {\\bf b} + c" display="block">
           <mi data-latex="a">a</mi>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{b}">
             <mi mathvariant="bold" data-latex="b">b</mi>
           </mrow>
           <mo data-latex="+">+</mo>
           <mi data-latex="c">c</mi>
         </math>`
      ]
    );
  });

  /********************************************************************************/

  test('processEscapes', async () => {
    toXmlArrayMatch(
      await page2mml('abc \\$ def'),
      [
        `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="$">
           <mo data-latex="$">$</mo>
         </math>`
      ]
    );
  });

  /********************************************************************************/

  test('ref undefined', async () => {
    toXmlArrayMatch(
      await page2mml('abc \\ref{x} def'),
      [
        `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ref{x}">
           <mrow href="#" class="MathJax_ref" data-latex="\\ref{x}">
             <mtext>???</mtext>
           </mrow>
         </math>`
      ]
    );
  });

  /********************************************************************************/

  test('No close delim', () => {
    expect(page2mml('abc $$ x + 1')).resolves.toEqual([]);
  });

  /********************************************************************************/

  test('No close delim', () => {
    expect(page2mml('abc \\begin{align} x + 1')).resolves.toEqual([]);
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Configuration', () => {

  /********************************************************************************/

  test('keys', () => {
    expect(Array.from(ConfigurationHandler.keys()).length > 0).toBe(true);
  });

  /********************************************************************************/

  test('init', () => {
    const init = () => {};
    const config = Configuration.create('init', {
      [ConfigurationType.INIT]: init
    });
    expect(config.init).toBe(init);
  });

  /********************************************************************************/

  test('init null', () => {
    expect(ConfigurationHandler.get('base').init).toBe(null);
  });

  /********************************************************************************/

  test('Package priority', () => {
    const order: number[] = [];
    Configuration.create('priority 1', {
      [ConfigurationType.INIT]: () => {order.push(1)}
    });
    Configuration.create('priority 2', {
      [ConfigurationType.INIT]: () => {order.push(2)}
    });
    setupTex([['priority 1', 1], ['priority 2', 2]]);
    expect(order).toEqual([1, 2]);
    setupTex([['priority 1', 2], ['priority 2', 1]]);
    expect(order).toEqual([1, 2, 2, 1]);
  });

  /********************************************************************************/

  test('Parser error', () => {
    Configuration.create('error', {
      [ConfigurationType.PARSER]: 'error'
    });
    const message = trapErrors(() => {new TeX({packages: ['base', 'error']})});
    expect(message).toBe("Package 'error' doesn't target the proper parser");
  });

  /********************************************************************************/

  test('Package error', () => {
    const message = trapOutput('warn', () => new TeX({packages: ['base', 'undefined']}));
    expect(message).toBe("MathJax Warning: Package 'undefined' not found.  Omitted.");
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('MapHandler', () => {

  /********************************************************************************/

  test('Undefined', () => {
    Configuration.create('BadHandler', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['undefindHandler']
      }
    });
    const message = trapOutput('log', () => new TeX({packages: ['base', 'BadHandler']}));
    expect(message).toBe("TexParser Warning: Configuration 'undefindHandler' not found! Omitted.");
  });

  /********************************************************************************/

  test('remove', () => {
    const fallback = () => {};
    Configuration.create('fallback', {
      [ConfigurationType.FALLBACK]: {
        [HandlerType.MACRO]: fallback
      }
    });
    const tex = new TeX({packages: ['fallback']});
    const map = (tex as any).configuration.handlers.get(HandlerType.MACRO);
    expect(Array.from((map as any)._fallback).length).toBe(1);
    map.remove([], fallback);
    expect(Array.from((map as any)._fallback).length).toBe(0);
  });

  /********************************************************************************/

  test('toString', () => {
    const map = (tex as any).configuration.handlers.get(HandlerType.MACRO);
    expect(map.toString())
      .toBe('mathchar7, mathchar0mo, mathchar0mi, ucGreek, lcGreek, macros, delimiter');
  });

  /********************************************************************************/

  test('retrieve', () => {
    const handlers = (tex as any).configuration.handlers;
    expect(handlers.retrieve('undefined')).toBe(null);
  });

  /********************************************************************************/

  test('keys', () => {
    const handlers = (tex as any).configuration.handlers;
    expect(Array.from(handlers.keys()).sort()).toEqual(Object.values(HandlerType).sort());
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('TexParser', () => {

  /********************************************************************************/

  test('toString', () => {
    let output = '';
    new CommandMap('showParser', {
      showparser(parser: any) {
        output = parser.toString();
      }
    });
    Configuration.create('showParser', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['showParser']
      }
    });
    setupTex(['base', 'showParser']);
    tex2mml('\\showparser');
    expect(output).toBe(
      [
        'character: digit, letter, special, command',
        'delimiter: delimiter',
        'macro: showParser, mathchar7, mathchar0mo, mathchar0mi, ucGreek, lcGreek, macros, delimiter',
        'environment: environment',
        ''
      ].join('\n')
    );
  });

  test('GetBrackets nested [', () => {
    setupTex(['base', 'ams']);
    toXmlMatch(
      tex2mml('\\xrightarrow[{[x]}]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightarrow[{[x]}]{a}" display="block">
         <munderover data-latex="\\xrightarrow[{[x]}]{a}">
           <mo data-mjx-texclass="REL">&#x2192;</mo>
           <mpadded width="+0.833em" lspace="0.278em" voffset=".15em" depth="-.15em">
             <mrow data-mjx-texclass="ORD" data-latex="{[x]}">
               <mo data-latex="[" stretchy="false">[</mo>
               <mi data-latex="x">x</mi>
               <mo data-latex="]" stretchy="false">]</mo>
             </mrow>
             <mspace height=".75em"></mspace>
           </mpadded>
           <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
             <mi data-latex="a">a</mi>
             <mspace depth=".2em"></mspace>
           </mpadded>
         </munderover>
       </math>`
    );
  });

  test('GetBrackets matchBrakets', () => {
    new CommandMap('matchBrackets', {
      matchbrackets(parser: any, name: string) {
        const arg = parser.GetBrackets(name, '', true);
        parser.Push(parser.create('token', 'mtext', {}, arg));
      }
    });
    Configuration.create('matchBrackets', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['matchBrackets']
      }
    });
    setupTex(['base', 'matchBrackets']);
    toXmlMatch(
      tex2mml('\\matchbrackets[[x]]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matchbrackets[[x]]" display="block">
         <mtext data-latex="\\matchbrackets[[x]]">[x]</mtext>
       </math>`
    );
  });

  test('mml', () => {
    new CommandMap('mml', {
      mml(parser: any) {
        parser.mml();
      }
    });
    Configuration.create('mml', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['mml']
      }
    });
    setupTex(['base', 'mml']);
    toXmlMatch(
      tex2mml('{\\mml}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\mml}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mml}"></mrow>
       </math>`
    );
  });

  test('Removed delimiter', () => {
    setupTex(['base', 'ams', 'newcommand']);
    toXmlMatch(
      tex2mml('\\let\\vert=x \\begin{vmatrix} a \\end{vmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\vert=x \\begin{vmatrix} a \\end{vmatrix}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" data-latex-item="{vmatrix}" data-latex="\\let\\vert=x \\begin{vmatrix} a \\end{vmatrix}">
           <mtr>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('ParseUtil', () => {

  /********************************************************************************/

  test('keyValue', () => {
    expect(ParseUtil.keyvalOptions('ab')).toEqual({ab: true});
    expect(ParseUtil.keyvalOptions('ab=true')).toEqual({ab: true});
    expect(ParseUtil.keyvalOptions('ab=false')).toEqual({ab: false});
    expect(ParseUtil.keyvalOptions('ab=xyz')).toEqual({ab: 'xyz'});
    expect(ParseUtil.keyvalOptions('ab=')).toEqual({ab: ''});
    expect(ParseUtil.keyvalOptions('{ab=}')).toEqual({ab: ''});
    expect(ParseUtil.keyvalOptions('{{ab=}}')).toEqual({'ab=': true});
    expect(ParseUtil.keyvalOptions('ab=1,cd')).toEqual({'ab': "1", cd: true});
    expect(ParseUtil.keyvalOptions('ab cd=x')).toEqual({'ab cd': 'x'});
    expect(ParseUtil.keyvalOptions('{ab,c=d}=x')).toEqual({'ab,c=d': 'x'});
    expect(ParseUtil.keyvalOptions('ab=\\x')).toEqual({ab: '\\x'});
    expect(ParseUtil.keyvalOptions('ab=\\{')).toEqual({ab: '\\{'});
    expect(ParseUtil.keyvalOptions('ab={a\\{b}')).toEqual({ab: 'a\\{b'});
    expect(ParseUtil.keyvalOptions('ab=\\')).toEqual({ab: '\\'});
    expect(ParseUtil.keyvalOptions('a\\b=c')).toEqual({'a\\b': 'c'});
  });

  test('keyValue braces', () => {
    expect(ParseUtil.keyvalOptions('ab={{{cd} ef}}')).toEqual({ab: '{cd} ef'});
    expect(ParseUtil.keyvalOptions('ab={{{cd} ef}}', null, false, true)).toEqual({ab: '{{cd} ef}'});
    expect(ParseUtil.keyvalOptions('ab={x,y=z}')).toEqual({ab: 'x,y=z'});
  });

  test('keyValue extra open brace', () => {
    const message = trapErrors(() => ParseUtil.keyvalOptions('ab={c{d}'));
    expect(message).toBe('Extra open brace or missing close brace');
  });

  test('keyValue extra close brace', () => {
    const message = trapErrors(() => ParseUtil.keyvalOptions('ab=c{d}}'));
    expect(message).toBe('Extra close brace or missing open brace');
  });

  test('keyValue allowed values', () => {
    expect(ParseUtil.keyvalOptions('ab', {ab: 1})).toEqual({ab: true});
    expect(ParseUtil.keyvalOptions('ab', {abc: 1})).toEqual({});
    expect(ParseUtil.keyvalOptions('ab', {ab: KeyValueTypes.boolean})).toEqual({ab: true});
    expect(ParseUtil.keyvalOptions('ab=true', {ab: KeyValueTypes.boolean})).toEqual({ab: true});
    expect(ParseUtil.keyvalOptions('ab=1.2', {ab: KeyValueTypes.number})).toEqual({ab: 1.2});
    expect(ParseUtil.keyvalOptions('ab=12', {ab: KeyValueTypes.integer})).toEqual({ab: 12});
    expect(ParseUtil.keyvalOptions('ab=xy', {ab: KeyValueTypes.string})).toEqual({ab: 'xy'});
    expect(ParseUtil.keyvalOptions('ab=x', {ab: KeyValueDef.oneof('x','y')})).toEqual({ab: 'x'});
    expect(ParseUtil.keyvalOptions('ab=y', {ab: KeyValueDef.oneof('x','y')})).toEqual({ab: 'y'});
    expect(ParseUtil.keyvalOptions('ab=2em', {ab: KeyValueTypes.dimen})).toEqual({ab: '2em'});
  });

  test('keyValue allowed with errors', () => {
    function trap(test: string, allow: any) {
      return expect(trapErrors(() => ParseUtil.keyvalOptions(test, allow, true)));
    }
    const error = "Value for key 'ab' is not of the expected type";
    trap('ab', {abc: 1}).toBe('Invalid option: ab');
    trap('ab=x', {ab: KeyValueTypes.boolean}).toBe(error);
    trap('ab=x', {ab: KeyValueTypes.number}).toBe(error);
    trap('ab=1.2', {ab: KeyValueTypes.integer}).toBe(error);
    trap('ab=', {ab: KeyValueTypes.string}).toBe('(no error)');
    trap('ab=z', {ab: KeyValueDef.oneof('x','y')}).toBe(error);
    trap('ab=2xy', {ab: KeyValueTypes.dimen}).toBe(error);
    trap('ab=2', {ab: KeyValueTypes.dimen}).toBe(error);
  });

  test('fixedFence', () => {
    function create(kind: string, options?: any, children?: any[]) {
      return tex.mmlFactory.create(kind, options, children);
    }
    const mrow = create('mrow', {}, [create('mi')]);
    const mml = ParseUtil.fixedFence(tex.parseOptions, '(', mrow, ')');
    const kinds = mml.childNodes.map((node) => node.kind);
    expect(kinds).toEqual(['MathChoice', 'mi', 'MathChoice']);
  });

});

/**********************************************************************************/
/**********************************************************************************/

describe('ColumnParser', () => {

  /********************************************************************************/

  test('Error', () => {
    new CommandMap('cError', {
      cError(parser: any) {
        const array = parser.itemFactory.create('array');
        parser.configuration.columnParser.process(parser, '@{x', array);
      }
    });
    Configuration.create('cError', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['cError']
      }
    });
    setupTex(['base', 'cError']);
    expectTexError('\\cError').toBe('Missing close brace');
  });

});

/**********************************************************************************/
/**********************************************************************************/
