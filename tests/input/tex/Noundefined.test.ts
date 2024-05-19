import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'noundefined']));

describe('Noundefined', () => {
  it('Noundefined Single', () =>
    toXmlMatch(
      tex2mml('\\a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\a" display="block">\n  <mtext mathcolor="red" data-latex="\\a">\\a</mtext>\n</math>'
    ));
  it('Noundefined Context', () =>
    toXmlMatch(
      tex2mml('a\\b c'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\b c" display="block">\n  <mi data-latex="a">a</mi>\n  <mtext mathcolor="red" data-latex="\\b">\\b</mtext>\n  <mi data-latex="c">c</mi>\n</math>'
    ));
});
