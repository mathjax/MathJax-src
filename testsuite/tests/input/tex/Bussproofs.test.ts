import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTexWithOutput, tex2mml } from '#helpers';
import '#js/input/tex/bussproofs/BussproofsConfiguration.js';
import '#js/input/tex/ams/AmsConfiguration.js';
import '#js/input/tex/newcommand/NewcommandConfiguration.js';

beforeEach(() => setupTexWithOutput(['base', 'ams', 'bussproofs']));

/**********************************************************************************/

describe('BussproofsRegInf', () => {
  it('Single Axiom', () => {
    expect(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\end{prooftree}')
    ).toMatchSnapshot();
  });

  it('Unary Inference', () => {
    expect(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}')
    ).toMatchSnapshot();
  });

  it('Binary Inference', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Trinary Inference', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Quaternary Inference', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Quinary Inference', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Left', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Right', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Both', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Single Axiom Abbr', () => {
    expect(
      tex2mml('\\begin{prooftree}\\AXC{A}\\end{prooftree}')
    ).toMatchSnapshot();
  });

  it('Unary Inference Abbr', () => {
    expect(
      tex2mml('\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}')
    ).toMatchSnapshot();
  });

  it('Binary Inference Abbr', () => {
    expect(
      tex2mml('\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}')
    ).toMatchSnapshot();
  });

  it('Trinary Inference Abbr', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Left Abbr', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Right Abbr', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Label Both Abbr', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('BussproofsRegProofs', () => {
  it('Simple Proof', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Simple Proof Noise', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Simple Proof Large', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Simple Proofs Right Labels', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Simple Proofs Left Labels', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Simple Proofs Mixed Labels', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Proof Very Right Label', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Proof Complex', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Proof Mixing Order', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Extreme', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('BussproofsSequents', () => {
  beforeEach(() =>
    setupTexWithOutput(['base', 'ams', 'newcommand', 'bussproofs'])
  );

  it('Sequent Axiom Only', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A \\fCenter B$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Axiom Display Proof No Space', () => {
    expect(tex2mml('\\Axiom$A\\fCenterA$\\DisplayProof')).toMatchSnapshot();
  });

  it('Sequent Unary', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A,B \\fCenter C$\\UnaryInf$A \\fCenter B,C$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Unary Chain', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A,B,Q,R \\fCenter C$\\UnaryInf$A \\fCenter B,C$\\UnaryInf$\\fCenter A,B,C,D,E$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Unary Chain Labelled', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A,B,Q,R \\fCenter C$\\RightLabel{X}\\UnaryInf$A \\fCenter B,C$\\RightLabel{Y}\\UnaryInf$\\fCenter A,B,C$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Unary Chain Plain Line', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A,B \\fCenter C$\\UnaryInfC{intermediate}\\UnaryInf$A \\fCenter B,C,D,E$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Unary Chain Binary Top', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\AxiomC{$P$}\\AxiomC{$Q$}\\BinaryInf$A,B,Q,R \\fCenter C$\\UnaryInf$A \\fCenter B,C$\\UnaryInf$\\fCenter A,B,C$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Binary', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$\\fCenter A$\\Axiom$B \\fCenter C,D$\\UnaryInf$B,X,Y,Z \\fCenter C$\\BinaryInf$A,B \\fCenter C$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Root At Top', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\rootAtTop\\Axiom$A,B,Q,R \\fCenter C$\\UnaryInf$A \\fCenter B,C$\\UnaryInf$\\fCenter A,B,C$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Widest At Bottom', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\begin{prooftree}\\Axiom$A \\fCenter B$\\UnaryInf$A,B \\fCenter C$\\UnaryInf$A,B,C,D \\fCenter E$\\UnaryInf$A,B,C,D,E,F \\fCenter G$\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Display Proof Chain', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\Axiom$A,B,Q \\fCenter C$\\UnaryInf$A \\fCenter B,C$\\UnaryInf$\\fCenter A,B,C$\\DP'
      )
    ).toMatchSnapshot();
  });

  it('Sequent Abbreviations', () => {
    expect(
      tex2mml(
        '\\def\\fCenter{\\vdash}\\AX$A \\fCenter B$\\AX$C \\fCenter D$\\BI$E \\fCenter F$\\DP'
      )
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('BussproofsCommands', () => {
  it('Display Proof', () => {
    expect(tex2mml('\\AxiomC{A}\\UnaryInfC{B}\\DisplayProof')).toMatchSnapshot();
  });

  it('Display Proof Inline', () => {
    expect(tex2mml('X = \\AxiomC{A}\\UnaryInfC{B}\\DP')).toMatchSnapshot();
  });

  it('Enable Abbreviations', () => {
    expect(
      tex2mml('\\EnableBpAbbreviations\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\DP')
    ).toMatchSnapshot();
  });

  it('Quaternary Abbreviation', () => {
    expect(
      tex2mml('\\AXC{A}\\AXC{B}\\AXC{C}\\AXC{D}\\QIC{E}\\DP')
    ).toMatchSnapshot();
  });

  it('Quinary Abbreviation', () => {
    expect(
      tex2mml('\\AXC{A}\\AXC{B}\\AXC{C}\\AXC{D}\\AXC{E}\\QuIC{F}\\DP')
    ).toMatchSnapshot();
  });

  it('Kern Hyps', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\kernHyps{1em}\\BinaryInfC{C}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Insert Between Hyps', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\insertBetweenHyps{\\hskip 2em}\\BinaryInfC{C}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Dotted Line', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\dottedLine\\UnaryInfC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Double Line', () => {
    expect(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\doubleLine\\UnaryInfC{B}\\end{prooftree}'
      )
    ).toMatchSnapshot();
  });

  it('Bottom Align Proof', () => {
    expect(
      tex2mml('\\bottomAlignProof\\AxiomC{A}\\UnaryInfC{B}\\DP')
    ).toMatchSnapshot();
  });

  it('Center Align Proof', () => {
    expect(
      tex2mml('\\centerAlignProof\\AxiomC{A}\\UnaryInfC{B}\\DP')
    ).toMatchSnapshot();
  });

  it('Normal Align Proof', () => {
    expect(
      tex2mml('\\normalAlignProof\\AxiomC{A}\\UnaryInfC{B}\\DP')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('bussproofs'));
