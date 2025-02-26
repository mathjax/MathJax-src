import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import {
  getTokens,
  toXmlMatch,
  setupTexTypeset,
  typeset2mml,
  setupComponents,
  expectTypesetError
} from '#helpers';

import {Configuration} from '#js/input/tex/Configuration.js';
import {HandlerType, ConfigurationType} from '#js/input/tex/HandlerTypes.js';
import {CommandMap} from '#js/input/tex/TokenMap.js';

declare const MathJax: any;

setupComponents({
  loader: {
    load: ['input/tex-base', '[tex]/require'],
    source: {
      '[tex]/error': '../../testsuite/lib/error.js'
    },
    dependencies: {
      '[tex]/upgreek': ['input/tex-base', '[tex]/error']
    }
  },
  startup: {
    ready() {
      //
      //  Fake the menu, since that isn't added unless there is a window
      //
      MathJax.startup.extendHandler((handler: any) => {
        class myMenuDoc extends handler.documentClass {
          menu: any;
          constructor(...args: any[]) {
            super(...args);
            this.menu = {
              addRequiredExtensions(_required: any) {}
            }
          }
        }
        handler.documentClass = myMenuDoc;
        return handler;
      }, 20);
      MathJax.startup.defaultReady();
    }
  }
});

/**********************************************************************************/
/**********************************************************************************/

beforeEach(() => setupTexTypeset(['base', 'require']));

describe('Require', () => {

  /********************************************************************************/

  test('Require package', async () => {
    toXmlMatch(
      await typeset2mml('\\require{bbox} \\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{bbox} \\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\require{bbox} \\bbox[red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Require with dependencies', async () => {
    toXmlMatch(
      await typeset2mml('\\require{cancel} \\cancel{x+1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{cancel} \\cancel{x+1}" display="block">
         <menclose notation="updiagonalstrike" data-latex="\\require{cancel} \\cancel{x+1}">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mn data-latex="1">1</mn>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  test('Require with preprocessors', async () => {
    toXmlMatch(
      await typeset2mml('\\require{textcomp} \\text{a \\bf b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{textcomp} \\text{a \\bf b}" display="block">
         <mrow data-latex="\\require{textcomp} \\text{a \\bf b}">
           <mtext>a&#xA0;</mtext>
           <mtext mathvariant="bold">b</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Require with stack items', async () => {
    toXmlMatch(
      await typeset2mml('\\require{braket} \\bra{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{braket} \\bra{a}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\langle {a} \\vert}">
           <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{a}">
             <mi data-latex="a">a</mi>
           </mrow>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Require with menu extensions', async () => {
    toXmlMatch(
      await typeset2mml('\\require{bbm} \\mathbbm{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{bbm} \\mathbbm{A}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\require{bbm} \\mathbbm{A}">
           <mi data-mjx-variant="-bbm-normal" data-latex="A">A</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bad Package name', async () => {
    await expectTypesetError('\\require{***}')
      .toBe('Argument for \\require is not a valid package name');
  });

  /********************************************************************************/

  test('Restricted Package', async () => {
    await expectTypesetError('\\require{tagformat}')
      .toBe('Extension "[tex]/tagformat" is not allowed to be loaded');
  });

  /********************************************************************************/

  test('Dependency error', async () => {
    setupTexTypeset(['base', 'require']);
    await expectTypesetError('\\require{upgreek}').toBe('Error in Dependency');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Require Options', () => {

  /********************************************************************************/

  test('Illegal Prefix', async () => {
    setupTexTypeset(['base', 'require'], {require: {prefix: '***'}});
    await expectTypesetError('').toBe('Illegal characters used in \\require prefix');
  });

  /********************************************************************************/

  test('Prefix', async () => {
    setupTexTypeset(['base', 'require'], {require: {prefix: 'test'}});
    expect(typeset2mml('').then(() => 'OK').catch((e) => e.message))
      .resolves.toBe('OK');
  });

  /********************************************************************************/

  test('DefaultAllow with allow', async () => {
    setupTexTypeset(['base', 'require'], {require: {defaultAllow: false, allow: {bbox: true}}});
    toXmlMatch(
      await typeset2mml('\\require{bbox} \\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{bbox} \\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\require{bbox} \\bbox[red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Prefixed options', async () => {
    setupTexTypeset(['base', 'require'], {require: {defaultAllow: false, allow: {'[tex]/bbox': true}}});
    toXmlMatch(
      await typeset2mml('\\require{bbox} \\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{bbox} \\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\require{bbox} \\bbox[red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('RequireLoad with prefix', async () => {
    new CommandMap('require-load', {
      requireLoad(parser: any) {
        MathJax._.input.tex.require.RequireConfiguration.RequireLoad(parser, '[tex]/bbox');
      }
    });
    Configuration.create('require-load', {
      [ConfigurationType.HANDLER]: {
        [HandlerType.MACRO]: ['require-load']
      }
    });
    setupTexTypeset(['base', 'require', 'require-load']);
    toXmlMatch(
      await typeset2mml('\\requireLoad \\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\requireLoad \\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\requireLoad \\bbox[red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('require'));
