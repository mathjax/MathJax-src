import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/textcomp/TextcompConfiguration';
import '#js/input/tex/textmacros/TextMacrosConfiguration';

beforeEach(() => setupTex(['base', 'textcomp']));

/**********************************************************************************/
/**********************************************************************************/

describe('Textcomp', () => {

  /********************************************************************************/

  test('textasciicircum', () => {
    toXmlMatch(
      tex2mml('\\textasciicircum'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciicircum" display="block">
         <mtext data-latex="\\textasciicircum">^</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciitilde', () => {
    toXmlMatch(
      tex2mml('\\textasciitilde'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciitilde" display="block">
         <mtext data-latex="\\textasciitilde">~</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasteriskcentered', () => {
    toXmlMatch(
      tex2mml('\\textasteriskcentered'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasteriskcentered" display="block">
         <mtext data-latex="\\textasteriskcentered">*</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbackslash', () => {
    toXmlMatch(
      tex2mml('\\textbackslash'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbackslash" display="block">
         <mtext data-latex="\\textbackslash">\\</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbar', () => {
    toXmlMatch(
      tex2mml('\\textbar'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbar" display="block">
         <mtext data-latex="\\textbar">|</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbraceleft', () => {
    toXmlMatch(
      tex2mml('\\textbraceleft'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbraceleft" display="block">
         <mtext data-latex="\\textbraceleft">{</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbraceright', () => {
    toXmlMatch(
      tex2mml('\\textbraceright'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbraceright" display="block">
         <mtext data-latex="\\textbraceright">}</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbullet', () => {
    toXmlMatch(
      tex2mml('\\textbullet'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbullet" display="block">
         <mtext data-latex="\\textbullet">&#x2022;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdagger', () => {
    toXmlMatch(
      tex2mml('\\textdagger'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdagger" display="block">
         <mtext data-latex="\\textdagger">&#x2020;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdaggerdbl', () => {
    toXmlMatch(
      tex2mml('\\textdaggerdbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdaggerdbl" display="block">
         <mtext data-latex="\\textdaggerdbl">&#x2021;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textellipsis', () => {
    toXmlMatch(
      tex2mml('\\textellipsis'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textellipsis" display="block">
         <mtext data-latex="\\textellipsis">&#x2026;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textemdash', () => {
    toXmlMatch(
      tex2mml('\\textemdash'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textemdash" display="block">
         <mtext data-latex="\\textemdash">&#x2014;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textendash', () => {
    toXmlMatch(
      tex2mml('\\textendash'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textendash" display="block">
         <mtext data-latex="\\textendash">&#x2013;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textexclamdown', () => {
    toXmlMatch(
      tex2mml('\\textexclamdown'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textexclamdown" display="block">
         <mtext data-latex="\\textexclamdown">&#x00A1;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textgreater', () => {
    toXmlMatch(
      tex2mml('\\textgreater'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textgreater" display="block">
         <mtext data-latex="\\textgreater">&#x003E;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textless', () => {
    toXmlMatch(
      tex2mml('\\textless'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textless" display="block">
         <mtext data-latex="\\textless">&#x003C;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textordfeminine', () => {
    toXmlMatch(
      tex2mml('\\textordfeminine'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textordfeminine" display="block">
         <mtext data-latex="\\textordfeminine">&#x00AA;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textordmasculine', () => {
    toXmlMatch(
      tex2mml('\\textordmasculine'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textordmasculine" display="block">
         <mtext data-latex="\\textordmasculine">&#x00BA;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textparagraph', () => {
    toXmlMatch(
      tex2mml('\\textparagraph'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textparagraph" display="block">
         <mtext data-latex="\\textparagraph">&#x00B6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textperiodcentered', () => {
    toXmlMatch(
      tex2mml('\\textperiodcentered'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textperiodcentered" display="block">
         <mtext data-latex="\\textperiodcentered">&#x00B7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textquestiondown', () => {
    toXmlMatch(
      tex2mml('\\textquestiondown'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textquestiondown" display="block">
         <mtext data-latex="\\textquestiondown">&#x00BF;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textquotedblleft', () => {
    toXmlMatch(
      tex2mml('\\textquotedblleft'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textquotedblleft" display="block">
         <mtext data-latex="\\textquotedblleft">&#x201C;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textquotedblright', () => {
    toXmlMatch(
      tex2mml('\\textquotedblright'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textquotedblright" display="block">
         <mtext data-latex="\\textquotedblright">&#x201D;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textquoteleft', () => {
    toXmlMatch(
      tex2mml('\\textquoteleft'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textquoteleft" display="block">
         <mtext data-latex="\\textquoteleft">&#x2018;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textquoteright', () => {
    toXmlMatch(
      tex2mml('\\textquoteright'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textquoteright" display="block">
         <mtext data-latex="\\textquoteright">&#x2019;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textsection', () => {
    toXmlMatch(
      tex2mml('\\textsection'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textsection" display="block">
         <mtext data-latex="\\textsection">&#x00A7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textunderscore', () => {
    toXmlMatch(
      tex2mml('\\textunderscore'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textunderscore" display="block">
         <mtext data-latex="\\textunderscore">&#x005F;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textvisiblespace', () => {
    toXmlMatch(
      tex2mml('\\textvisiblespace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textvisiblespace" display="block">
         <mtext data-latex="\\textvisiblespace">&#x2423;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textacutedbl', () => {
    toXmlMatch(
      tex2mml('\\textacutedbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textacutedbl" display="block">
         <mtext data-latex="\\textacutedbl">&#x02DD;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciiacute', () => {
    toXmlMatch(
      tex2mml('\\textasciiacute'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciiacute" display="block">
         <mtext data-latex="\\textasciiacute">&#x00B4;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciibreve', () => {
    toXmlMatch(
      tex2mml('\\textasciibreve'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciibreve" display="block">
         <mtext data-latex="\\textasciibreve">&#x02D8;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciicaron', () => {
    toXmlMatch(
      tex2mml('\\textasciicaron'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciicaron" display="block">
         <mtext data-latex="\\textasciicaron">&#x02C7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciidieresis', () => {
    toXmlMatch(
      tex2mml('\\textasciidieresis'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciidieresis" display="block">
         <mtext data-latex="\\textasciidieresis">&#x00A8;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textasciimacron', () => {
    toXmlMatch(
      tex2mml('\\textasciimacron'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textasciimacron" display="block">
         <mtext data-latex="\\textasciimacron">&#x00AF;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textgravedbl', () => {
    toXmlMatch(
      tex2mml('\\textgravedbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textgravedbl" display="block">
         <mtext data-latex="\\textgravedbl">&#x02F5;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texttildelow', () => {
    toXmlMatch(
      tex2mml('\\texttildelow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttildelow" display="block">
         <mtext data-latex="\\texttildelow">&#x02F7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbaht', () => {
    toXmlMatch(
      tex2mml('\\textbaht'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbaht" display="block">
         <mtext data-latex="\\textbaht">&#x0E3F;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcent', () => {
    toXmlMatch(
      tex2mml('\\textcent'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcent" display="block">
         <mtext data-latex="\\textcent">&#x00A2;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcolonmonetary', () => {
    toXmlMatch(
      tex2mml('\\textcolonmonetary'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolonmonetary" display="block">
         <mtext data-latex="\\textcolonmonetary">&#x20A1;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcurrency', () => {
    toXmlMatch(
      tex2mml('\\textcurrency'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcurrency" display="block">
         <mtext data-latex="\\textcurrency">&#x00A4;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdollar', () => {
    toXmlMatch(
      tex2mml('\\textdollar'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdollar" display="block">
         <mtext data-latex="\\textdollar">&#x0024;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdong', () => {
    toXmlMatch(
      tex2mml('\\textdong'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdong" display="block">
         <mtext data-latex="\\textdong">&#x20AB;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texteuro', () => {
    toXmlMatch(
      tex2mml('\\texteuro'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texteuro" display="block">
         <mtext data-latex="\\texteuro">&#x20AC;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textflorin', () => {
    toXmlMatch(
      tex2mml('\\textflorin'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textflorin" display="block">
         <mtext data-latex="\\textflorin">&#x0192;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textguarani', () => {
    toXmlMatch(
      tex2mml('\\textguarani'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textguarani" display="block">
         <mtext data-latex="\\textguarani">&#x20B2;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textlira', () => {
    toXmlMatch(
      tex2mml('\\textlira'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textlira" display="block">
         <mtext data-latex="\\textlira">&#x20A4;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textnaira', () => {
    toXmlMatch(
      tex2mml('\\textnaira'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textnaira" display="block">
         <mtext data-latex="\\textnaira">&#x20A6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textpeso', () => {
    toXmlMatch(
      tex2mml('\\textpeso'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textpeso" display="block">
         <mtext data-latex="\\textpeso">&#x20B1;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textsterling', () => {
    toXmlMatch(
      tex2mml('\\textsterling'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textsterling" display="block">
         <mtext data-latex="\\textsterling">&#x00A3;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textwon', () => {
    toXmlMatch(
      tex2mml('\\textwon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textwon" display="block">
         <mtext data-latex="\\textwon">&#x20A9;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textyen', () => {
    toXmlMatch(
      tex2mml('\\textyen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textyen" display="block">
         <mtext data-latex="\\textyen">&#x00A5;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcircledP', () => {
    toXmlMatch(
      tex2mml('\\textcircledP'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcircledP" display="block">
         <mtext data-latex="\\textcircledP">&#x2117;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcompwordmark', () => {
    toXmlMatch(
      tex2mml('\\textcompwordmark'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcompwordmark" display="block">
         <mtext data-latex="\\textcompwordmark">&#x200C;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcopyleft', () => {
    toXmlMatch(
      tex2mml('\\textcopyleft'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcopyleft" display="block">
         <mtext data-latex="\\textcopyleft">&#x1F12F;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcopyright', () => {
    toXmlMatch(
      tex2mml('\\textcopyright'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcopyright" display="block">
         <mtext data-latex="\\textcopyright">&#x00A9;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textregistered', () => {
    toXmlMatch(
      tex2mml('\\textregistered'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textregistered" display="block">
         <mtext data-latex="\\textregistered">&#x00AE;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textservicemark', () => {
    toXmlMatch(
      tex2mml('\\textservicemark'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textservicemark" display="block">
         <mtext data-latex="\\textservicemark">&#x2120;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texttrademark', () => {
    toXmlMatch(
      tex2mml('\\texttrademark'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttrademark" display="block">
         <mtext data-latex="\\texttrademark">&#x2122;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbardbl', () => {
    toXmlMatch(
      tex2mml('\\textbardbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbardbl" display="block">
         <mtext data-latex="\\textbardbl">&#x2016;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbigcircle', () => {
    toXmlMatch(
      tex2mml('\\textbigcircle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbigcircle" display="block">
         <mtext data-latex="\\textbigcircle">&#x25EF;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textblank', () => {
    toXmlMatch(
      tex2mml('\\textblank'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textblank" display="block">
         <mtext data-latex="\\textblank">&#x2422;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbrokenbar', () => {
    toXmlMatch(
      tex2mml('\\textbrokenbar'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbrokenbar" display="block">
         <mtext data-latex="\\textbrokenbar">&#x00A6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdiscount', () => {
    toXmlMatch(
      tex2mml('\\textdiscount'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdiscount" display="block">
         <mtext data-latex="\\textdiscount">&#x2052;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textestimated', () => {
    toXmlMatch(
      tex2mml('\\textestimated'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textestimated" display="block">
         <mtext data-latex="\\textestimated">&#x212E;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textinterrobang', () => {
    toXmlMatch(
      tex2mml('\\textinterrobang'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textinterrobang" display="block">
         <mtext data-latex="\\textinterrobang">&#x203D;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textinterrobangdown', () => {
    toXmlMatch(
      tex2mml('\\textinterrobangdown'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textinterrobangdown" display="block">
         <mtext data-latex="\\textinterrobangdown">&#x2E18;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textmusicalnote', () => {
    toXmlMatch(
      tex2mml('\\textmusicalnote'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textmusicalnote" display="block">
         <mtext data-latex="\\textmusicalnote">&#x266A;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textnumero', () => {
    toXmlMatch(
      tex2mml('\\textnumero'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textnumero" display="block">
         <mtext data-latex="\\textnumero">&#x2116;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textopenbullet', () => {
    toXmlMatch(
      tex2mml('\\textopenbullet'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textopenbullet" display="block">
         <mtext data-latex="\\textopenbullet">&#x25E6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textpertenthousand', () => {
    toXmlMatch(
      tex2mml('\\textpertenthousand'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textpertenthousand" display="block">
         <mtext data-latex="\\textpertenthousand">&#x2031;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textperthousand', () => {
    toXmlMatch(
      tex2mml('\\textperthousand'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textperthousand" display="block">
         <mtext data-latex="\\textperthousand">&#x2030;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrecipe', () => {
    toXmlMatch(
      tex2mml('\\textrecipe'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrecipe" display="block">
         <mtext data-latex="\\textrecipe">&#x211E;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textreferencemark', () => {
    toXmlMatch(
      tex2mml('\\textreferencemark'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textreferencemark" display="block">
         <mtext data-latex="\\textreferencemark">&#x203B;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textlangle', () => {
    toXmlMatch(
      tex2mml('\\textlangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textlangle" display="block">
         <mtext data-latex="\\textlangle">&#x2329;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrangle', () => {
    toXmlMatch(
      tex2mml('\\textrangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrangle" display="block">
         <mtext data-latex="\\textrangle">&#x232A;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textlbrackdbl', () => {
    toXmlMatch(
      tex2mml('\\textlbrackdbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textlbrackdbl" display="block">
         <mtext data-latex="\\textlbrackdbl">&#x27E6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrbrackdbl', () => {
    toXmlMatch(
      tex2mml('\\textrbrackdbl'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrbrackdbl" display="block">
         <mtext data-latex="\\textrbrackdbl">&#x27E7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textlquill', () => {
    toXmlMatch(
      tex2mml('\\textlquill'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textlquill" display="block">
         <mtext data-latex="\\textlquill">&#x2045;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrquill', () => {
    toXmlMatch(
      tex2mml('\\textrquill'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrquill" display="block">
         <mtext data-latex="\\textrquill">&#x2046;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcelsius', () => {
    toXmlMatch(
      tex2mml('\\textcelsius'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcelsius" display="block">
         <mtext data-latex="\\textcelsius">&#x2103;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdegree', () => {
    toXmlMatch(
      tex2mml('\\textdegree'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdegree" display="block">
         <mtext data-latex="\\textdegree">&#x00B0;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdiv', () => {
    toXmlMatch(
      tex2mml('\\textdiv'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdiv" display="block">
         <mtext data-latex="\\textdiv">&#x00F7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdownarrow', () => {
    toXmlMatch(
      tex2mml('\\textdownarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdownarrow" display="block">
         <mtext data-latex="\\textdownarrow">&#x2193;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textfractionsolidus', () => {
    toXmlMatch(
      tex2mml('\\textfractionsolidus'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textfractionsolidus" display="block">
         <mtext data-latex="\\textfractionsolidus">&#x2044;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textleftarrow', () => {
    toXmlMatch(
      tex2mml('\\textleftarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textleftarrow" display="block">
         <mtext data-latex="\\textleftarrow">&#x2190;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textlnot', () => {
    toXmlMatch(
      tex2mml('\\textlnot'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textlnot" display="block">
         <mtext data-latex="\\textlnot">&#x00AC;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textmho', () => {
    toXmlMatch(
      tex2mml('\\textmho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textmho" display="block">
         <mtext data-latex="\\textmho">&#x2127;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textminus', () => {
    toXmlMatch(
      tex2mml('\\textminus'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textminus" display="block">
         <mtext data-latex="\\textminus">&#x2212;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textmu', () => {
    toXmlMatch(
      tex2mml('\\textmu'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textmu" display="block">
         <mtext data-latex="\\textmu">&#x00B5;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textohm', () => {
    toXmlMatch(
      tex2mml('\\textohm'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textohm" display="block">
         <mtext data-latex="\\textohm">&#x2126;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textonehalf', () => {
    toXmlMatch(
      tex2mml('\\textonehalf'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textonehalf" display="block">
         <mtext data-latex="\\textonehalf">&#x00BD;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textonequarter', () => {
    toXmlMatch(
      tex2mml('\\textonequarter'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textonequarter" display="block">
         <mtext data-latex="\\textonequarter">&#x00BC;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textonesuperior', () => {
    toXmlMatch(
      tex2mml('\\textonesuperior'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textonesuperior" display="block">
         <mtext data-latex="\\textonesuperior">&#x00B9;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textpm', () => {
    toXmlMatch(
      tex2mml('\\textpm'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textpm" display="block">
         <mtext data-latex="\\textpm">&#x00B1;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrightarrow', () => {
    toXmlMatch(
      tex2mml('\\textrightarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrightarrow" display="block">
         <mtext data-latex="\\textrightarrow">&#x2192;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textsurd', () => {
    toXmlMatch(
      tex2mml('\\textsurd'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textsurd" display="block">
         <mtext data-latex="\\textsurd">&#x221A;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textthreequarters', () => {
    toXmlMatch(
      tex2mml('\\textthreequarters'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textthreequarters" display="block">
         <mtext data-latex="\\textthreequarters">&#x00BE;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textthreesuperior', () => {
    toXmlMatch(
      tex2mml('\\textthreesuperior'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textthreesuperior" display="block">
         <mtext data-latex="\\textthreesuperior">&#x00B3;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texttimes', () => {
    toXmlMatch(
      tex2mml('\\texttimes'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttimes" display="block">
         <mtext data-latex="\\texttimes">&#x00D7;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texttwosuperior', () => {
    toXmlMatch(
      tex2mml('\\texttwosuperior'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttwosuperior" display="block">
         <mtext data-latex="\\texttwosuperior">&#x00B2;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textuparrow', () => {
    toXmlMatch(
      tex2mml('\\textuparrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textuparrow" display="block">
         <mtext data-latex="\\textuparrow">&#x2191;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textborn', () => {
    toXmlMatch(
      tex2mml('\\textborn'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textborn" display="block">
         <mtext data-latex="\\textborn">&#x002A;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdied', () => {
    toXmlMatch(
      tex2mml('\\textdied'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdied" display="block">
         <mtext data-latex="\\textdied">&#x2020;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdivorced', () => {
    toXmlMatch(
      tex2mml('\\textdivorced'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textdivorced" display="block">
         <mtext data-latex="\\textdivorced">&#x26AE;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textmarried', () => {
    toXmlMatch(
      tex2mml('\\textmarried'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textmarried" display="block">
         <mtext data-latex="\\textmarried">&#x26AD;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textcompwith Textmacros', () => {
  beforeEach(() => setupTex(['base', 'textmacros', 'textcomp']));

  /********************************************************************************/

  test('textasciicircum', () => {
    toXmlMatch(
      tex2mml('\\text{\\textasciicircum}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textasciicircum}" display="block">
         <mtext data-latex="\\text{\\textasciicircum}">^</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textcentoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textcentoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textcentoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textcentoldstyle}">&#xA2;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textdollaroldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textdollaroldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textdollaroldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textdollaroldstyle}">$</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textzerooldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textzerooldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textzerooldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textzerooldstyle}">0</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textoneoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textoneoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textoneoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textoneoldstyle}">1</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texttwooldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\texttwooldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\texttwooldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\texttwooldstyle}">2</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textthreeoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textthreeoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textthreeoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textthreeoldstyle}">3</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textfouroldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textfouroldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textfouroldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textfouroldstyle}">4</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textfiveoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textfiveoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textfiveoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textfiveoldstyle}">5</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textsixoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textsixoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textsixoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textsixoldstyle}">6</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textsevenoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textsevenoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textsevenoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textsevenoldstyle}">7</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('texteightoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\texteightoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\texteightoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\texteightoldstyle}">8</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textnineoldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{\\textnineoldstyle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textnineoldstyle}" display="block">
         <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal" data-latex="\\text{\\textnineoldstyle}">9</mtext>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('textcomp'));
