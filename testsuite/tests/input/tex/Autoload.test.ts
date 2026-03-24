import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTexTypeset, typeset2mml, setupComponents } from '#helpers';

setupComponents({loader: {load: ['input/tex-base', '[tex]/autoload']}});

/**********************************************************************************/

beforeEach(() => setupTexTypeset(['base', 'autoload']));

describe('Autoload', () => {

  test('Autoload package', async () => {
    expect(await typeset2mml('\\bbox[red]{x}')).toMatchSnapshot();
  });

  test('Autoload environment', async () => {
    expect(await typeset2mml('\\begin{CD} a @>>> b\\end{CD}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('autoload'));
