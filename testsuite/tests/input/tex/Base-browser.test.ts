import { describe, test, expect } from '@jest/globals';

const FILE = 'https://testing.com/testing.html';

const window = {
  document: {
    getElementsByTagName: () => [1],
    location: `${FILE}#xyz`,
  }
};
(global as any).window = window;

/**********************************************************************************/
/**********************************************************************************/

describe('Base Window', () => {

  test('Base Tag', async () => {
    const { BaseConfiguration } = await import('#js/input/tex/base/BaseConfiguration.js');
    expect(BaseConfiguration.options.baseURL).toBe(FILE);
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

