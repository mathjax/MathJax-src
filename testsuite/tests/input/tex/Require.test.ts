import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import {
  getTokens,
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
    expect(await typeset2mml('\\require{bbox} \\bbox[red]{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Require with dependencies', async () => {
    expect(await typeset2mml('\\require{cancel} \\cancel{x+1}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Require with preprocessors', async () => {
    expect(await typeset2mml('\\require{textcomp} \\text{a \\bf b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Require with stack items', async () => {
    expect(await typeset2mml('\\require{braket} \\bra{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Require with menu extensions', async () => {
    expect(await typeset2mml('\\require{bbm} \\mathbbm{A}')).toMatchSnapshot();
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

  test('Failed to load error', async () => {
    setupTexTypeset(['base', 'require']);
    await expectTypesetError('\\require{xyz}').toBe('Extension "xyz" failed to load');
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
    expect(await typeset2mml('\\require{bbox} \\bbox[red]{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Prefixed options', async () => {
    setupTexTypeset(['base', 'require'], {require: {defaultAllow: false, allow: {'[tex]/bbox': true}}});
    expect(await typeset2mml('\\require{bbox} \\bbox[red]{x}')).toMatchSnapshot();
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
    expect(await typeset2mml('\\requireLoad \\bbox[red]{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('require'));
