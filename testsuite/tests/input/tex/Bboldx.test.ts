import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/bboldx/BboldxConfiguration';
import '#js/input/tex/textmacros/TextMacrosConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx', () => {

  beforeEach(() => setupTex(['base', 'bboldx']));

  /********************************************************************************/

  test('mathbb', () => {
    toXmlMatch(
      tex2mml('\\mathbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    toXmlMatch(
      tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx-bold" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('dotless', () => {
    toXmlMatch(
      tex2mml('\\imathbb\\jmathbb\\imathbfbb\\jmathbfbb'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\imathbb\\jmathbb\\imathbfbb\\jmathbfbb" display="block">
         <mi data-mjx-variant="-bboldx" data-latex="\\bbdotlessi">&#x131;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbdotlessj">&#x237;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbdotlessi">&#x131;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbdotlessj">&#x237;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('UC Greek', () => {
    toXmlMatch(
      tex2mml('\\bbGamma\\bbDelta\\bbTheta\\bbLambda\\bbXi\\bbPi\\bbSigma\\bbUpsilon\\bbPhi\\bbPsi\\bbOmega'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbGamma\\bbDelta\\bbTheta\\bbLambda\\bbXi\\bbPi\\bbSigma\\bbUpsilon\\bbPhi\\bbPsi\\bbOmega" display="block">
         <mi data-mjx-variant="-bboldx" data-latex="\\bbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbDelta">&#x2206;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbTheta">&#x398;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbLambda">&#x39B;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbXi">&#x39E;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbPi">&#x3A0;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbSigma">&#x3A3;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbUpsilon">&#x3A5;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbPhi">&#x3A6;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbPsi">&#x3A8;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbOmega">&#x2126;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek 1', () => {
    toXmlMatch(
      tex2mml(
        '\\bbalpha\\bbbeta\\bbgamma\\bbdelta\\bbepsilon\\bbzeta\\bbeta\\bbtheta\\bbiota\\bbkappa\\bblambda'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbalpha\\bbbeta\\bbgamma\\bbdelta\\bbepsilon\\bbzeta\\bbeta\\bbtheta\\bbiota\\bbkappa\\bblambda" display="block">
         <mi data-mjx-variant="-bboldx" data-latex="\\bbalpha">&#x3B1;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbbeta">&#x3B2;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbgamma">&#x3B3;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbdelta">&#x3B4;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbepsilon">&#x3B5;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbzeta">&#x3B6;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbeta">&#x3B7;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbtheta">&#x3B8;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbiota">&#x3B9;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbkappa">&#x3BA;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bblambda">&#x3BB;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek 2', () => {
    toXmlMatch(
      tex2mml(
        '\\bbmu\\bbnu\\bbxi\\bbpi\\bbrho\\bbsigma\\bbtau\\bbupsilon\\bbphi\\bbchi\\bbpsi\\bbomega'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbmu\\bbnu\\bbxi\\bbpi\\bbrho\\bbsigma\\bbtau\\bbupsilon\\bbphi\\bbchi\\bbpsi\\bbomega" display="block">
         <mi data-mjx-variant="-bboldx" data-latex="\\bbmu">&#xB5;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbnu">&#x3BD;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbxi">&#x3BE;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbpi">&#x3C0;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbrho">&#x3C1;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbsigma">&#x3C3;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbtau">&#x3C4;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbupsilon">&#x3C5;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbphi">&#x3C6;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbchi">&#x3C7;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbpsi">&#x3C8;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bbomega">&#x3C9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('UC Greek Bf', () => {
    toXmlMatch(
      tex2mml(
        '\\bfbbGamma\\bfbbDelta\\bfbbTheta\\bfbbLambda\\bfbbXi\\bfbbPi\\bfbbSigma\\bfbbUpsilon\\bfbbPhi\\bfbbPsi\\bfbbOmega'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bfbbGamma\\bfbbDelta\\bfbbTheta\\bfbbLambda\\bfbbXi\\bfbbPi\\bfbbSigma\\bfbbUpsilon\\bfbbPhi\\bfbbPsi\\bfbbOmega" display="block">
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbDelta">&#x2206;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbTheta">&#x398;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbLambda">&#x39B;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbXi">&#x39E;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbPi">&#x3A0;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbSigma">&#x3A3;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbUpsilon">&#x3A5;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbPhi">&#x3A6;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbPsi">&#x3A8;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbOmega">&#x2126;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek Bf 1', () => {
    toXmlMatch(
      tex2mml(
        '\\bfbbalpha\\bfbbbeta\\bfbbgamma\\bfbbdelta\\bfbbepsilon\\bfbbzeta\\bfbbeta\\bfbbtheta\\bfbbiota\\bfbbkappa\\bfbblambda'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bfbbalpha\\bfbbbeta\\bfbbgamma\\bfbbdelta\\bfbbepsilon\\bfbbzeta\\bfbbeta\\bfbbtheta\\bfbbiota\\bfbbkappa\\bfbblambda" display="block">
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbalpha">&#x3B1;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbbeta">&#x3B2;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbgamma">&#x3B3;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbdelta">&#x3B4;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbepsilon">&#x3B5;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbzeta">&#x3B6;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbeta">&#x3B7;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbtheta">&#x3B8;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbiota">&#x3B9;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbkappa">&#x3BA;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbblambda">&#x3BF;BB</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek Bf 2', () => {
    toXmlMatch(
      tex2mml(
        '\\bfbbmu\\bfbbnu\\bfbbxi\\bfbbpi\\bfbbrho\\bfbbsigma\\bfbbtau\\bfbbupsilon\\bfbbphi\\bfbbchi\\bfbbpsi\\bfbbomega'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bfbbmu\\bfbbnu\\bfbbxi\\bfbbpi\\bfbbrho\\bfbbsigma\\bfbbtau\\bfbbupsilon\\bfbbphi\\bfbbchi\\bfbbpsi\\bfbbomega" display="block">
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbmu">&#xB5;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbnu">&#x3BD;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbxi">&#x3BE;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbpi">&#x3C0;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbrho">&#x3C1;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbsigma">&#x3C3;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbtau">&#x3C4;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbupsilon">&#x3C5;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbphi">&#x3C6;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbchi">&#x3C7;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbpsi">&#x3C8;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbomega">&#x3C9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Delimiters', () => {
    toXmlMatch(
      tex2mml('\\bbLparen\\bbRparen\\bbLbrack\\bbRbrack\\bbLangle\\bbRangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbLparen\\bbRparen\\bbLbrack\\bbRbrack\\bbLangle\\bbRangle" display="block">
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbLparen">(</mo>
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbRparen">)</mo>
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbLbrack">[</mo>
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbRbrack">]</mo>
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbLangle">&#x2329;</mo>
         <mo data-mjx-variant="-bboldx" stretchy="false" data-latex="\\bbRangle">&#x232A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('Delimiters Bf', () => {
    toXmlMatch(
      tex2mml('\\bfbbLparen\\bfbbRparen\\bfbbLbrack\\bfbbRbrack\\bfbbLangle\\bfbbRangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bfbbLparen\\bfbbRparen\\bfbbLbrack\\bfbbRbrack\\bfbbLangle\\bfbbRangle" display="block">
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbLparen">(</mo>
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbRparen">)</mo>
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbLbrack">[</mo>
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbRbrack">]</mo>
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbLangle">&#x2329;</mo>
         <mo data-mjx-variant="-bboldx-bold" stretchy="false" data-latex="\\bfbbRangle">&#x232A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx Text', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros']));

  /********************************************************************************/

  test('textbb', () => {
    toXmlMatch(
      tex2mml('\\text{\\textbb{Aa\u{393}\u{3B3}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textbb{Aa&#x393;&#x3B3;}}" display="block">
         <mtext data-mjx-variant="-bboldx" data-latex="\\text{\\textbb{Aa&#x393;&#x3B3;}}">Aa&#x393;&#x3B3;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('textbfbb', () => {
    toXmlMatch(
      tex2mml('\\text{\\textbfbb{Aa\u{393}\u{3B3}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\textbfbb{Aa&#x393;&#x3B3;}}" display="block">
         <mtext data-mjx-variant="-bboldx-bold" data-latex="\\text{\\textbfbb{Aa&#x393;&#x3B3;}}">Aa&#x393;&#x3B3;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('dotless', () => {
    toXmlMatch(
      tex2mml('\\text{\\itextbb\\jtextbb\\itextbfbb\\jtextbfbb}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\itextbb\\jtextbb\\itextbfbb\\jtextbfbb}" display="block">
         <mrow data-latex="\\text{\\itextbb\\jtextbb\\itextbfbb\\jtextbfbb}">
           <mi data-mjx-variant="-bboldx">&#x131;</mi>
           <mi data-mjx-variant="-bboldx">&#x237;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x131;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x237;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('UC Greek', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbbGamma\\txtbbDelta\\txtbbTheta\\txtbbLambda\\txtbbXi\\txtbbPi\\txtbbSigma\\txtbbUpsilon\\txtbbPhi\\txtbbPsi\\txtbbOmega}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbbGamma\\txtbbDelta\\txtbbTheta\\txtbbLambda\\txtbbXi\\txtbbPi\\txtbbSigma\\txtbbUpsilon\\txtbbPhi\\txtbbPsi\\txtbbOmega}" display="block">
         <mrow data-latex="\\text{\\txtbbGamma\\txtbbDelta\\txtbbTheta\\txtbbLambda\\txtbbXi\\txtbbPi\\txtbbSigma\\txtbbUpsilon\\txtbbPhi\\txtbbPsi\\txtbbOmega}">
           <mi data-mjx-variant="-bboldx">&#x393;</mi>
           <mi data-mjx-variant="-bboldx">&#x2206;</mi>
           <mi data-mjx-variant="-bboldx">&#x398;</mi>
           <mi data-mjx-variant="-bboldx">&#x39B;</mi>
           <mi data-mjx-variant="-bboldx">&#x39E;</mi>
           <mi data-mjx-variant="-bboldx">&#x3A0;</mi>
           <mi data-mjx-variant="-bboldx">&#x3A3;</mi>
           <mi data-mjx-variant="-bboldx">&#x3A5;</mi>
           <mi data-mjx-variant="-bboldx">&#x3A6;</mi>
           <mi data-mjx-variant="-bboldx">&#x3A8;</mi>
           <mi data-mjx-variant="-bboldx">&#x2126;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek 1', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbbalpha\\txtbbbeta\\txtbbgamma\\txtbbdelta\\txtbbepsilon\\txtbbzeta\\txtbbeta\\txtbbtheta\\txtbbiota\\txtbbkappa\\txtbblambda}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbbalpha\\txtbbbeta\\txtbbgamma\\txtbbdelta\\txtbbepsilon\\txtbbzeta\\txtbbeta\\txtbbtheta\\txtbbiota\\txtbbkappa\\txtbblambda}" display="block">
         <mrow data-latex="\\text{\\txtbbalpha\\txtbbbeta\\txtbbgamma\\txtbbdelta\\txtbbepsilon\\txtbbzeta\\txtbbeta\\txtbbtheta\\txtbbiota\\txtbbkappa\\txtbblambda}">
           <mi data-mjx-variant="-bboldx">&#x3B1;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B2;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B3;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B4;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B5;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B6;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B7;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B8;</mi>
           <mi data-mjx-variant="-bboldx">&#x3B9;</mi>
           <mi data-mjx-variant="-bboldx">&#x3BA;</mi>
           <mi data-mjx-variant="-bboldx">&#x3BB;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek 2', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbbmu\\txtbbnu\\txtbbxi\\txtbbpi\\txtbbrho\\txtbbsigma\\txtbbtau\\txtbbupsilon\\txtbbphi\\txtbbchi\\txtbbpsi\\txtbbomega}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbbmu\\txtbbnu\\txtbbxi\\txtbbpi\\txtbbrho\\txtbbsigma\\txtbbtau\\txtbbupsilon\\txtbbphi\\txtbbchi\\txtbbpsi\\txtbbomega}" display="block">
         <mrow data-latex="\\text{\\txtbbmu\\txtbbnu\\txtbbxi\\txtbbpi\\txtbbrho\\txtbbsigma\\txtbbtau\\txtbbupsilon\\txtbbphi\\txtbbchi\\txtbbpsi\\txtbbomega}">
           <mi data-mjx-variant="-bboldx">&#xB5;</mi>
           <mi data-mjx-variant="-bboldx">&#x3BD;</mi>
           <mi data-mjx-variant="-bboldx">&#x3BE;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C0;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C1;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C3;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C4;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C5;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C6;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C7;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C8;</mi>
           <mi data-mjx-variant="-bboldx">&#x3C9;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('UC Greek Bf', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbfbbGamma\\txtbfbbDelta\\txtbfbbTheta\\txtbfbbLambda\\txtbfbbXi\\txtbfbbPi\\txtbfbbSigma\\txtbfbbUpsilon\\txtbfbbPhi\\txtbfbbPsi\\txtbfbbOmega}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbfbbGamma\\txtbfbbDelta\\txtbfbbTheta\\txtbfbbLambda\\txtbfbbXi\\txtbfbbPi\\txtbfbbSigma\\txtbfbbUpsilon\\txtbfbbPhi\\txtbfbbPsi\\txtbfbbOmega}" display="block">
         <mrow data-latex="\\text{\\txtbfbbGamma\\txtbfbbDelta\\txtbfbbTheta\\txtbfbbLambda\\txtbfbbXi\\txtbfbbPi\\txtbfbbSigma\\txtbfbbUpsilon\\txtbfbbPhi\\txtbfbbPsi\\txtbfbbOmega}">
           <mi data-mjx-variant="-bboldx-bold">&#x393;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x2206;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x398;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x39B;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x39E;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3A0;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3A3;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3A5;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3A6;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3A8;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x2126;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek Bf 1', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbfbbalpha\\txtbfbbbeta\\txtbfbbgamma\\txtbfbbdelta\\txtbfbbepsilon\\txtbfbbzeta\\txtbfbbeta\\txtbfbbtheta\\txtbfbbiota\\txtbfbbkappa\\txtbfbblambda}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbfbbalpha\\txtbfbbbeta\\txtbfbbgamma\\txtbfbbdelta\\txtbfbbepsilon\\txtbfbbzeta\\txtbfbbeta\\txtbfbbtheta\\txtbfbbiota\\txtbfbbkappa\\txtbfbblambda}" display="block">
         <mrow data-latex="\\text{\\txtbfbbalpha\\txtbfbbbeta\\txtbfbbgamma\\txtbfbbdelta\\txtbfbbepsilon\\txtbfbbzeta\\txtbfbbeta\\txtbfbbtheta\\txtbfbbiota\\txtbfbbkappa\\txtbfbblambda}">
           <mi data-mjx-variant="-bboldx-bold">&#x3B1;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B2;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B3;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B4;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B5;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B6;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B7;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B8;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3B9;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3BA;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3BB;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('LC Greek Bf 2', () => {
    toXmlMatch(
      tex2mml(
        '\\text{\\txtbfbbmu\\txtbfbbnu\\txtbfbbxi\\txtbfbbpi\\txtbfbbrho\\txtbfbbsigma\\txtbfbbtau\\txtbfbbupsilon\\txtbfbbphi\\txtbfbbchi\\txtbfbbpsi\\txtbfbbomega}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbfbbmu\\txtbfbbnu\\txtbfbbxi\\txtbfbbpi\\txtbfbbrho\\txtbfbbsigma\\txtbfbbtau\\txtbfbbupsilon\\txtbfbbphi\\txtbfbbchi\\txtbfbbpsi\\txtbfbbomega}" display="block">
         <mrow data-latex="\\text{\\txtbfbbmu\\txtbfbbnu\\txtbfbbxi\\txtbfbbpi\\txtbfbbrho\\txtbfbbsigma\\txtbfbbtau\\txtbfbbupsilon\\txtbfbbphi\\txtbfbbchi\\txtbfbbpsi\\txtbfbbomega}">
           <mi data-mjx-variant="-bboldx-bold">&#xB5;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3BD;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3BE;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C0;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C1;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C3;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C4;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C5;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C6;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C7;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C8;</mi>
           <mi data-mjx-variant="-bboldx-bold">&#x3C9;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Delimiters', () => {
    toXmlMatch(
      tex2mml('\\text{\\txtbbLparen\\txtbbRparen\\txtbbLbrack\\txtbbRbrack\\txtbbLangle\\txtbbRangle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbbLparen\\txtbbRparen\\txtbbLbrack\\txtbbRbrack\\txtbbLangle\\txtbbRangle}" display="block">
         <mrow data-latex="\\text{\\txtbbLparen\\txtbbRparen\\txtbbLbrack\\txtbbRbrack\\txtbbLangle\\txtbbRangle}">
           <mo data-mjx-variant="-bboldx" stretchy="false">(</mo>
           <mo data-mjx-variant="-bboldx" stretchy="false">)</mo>
           <mo data-mjx-variant="-bboldx" stretchy="false">[</mo>
           <mo data-mjx-variant="-bboldx" stretchy="false">]</mo>
           <mo data-mjx-variant="-bboldx" stretchy="false">&#x2329;</mo>
           <mo data-mjx-variant="-bboldx" stretchy="false">&#x232A;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Delimiters Bf', () => {
    toXmlMatch(
      tex2mml('\\text{\\txtbfbbLparen\\txtbfbbRparen\\txtbfbbLbrack\\txtbfbbRbrack\\txtbfbbLangle\\txtbfbbRangle}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\txtbfbbLparen\\txtbfbbRparen\\txtbfbbLbrack\\txtbfbbRbrack\\txtbfbbLangle\\txtbfbbRangle}" display="block">
         <mrow data-latex="\\text{\\txtbfbbLparen\\txtbfbbRparen\\txtbfbbLbrack\\txtbfbbRbrack\\txtbfbbLangle\\txtbfbbRangle}">
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">(</mo>
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">)</mo>
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">[</mo>
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">]</mo>
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">&#x2329;</mo>
           <mo data-mjx-variant="-bboldx-bold" stretchy="false">&#x232A;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx light', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros'], {bboldx: {light: true}}));

  /********************************************************************************/

  test('mathbb', () => {
    toXmlMatch(
      tex2mml('\\mathbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx-light" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx-light" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx-light" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    toXmlMatch(
      tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Some Greek', () => {
    toXmlMatch(
      tex2mml('\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma" display="block">
         <mi data-mjx-variant="-bboldx-light" data-latex="\\bbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx-light" data-latex="\\bbgamma">&#x3B3;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bfbbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx" data-latex="\\bfbbgamma">&#x3B3;</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx bfbb', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros'], {bboldx: {bfbb: true}}));

  /********************************************************************************/

  test('mathbb', () => {
    toXmlMatch(
      tex2mml('\\mathbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx-bold" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    toXmlMatch(
      tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbfbb{Aa&#x393;&#x3B3;}">
           <mi data-mjx-variant="-bboldx-bold" data-latex="a">Aa</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x393;">&#x393;</mi>
           <mi data-mjx-variant="-bboldx-bold" data-latex="&#x3B3;">&#x3B3;</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Some Greek', () => {
    toXmlMatch(
      tex2mml('\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma" display="block">
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bbgamma">&#x3B3;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbGamma">&#x393;</mi>
         <mi data-mjx-variant="-bboldx-bold" data-latex="\\bfbbgamma">&#x3B3;</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => {getTokens('bboldx'); getTokens('text-bboldx')});
