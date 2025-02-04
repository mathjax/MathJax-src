import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/upgreek/UpgreekConfiguration';

beforeEach(() => setupTex(['base', 'upgreek']));

/**********************************************************************************/
/**********************************************************************************/

describe('Upgreek', () => {

  /********************************************************************************/

  test('upalpha', () => {
    toXmlMatch(
      tex2mml('\\upalpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upalpha" display="block">
         <mi mathvariant="normal" data-latex="\\upalpha">&#x3B1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upbeta', () => {
    toXmlMatch(
      tex2mml('\\upbeta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upbeta" display="block">
         <mi mathvariant="normal" data-latex="\\upbeta">&#x03B2;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upgamma', () => {
    toXmlMatch(
      tex2mml('\\upgamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upgamma" display="block">
         <mi mathvariant="normal" data-latex="\\upgamma">&#x03B3;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('updelta', () => {
    toXmlMatch(
      tex2mml('\\updelta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\updelta" display="block">
         <mi mathvariant="normal" data-latex="\\updelta">&#x03B4;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upepsilon', () => {
    toXmlMatch(
      tex2mml('\\upepsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upepsilon" display="block">
         <mi mathvariant="normal" data-latex="\\upepsilon">&#x03F5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upzeta', () => {
    toXmlMatch(
      tex2mml('\\upzeta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upzeta" display="block">
         <mi mathvariant="normal" data-latex="\\upzeta">&#x03B6;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upeta', () => {
    toXmlMatch(
      tex2mml('\\upeta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upeta" display="block">
         <mi mathvariant="normal" data-latex="\\upeta">&#x03B7;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uptheta', () => {
    toXmlMatch(
      tex2mml('\\uptheta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uptheta" display="block">
         <mi mathvariant="normal" data-latex="\\uptheta">&#x03B8;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upiota', () => {
    toXmlMatch(
      tex2mml('\\upiota'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upiota" display="block">
         <mi mathvariant="normal" data-latex="\\upiota">&#x03B9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upkappa', () => {
    toXmlMatch(
      tex2mml('\\upkappa'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upkappa" display="block">
         <mi mathvariant="normal" data-latex="\\upkappa">&#x03BA;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uplambda', () => {
    toXmlMatch(
      tex2mml('\\uplambda'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uplambda" display="block">
         <mi mathvariant="normal" data-latex="\\uplambda">&#x03BB;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upmu', () => {
    toXmlMatch(
      tex2mml('\\upmu'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upmu" display="block">
         <mi mathvariant="normal" data-latex="\\upmu">&#x03BC;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upnu', () => {
    toXmlMatch(
      tex2mml('\\upnu'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upnu" display="block">
         <mi mathvariant="normal" data-latex="\\upnu">&#x03BD;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upxi', () => {
    toXmlMatch(
      tex2mml('\\upxi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upxi" display="block">
         <mi mathvariant="normal" data-latex="\\upxi">&#x03BE;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upomicron', () => {
    toXmlMatch(
      tex2mml('\\upomicron'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upomicron" display="block">
         <mi mathvariant="normal" data-latex="\\upomicron">&#x03BF;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uppi', () => {
    toXmlMatch(
      tex2mml('\\uppi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uppi" display="block">
         <mi mathvariant="normal" data-latex="\\uppi">&#x03C0;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uprho', () => {
    toXmlMatch(
      tex2mml('\\uprho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uprho" display="block">
         <mi mathvariant="normal" data-latex="\\uprho">&#x03C1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upsigma', () => {
    toXmlMatch(
      tex2mml('\\upsigma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upsigma" display="block">
         <mi mathvariant="normal" data-latex="\\upsigma">&#x03C3;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uptau', () => {
    toXmlMatch(
      tex2mml('\\uptau'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uptau" display="block">
         <mi mathvariant="normal" data-latex="\\uptau">&#x03C4;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upupsilon', () => {
    toXmlMatch(
      tex2mml('\\upupsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upupsilon" display="block">
         <mi mathvariant="normal" data-latex="\\upupsilon">&#x03C5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upphi', () => {
    toXmlMatch(
      tex2mml('\\upphi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upphi" display="block">
         <mi mathvariant="normal" data-latex="\\upphi">&#x03D5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upchi', () => {
    toXmlMatch(
      tex2mml('\\upchi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upchi" display="block">
         <mi mathvariant="normal" data-latex="\\upchi">&#x03C7;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('uppsi', () => {
    toXmlMatch(
      tex2mml('\\uppsi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uppsi" display="block">
         <mi mathvariant="normal" data-latex="\\uppsi">&#x03C8;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upomega', () => {
    toXmlMatch(
      tex2mml('\\upomega'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upomega" display="block">
         <mi mathvariant="normal" data-latex="\\upomega">&#x03C9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvarepsilon', () => {
    toXmlMatch(
      tex2mml('\\upvarepsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvarepsilon" display="block">
         <mi mathvariant="normal" data-latex="\\upvarepsilon">&#x03B5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvartheta', () => {
    toXmlMatch(
      tex2mml('\\upvartheta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvartheta" display="block">
         <mi mathvariant="normal" data-latex="\\upvartheta">&#x03D1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvarpi', () => {
    toXmlMatch(
      tex2mml('\\upvarpi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvarpi" display="block">
         <mi mathvariant="normal" data-latex="\\upvarpi">&#x03D6;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvarrho', () => {
    toXmlMatch(
      tex2mml('\\upvarrho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvarrho" display="block">
         <mi mathvariant="normal" data-latex="\\upvarrho">&#x03F1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvarsigma', () => {
    toXmlMatch(
      tex2mml('\\upvarsigma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvarsigma" display="block">
         <mi mathvariant="normal" data-latex="\\upvarsigma">&#x03C2;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('upvarphi', () => {
    toXmlMatch(
      tex2mml('\\upvarphi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\upvarphi" display="block">
         <mi mathvariant="normal" data-latex="\\upvarphi">&#x03C6;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upgamma', () => {
    toXmlMatch(
      tex2mml('\\Upgamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upgamma" display="block">
         <mi mathvariant="normal" data-latex="\\Upgamma">&#x0393;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Updelta', () => {
    toXmlMatch(
      tex2mml('\\Updelta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Updelta" display="block">
         <mi mathvariant="normal" data-latex="\\Updelta">&#x0394;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Uptheta', () => {
    toXmlMatch(
      tex2mml('\\Uptheta'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Uptheta" display="block">
         <mi mathvariant="normal" data-latex="\\Uptheta">&#x0398;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Uplambda', () => {
    toXmlMatch(
      tex2mml('\\Uplambda'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Uplambda" display="block">
         <mi mathvariant="normal" data-latex="\\Uplambda">&#x039B;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upxi', () => {
    toXmlMatch(
      tex2mml('\\Upxi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upxi" display="block">
         <mi mathvariant="normal" data-latex="\\Upxi">&#x039E;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Uppi', () => {
    toXmlMatch(
      tex2mml('\\Uppi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Uppi" display="block">
         <mi mathvariant="normal" data-latex="\\Uppi">&#x03A0;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upsigma', () => {
    toXmlMatch(
      tex2mml('\\Upsigma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upsigma" display="block">
         <mi mathvariant="normal" data-latex="\\Upsigma">&#x03A3;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upupsilon', () => {
    toXmlMatch(
      tex2mml('\\Upupsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upupsilon" display="block">
         <mi mathvariant="normal" data-latex="\\Upupsilon">&#x03A5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upphi', () => {
    toXmlMatch(
      tex2mml('\\Upphi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upphi" display="block">
         <mi mathvariant="normal" data-latex="\\Upphi">&#x03A6;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Uppsi', () => {
    toXmlMatch(
      tex2mml('\\Uppsi'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Uppsi" display="block">
         <mi mathvariant="normal" data-latex="\\Uppsi">&#x03A8;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Upomega', () => {
    toXmlMatch(
      tex2mml('\\Upomega'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upomega" display="block">
         <mi mathvariant="normal" data-latex="\\Upomega">&#x03A9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('upgreek'));
