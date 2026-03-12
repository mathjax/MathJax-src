import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/bboldx/BboldxConfiguration';
import '#js/input/tex/textmacros/TextMacrosConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx', () => {

  beforeEach(() => setupTex(['base', 'bboldx']));

  /********************************************************************************/

  test('mathbb', () => {
    expect(tex2mml('\\mathbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    expect(tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('dotless', () => {
    expect(tex2mml('\\imathbb\\jmathbb\\imathbfbb\\jmathbfbb')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('UC Greek', () => {
    expect(tex2mml('\\bbGamma\\bbDelta\\bbTheta\\bbLambda\\bbXi\\bbPi\\bbSigma\\bbUpsilon\\bbPhi\\bbPsi\\bbOmega')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek 1', () => {
    expect(tex2mml(
        '\\bbalpha\\bbbeta\\bbgamma\\bbdelta\\bbepsilon\\bbzeta\\bbeta\\bbtheta\\bbiota\\bbkappa\\bblambda'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek 2', () => {
    expect(tex2mml(
        '\\bbmu\\bbnu\\bbxi\\bbpi\\bbrho\\bbsigma\\bbtau\\bbupsilon\\bbphi\\bbchi\\bbpsi\\bbomega'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('UC Greek Bf', () => {
    expect(tex2mml(
        '\\bfbbGamma\\bfbbDelta\\bfbbTheta\\bfbbLambda\\bfbbXi\\bfbbPi\\bfbbSigma\\bfbbUpsilon\\bfbbPhi\\bfbbPsi\\bfbbOmega'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek Bf 1', () => {
    expect(tex2mml(
        '\\bfbbalpha\\bfbbbeta\\bfbbgamma\\bfbbdelta\\bfbbepsilon\\bfbbzeta\\bfbbeta\\bfbbtheta\\bfbbiota\\bfbbkappa\\bfbblambda'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek Bf 2', () => {
    expect(tex2mml(
        '\\bfbbmu\\bfbbnu\\bfbbxi\\bfbbpi\\bfbbrho\\bfbbsigma\\bfbbtau\\bfbbupsilon\\bfbbphi\\bfbbchi\\bfbbpsi\\bfbbomega'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Delimiters', () => {
    expect(tex2mml('\\bbLparen\\bbRparen\\bbLbrack\\bbRbrack\\bbLangle\\bbRangle')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Delimiters Bf', () => {
    expect(tex2mml('\\bfbbLparen\\bfbbRparen\\bfbbLbrack\\bfbbRbrack\\bfbbLangle\\bfbbRangle')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx Text', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros']));

  /********************************************************************************/

  test('textbb', () => {
    expect(tex2mml('\\text{\\textbb{Aa\u{393}\u{3B3}}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('textbfbb', () => {
    expect(tex2mml('\\text{\\textbfbb{Aa\u{393}\u{3B3}}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('dotless', () => {
    expect(tex2mml('\\text{\\itextbb\\jtextbb\\itextbfbb\\jtextbfbb}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('UC Greek', () => {
    expect(tex2mml(
        '\\text{\\txtbbGamma\\txtbbDelta\\txtbbTheta\\txtbbLambda\\txtbbXi\\txtbbPi\\txtbbSigma\\txtbbUpsilon\\txtbbPhi\\txtbbPsi\\txtbbOmega}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek 1', () => {
    expect(tex2mml(
        '\\text{\\txtbbalpha\\txtbbbeta\\txtbbgamma\\txtbbdelta\\txtbbepsilon\\txtbbzeta\\txtbbeta\\txtbbtheta\\txtbbiota\\txtbbkappa\\txtbblambda}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek 2', () => {
    expect(tex2mml(
        '\\text{\\txtbbmu\\txtbbnu\\txtbbxi\\txtbbpi\\txtbbrho\\txtbbsigma\\txtbbtau\\txtbbupsilon\\txtbbphi\\txtbbchi\\txtbbpsi\\txtbbomega}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('UC Greek Bf', () => {
    expect(tex2mml(
        '\\text{\\txtbfbbGamma\\txtbfbbDelta\\txtbfbbTheta\\txtbfbbLambda\\txtbfbbXi\\txtbfbbPi\\txtbfbbSigma\\txtbfbbUpsilon\\txtbfbbPhi\\txtbfbbPsi\\txtbfbbOmega}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek Bf 1', () => {
    expect(tex2mml(
        '\\text{\\txtbfbbalpha\\txtbfbbbeta\\txtbfbbgamma\\txtbfbbdelta\\txtbfbbepsilon\\txtbfbbzeta\\txtbfbbeta\\txtbfbbtheta\\txtbfbbiota\\txtbfbbkappa\\txtbfbblambda}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('LC Greek Bf 2', () => {
    expect(tex2mml(
        '\\text{\\txtbfbbmu\\txtbfbbnu\\txtbfbbxi\\txtbfbbpi\\txtbfbbrho\\txtbfbbsigma\\txtbfbbtau\\txtbfbbupsilon\\txtbfbbphi\\txtbfbbchi\\txtbfbbpsi\\txtbfbbomega}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Delimiters', () => {
    expect(tex2mml('\\text{\\txtbbLparen\\txtbbRparen\\txtbbLbrack\\txtbbRbrack\\txtbbLangle\\txtbbRangle}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Delimiters Bf', () => {
    expect(tex2mml('\\text{\\txtbfbbLparen\\txtbfbbRparen\\txtbfbbLbrack\\txtbfbbRbrack\\txtbfbbLangle\\txtbfbbRangle}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx light', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros'], {bboldx: {light: true}}));

  /********************************************************************************/

  test('mathbb', () => {
    expect(tex2mml('\\mathbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    expect(tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Some Greek', () => {
    expect(tex2mml('\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bboldx bfbb', () => {

  beforeEach(() => setupTex(['base', 'bboldx', 'textmacros'], {bboldx: {bfbb: true}}));

  /********************************************************************************/

  test('mathbb', () => {
    expect(tex2mml('\\mathbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbfbb', () => {
    expect(tex2mml('\\mathbfbb{Aa\u{393}\u{3B3}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Some Greek', () => {
    expect(tex2mml('\\bbGamma\\bbgamma\\bfbbGamma\\bfbbgamma')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => {getTokens('bboldx'); getTokens('text-bboldx')});
