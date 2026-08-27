import { beforeEach, describe, expect, it } from '@jest/globals';
import { setupTex, tex2mml } from '#src/index.js';
import '#js/input/tex/noundefined/NoUndefinedConfiguration.js';

beforeEach(() => setupTex(['base', 'noundefined']));

/**********************************************************************************/

describe('Noundefined', () => {
  it('Noundefined Single', () => {
    expect(tex2mml('\\a')).toMatchSnapshot();
  });

  it('Noundefined Context', () => {
    expect(tex2mml('a\\b c')).toMatchSnapshot();
  });
});

/**********************************************************************************/
