import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/textcomp/TextcompConfiguration';
import '#js/input/tex/textmacros/TextMacrosConfiguration';

beforeEach(() => setupTex(['base', 'textcomp']));

/**********************************************************************************/

describe('Textcomp', () => {
  test('textasciicircum', () => {
    expect(tex2mml('\\textasciicircum')).toMatchSnapshot();
  });

  test('textasciitilde', () => {
    expect(tex2mml('\\textasciitilde')).toMatchSnapshot();
  });

  test('textasteriskcentered', () => {
    expect(tex2mml('\\textasteriskcentered')).toMatchSnapshot();
  });

  test('textbackslash', () => {
    expect(tex2mml('\\textbackslash')).toMatchSnapshot();
  });

  test('textbar', () => {
    expect(tex2mml('\\textbar')).toMatchSnapshot();
  });

  test('textbraceleft', () => {
    expect(tex2mml('\\textbraceleft')).toMatchSnapshot();
  });

  test('textbraceright', () => {
    expect(tex2mml('\\textbraceright')).toMatchSnapshot();
  });

  test('textbullet', () => {
    expect(tex2mml('\\textbullet')).toMatchSnapshot();
  });

  test('textdagger', () => {
    expect(tex2mml('\\textdagger')).toMatchSnapshot();
  });

  test('textdaggerdbl', () => {
    expect(tex2mml('\\textdaggerdbl')).toMatchSnapshot();
  });

  test('textellipsis', () => {
    expect(tex2mml('\\textellipsis')).toMatchSnapshot();
  });

  test('textemdash', () => {
    expect(tex2mml('\\textemdash')).toMatchSnapshot();
  });

  test('textendash', () => {
    expect(tex2mml('\\textendash')).toMatchSnapshot();
  });

  test('textexclamdown', () => {
    expect(tex2mml('\\textexclamdown')).toMatchSnapshot();
  });

  test('textgreater', () => {
    expect(tex2mml('\\textgreater')).toMatchSnapshot();
  });

  test('textless', () => {
    expect(tex2mml('\\textless')).toMatchSnapshot();
  });

  test('textordfeminine', () => {
    expect(tex2mml('\\textordfeminine')).toMatchSnapshot();
  });

  test('textordmasculine', () => {
    expect(tex2mml('\\textordmasculine')).toMatchSnapshot();
  });

  test('textparagraph', () => {
    expect(tex2mml('\\textparagraph')).toMatchSnapshot();
  });

  test('textperiodcentered', () => {
    expect(tex2mml('\\textperiodcentered')).toMatchSnapshot();
  });

  test('textquestiondown', () => {
    expect(tex2mml('\\textquestiondown')).toMatchSnapshot();
  });

  test('textquotedblleft', () => {
    expect(tex2mml('\\textquotedblleft')).toMatchSnapshot();
  });

  test('textquotedblright', () => {
    expect(tex2mml('\\textquotedblright')).toMatchSnapshot();
  });

  test('textquoteleft', () => {
    expect(tex2mml('\\textquoteleft')).toMatchSnapshot();
  });

  test('textquoteright', () => {
    expect(tex2mml('\\textquoteright')).toMatchSnapshot();
  });

  test('textsection', () => {
    expect(tex2mml('\\textsection')).toMatchSnapshot();
  });

  test('textunderscore', () => {
    expect(tex2mml('\\textunderscore')).toMatchSnapshot();
  });

  test('textvisiblespace', () => {
    expect(tex2mml('\\textvisiblespace')).toMatchSnapshot();
  });

  test('textacutedbl', () => {
    expect(tex2mml('\\textacutedbl')).toMatchSnapshot();
  });

  test('textasciiacute', () => {
    expect(tex2mml('\\textasciiacute')).toMatchSnapshot();
  });

  test('textasciibreve', () => {
    expect(tex2mml('\\textasciibreve')).toMatchSnapshot();
  });

  test('textasciicaron', () => {
    expect(tex2mml('\\textasciicaron')).toMatchSnapshot();
  });

  test('textasciidieresis', () => {
    expect(tex2mml('\\textasciidieresis')).toMatchSnapshot();
  });

  test('textasciimacron', () => {
    expect(tex2mml('\\textasciimacron')).toMatchSnapshot();
  });

  test('textgravedbl', () => {
    expect(tex2mml('\\textgravedbl')).toMatchSnapshot();
  });

  test('texttildelow', () => {
    expect(tex2mml('\\texttildelow')).toMatchSnapshot();
  });

  test('textbaht', () => {
    expect(tex2mml('\\textbaht')).toMatchSnapshot();
  });

  test('textcent', () => {
    expect(tex2mml('\\textcent')).toMatchSnapshot();
  });

  test('textcolonmonetary', () => {
    expect(tex2mml('\\textcolonmonetary')).toMatchSnapshot();
  });

  test('textcurrency', () => {
    expect(tex2mml('\\textcurrency')).toMatchSnapshot();
  });

  test('textdollar', () => {
    expect(tex2mml('\\textdollar')).toMatchSnapshot();
  });

  test('textdong', () => {
    expect(tex2mml('\\textdong')).toMatchSnapshot();
  });

  test('texteuro', () => {
    expect(tex2mml('\\texteuro')).toMatchSnapshot();
  });

  test('textflorin', () => {
    expect(tex2mml('\\textflorin')).toMatchSnapshot();
  });

  test('textguarani', () => {
    expect(tex2mml('\\textguarani')).toMatchSnapshot();
  });

  test('textlira', () => {
    expect(tex2mml('\\textlira')).toMatchSnapshot();
  });

  test('textnaira', () => {
    expect(tex2mml('\\textnaira')).toMatchSnapshot();
  });

  test('textpeso', () => {
    expect(tex2mml('\\textpeso')).toMatchSnapshot();
  });

  test('textsterling', () => {
    expect(tex2mml('\\textsterling')).toMatchSnapshot();
  });

  test('textwon', () => {
    expect(tex2mml('\\textwon')).toMatchSnapshot();
  });

  test('textyen', () => {
    expect(tex2mml('\\textyen')).toMatchSnapshot();
  });

  test('textcircledP', () => {
    expect(tex2mml('\\textcircledP')).toMatchSnapshot();
  });

  test('textcompwordmark', () => {
    expect(tex2mml('\\textcompwordmark')).toMatchSnapshot();
  });

  test('textcopyleft', () => {
    expect(tex2mml('\\textcopyleft')).toMatchSnapshot();
  });

  test('textcopyright', () => {
    expect(tex2mml('\\textcopyright')).toMatchSnapshot();
  });

  test('textregistered', () => {
    expect(tex2mml('\\textregistered')).toMatchSnapshot();
  });

  test('textservicemark', () => {
    expect(tex2mml('\\textservicemark')).toMatchSnapshot();
  });

  test('texttrademark', () => {
    expect(tex2mml('\\texttrademark')).toMatchSnapshot();
  });

  test('textbardbl', () => {
    expect(tex2mml('\\textbardbl')).toMatchSnapshot();
  });

  test('textbigcircle', () => {
    expect(tex2mml('\\textbigcircle')).toMatchSnapshot();
  });

  test('textblank', () => {
    expect(tex2mml('\\textblank')).toMatchSnapshot();
  });

  test('textbrokenbar', () => {
    expect(tex2mml('\\textbrokenbar')).toMatchSnapshot();
  });

  test('textdiscount', () => {
    expect(tex2mml('\\textdiscount')).toMatchSnapshot();
  });

  test('textestimated', () => {
    expect(tex2mml('\\textestimated')).toMatchSnapshot();
  });

  test('textinterrobang', () => {
    expect(tex2mml('\\textinterrobang')).toMatchSnapshot();
  });

  test('textinterrobangdown', () => {
    expect(tex2mml('\\textinterrobangdown')).toMatchSnapshot();
  });

  test('textmusicalnote', () => {
    expect(tex2mml('\\textmusicalnote')).toMatchSnapshot();
  });

  test('textnumero', () => {
    expect(tex2mml('\\textnumero')).toMatchSnapshot();
  });

  test('textopenbullet', () => {
    expect(tex2mml('\\textopenbullet')).toMatchSnapshot();
  });

  test('textpertenthousand', () => {
    expect(tex2mml('\\textpertenthousand')).toMatchSnapshot();
  });

  test('textperthousand', () => {
    expect(tex2mml('\\textperthousand')).toMatchSnapshot();
  });

  test('textrecipe', () => {
    expect(tex2mml('\\textrecipe')).toMatchSnapshot();
  });

  test('textreferencemark', () => {
    expect(tex2mml('\\textreferencemark')).toMatchSnapshot();
  });

  test('textlangle', () => {
    expect(tex2mml('\\textlangle')).toMatchSnapshot();
  });

  test('textrangle', () => {
    expect(tex2mml('\\textrangle')).toMatchSnapshot();
  });

  test('textlbrackdbl', () => {
    expect(tex2mml('\\textlbrackdbl')).toMatchSnapshot();
  });

  test('textrbrackdbl', () => {
    expect(tex2mml('\\textrbrackdbl')).toMatchSnapshot();
  });

  test('textlquill', () => {
    expect(tex2mml('\\textlquill')).toMatchSnapshot();
  });

  test('textrquill', () => {
    expect(tex2mml('\\textrquill')).toMatchSnapshot();
  });

  test('textcelsius', () => {
    expect(tex2mml('\\textcelsius')).toMatchSnapshot();
  });

  test('textdegree', () => {
    expect(tex2mml('\\textdegree')).toMatchSnapshot();
  });

  test('textdiv', () => {
    expect(tex2mml('\\textdiv')).toMatchSnapshot();
  });

  test('textdownarrow', () => {
    expect(tex2mml('\\textdownarrow')).toMatchSnapshot();
  });

  test('textfractionsolidus', () => {
    expect(tex2mml('\\textfractionsolidus')).toMatchSnapshot();
  });

  test('textleftarrow', () => {
    expect(tex2mml('\\textleftarrow')).toMatchSnapshot();
  });

  test('textlnot', () => {
    expect(tex2mml('\\textlnot')).toMatchSnapshot();
  });

  test('textmho', () => {
    expect(tex2mml('\\textmho')).toMatchSnapshot();
  });

  test('textminus', () => {
    expect(tex2mml('\\textminus')).toMatchSnapshot();
  });

  test('textmu', () => {
    expect(tex2mml('\\textmu')).toMatchSnapshot();
  });

  test('textohm', () => {
    expect(tex2mml('\\textohm')).toMatchSnapshot();
  });

  test('textonehalf', () => {
    expect(tex2mml('\\textonehalf')).toMatchSnapshot();
  });

  test('textonequarter', () => {
    expect(tex2mml('\\textonequarter')).toMatchSnapshot();
  });

  test('textonesuperior', () => {
    expect(tex2mml('\\textonesuperior')).toMatchSnapshot();
  });

  test('textpm', () => {
    expect(tex2mml('\\textpm')).toMatchSnapshot();
  });

  test('textrightarrow', () => {
    expect(tex2mml('\\textrightarrow')).toMatchSnapshot();
  });

  test('textsurd', () => {
    expect(tex2mml('\\textsurd')).toMatchSnapshot();
  });

  test('textthreequarters', () => {
    expect(tex2mml('\\textthreequarters')).toMatchSnapshot();
  });

  test('textthreesuperior', () => {
    expect(tex2mml('\\textthreesuperior')).toMatchSnapshot();
  });

  test('texttimes', () => {
    expect(tex2mml('\\texttimes')).toMatchSnapshot();
  });

  test('texttwosuperior', () => {
    expect(tex2mml('\\texttwosuperior')).toMatchSnapshot();
  });

  test('textuparrow', () => {
    expect(tex2mml('\\textuparrow')).toMatchSnapshot();
  });

  test('textborn', () => {
    expect(tex2mml('\\textborn')).toMatchSnapshot();
  });

  test('textdied', () => {
    expect(tex2mml('\\textdied')).toMatchSnapshot();
  });

  test('textdivorced', () => {
    expect(tex2mml('\\textdivorced')).toMatchSnapshot();
  });

  test('textmarried', () => {
    expect(tex2mml('\\textmarried')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Textcompwith Textmacros', () => {
  beforeEach(() => setupTex(['base', 'textmacros', 'textcomp']));

  test('textasciicircum', () => {
    expect(tex2mml('\\text{\\textasciicircum}')).toMatchSnapshot();
  });

  test('textcentoldstyle', () => {
    expect(tex2mml('\\text{\\textcentoldstyle}')).toMatchSnapshot();
  });

  test('textdollaroldstyle', () => {
    expect(tex2mml('\\text{\\textdollaroldstyle}')).toMatchSnapshot();
  });

  test('textzerooldstyle', () => {
    expect(tex2mml('\\text{\\textzerooldstyle}')).toMatchSnapshot();
  });

  test('textoneoldstyle', () => {
    expect(tex2mml('\\text{\\textoneoldstyle}')).toMatchSnapshot();
  });

  test('texttwooldstyle', () => {
    expect(tex2mml('\\text{\\texttwooldstyle}')).toMatchSnapshot();
  });

  test('textthreeoldstyle', () => {
    expect(tex2mml('\\text{\\textthreeoldstyle}')).toMatchSnapshot();
  });

  test('textfouroldstyle', () => {
    expect(tex2mml('\\text{\\textfouroldstyle}')).toMatchSnapshot();
  });

  test('textfiveoldstyle', () => {
    expect(tex2mml('\\text{\\textfiveoldstyle}')).toMatchSnapshot();
  });

  test('textsixoldstyle', () => {
    expect(tex2mml('\\text{\\textsixoldstyle}')).toMatchSnapshot();
  });

  test('textsevenoldstyle', () => {
    expect(tex2mml('\\text{\\textsevenoldstyle}')).toMatchSnapshot();
  });

  test('texteightoldstyle', () => {
    expect(tex2mml('\\text{\\texteightoldstyle}')).toMatchSnapshot();
  });

  test('textnineoldstyle', () => {
    expect(tex2mml('\\text{\\textnineoldstyle}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('textcomp'));
