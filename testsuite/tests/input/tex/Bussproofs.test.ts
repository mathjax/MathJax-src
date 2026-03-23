import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTexWithOutput, tex2mml } from '#helpers';
import '#js/input/tex/bussproofs/BussproofsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTexWithOutput(['base', 'ams', 'bussproofs']));

/**********************************************************************************/

describe('BussproofsRegInf', () => {

  it('Single Axiom', () => {
    expect(tex2mml('\\begin{prooftree}\\AxiomC{A}\\end{prooftree}')).toMatchSnapshot();
  });

  it('Unary Inference', () => {
    expect(tex2mml('\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}')).toMatchSnapshot();
  });

  it('Binary Inference', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Trinary Inference', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Quaternary Inference', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Quinary Inference', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Left', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Right', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Both', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Single Axiom Abbr', () => {
    expect(tex2mml('\\begin{prooftree}\\AXC{A}\\end{prooftree}')).toMatchSnapshot();
  });

  it('Unary Inference Abbr', () => {
    expect(tex2mml('\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}')).toMatchSnapshot();
  });

  it('Binary Inference Abbr', () => {
    expect(tex2mml('\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}')).toMatchSnapshot();
  });

  it('Trinary Inference Abbr', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Left Abbr', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Right Abbr', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Label Both Abbr', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('BussproofsRegProofs', () => {

  it('Simple Proof', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Simple Proof Noise', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Simple Proof Large', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Simple Proofs Right Labels', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Simple Proofs Left Labels', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Simple Proofs Mixed Labels', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Proof Very Right Label', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Proof Complex', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Proof Mixing Order', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
    )).toMatchSnapshot();
  });

  it('Extreme', () => {
    expect(tex2mml(
        '\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('bussproofs'));
