import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/mhchem/MhchemConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'mhchem']));

/**********************************************************************************/

describe('Mhchem0', () => {
  it('Chem-1', () => {
    expect(tex2mml('\\ce{CO2 + C -> 2 CO}')).toMatchSnapshot();
  });

  it('Chem-3', () => {
    expect(
      tex2mml('C_p[\\ce{H2O(l)}] = \\pu{75.3 J // mol K}')
    ).toMatchSnapshot();
  });

  it('Chem-4', () => {
    expect(tex2mml('\\ce{H2O}')).toMatchSnapshot();
  });

  it('Chem-5', () => {
    expect(tex2mml('\\ce{Sb2O3}')).toMatchSnapshot();
  });

  it('Chem-6', () => {
    expect(tex2mml('\\ce{H+}')).toMatchSnapshot();
  });

  it('Chem-7', () => {
    expect(tex2mml('\\ce{CrO4^2-}')).toMatchSnapshot();
  });

  it('Chem-8', () => {
    expect(tex2mml('\\ce{[AgCl2]-}')).toMatchSnapshot();
  });

  it('Chem-9', () => {
    expect(tex2mml('\\ce{Y^99+}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem1', () => {
  it('Chem-10', () => {
    expect(tex2mml('\\ce{Y^{99+}}')).toMatchSnapshot();
  });

  it('Chem-11', () => {
    expect(tex2mml('\\ce{2 H2O}')).toMatchSnapshot();
  });

  it('Chem-12', () => {
    expect(tex2mml('\\ce{2H2O}')).toMatchSnapshot();
  });

  it('Chem-13', () => {
    expect(tex2mml('\\ce{0.5 H2O}')).toMatchSnapshot();
  });

  it('Chem-14', () => {
    expect(tex2mml('\\ce{1/2 H2O}')).toMatchSnapshot();
  });

  it('Chem-15', () => {
    expect(tex2mml('\\ce{(1/2) H2O}')).toMatchSnapshot();
  });

  it('Chem-16', () => {
    expect(tex2mml('\\ce{$n$ H2O}')).toMatchSnapshot();
  });

  it('Chem-17', () => {
    expect(tex2mml('\\ce{^{227}_{90}Th+}')).toMatchSnapshot();
  });

  it('Chem-18', () => {
    expect(tex2mml('\\ce{^227_90Th+}')).toMatchSnapshot();
  });

  it('Chem-19', () => {
    expect(tex2mml('\\ce{^{0}_{-1}n^{-}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem2', () => {
  it('Chem-20', () => {
    expect(tex2mml('\\ce{^0_-1n-}')).toMatchSnapshot();
  });

  it('Chem-21', () => {
    expect(tex2mml('\\ce{H{}^3HO}')).toMatchSnapshot();
  });

  it('Chem-22', () => {
    expect(tex2mml('\\ce{H^3HO}')).toMatchSnapshot();
  });

  it('Chem-23', () => {
    expect(tex2mml('\\ce{A -> B}')).toMatchSnapshot();
  });

  it('Chem-24', () => {
    expect(tex2mml('\\ce{A <- B}')).toMatchSnapshot();
  });

  it('Chem-25', () => {
    expect(tex2mml('\\ce{A <-> B}')).toMatchSnapshot();
  });

  it('Chem-26', () => {
    expect(tex2mml('\\ce{A <--> B}')).toMatchSnapshot();
  });

  it('Chem-27', () => {
    expect(tex2mml('\\ce{A <=> B}')).toMatchSnapshot();
  });

  it('Chem-28', () => {
    expect(tex2mml('\\ce{A <=>> B}')).toMatchSnapshot();
  });

  it('Chem-29', () => {
    expect(tex2mml('\\ce{A <<=> B}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem3', () => {
  it('Chem-33', () => {
    expect(tex2mml('\\ce{(NH4)2S}')).toMatchSnapshot();
  });

  it('Chem-34', () => {
    expect(tex2mml('\\ce{[\\{(X2)3\\}2]^3+}')).toMatchSnapshot();
  });

  it('Chem-35', () => {
    expect(
      tex2mml('\\ce{CH4 + 2 $\\left( \\ce{O2 + 79/21 N2} \\right)$}')
    ).toMatchSnapshot();
  });

  it('Chem-36', () => {
    expect(tex2mml('\\ce{H2(aq)}')).toMatchSnapshot();
  });

  it('Chem-37', () => {
    expect(tex2mml('\\ce{CO3^2-_{(aq)}}')).toMatchSnapshot();
  });

  it('Chem-38', () => {
    expect(tex2mml('\\ce{NaOH(aq,$\\infty$)}')).toMatchSnapshot();
  });

  it('Chem-39', () => {
    expect(tex2mml('\\ce{ZnS($c$)}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem4', () => {
  it('Chem-40', () => {
    expect(tex2mml('\\ce{ZnS(\\ca$c$)}')).toMatchSnapshot();
  });

  it('Chem-41', () => {
    expect(tex2mml('\\ce{NO_x}')).toMatchSnapshot();
  });

  it('Chem-42', () => {
    expect(tex2mml('\\ce{Fe^n+}')).toMatchSnapshot();
  });

  it('Chem-44', () => {
    expect(tex2mml('\\ce{\\mu-Cl}')).toMatchSnapshot();
  });

  it('Chem-45', () => {
    expect(tex2mml('\\ce{[Pt(\\eta^2-C2H4)Cl3]-}')).toMatchSnapshot();
  });

  it('Chem-46', () => {
    expect(tex2mml('\\ce{\\beta +}')).toMatchSnapshot();
  });

  it('Chem-47', () => {
    expect(tex2mml('\\ce{^40_18Ar + \\gamma{} + \\nu_e}')).toMatchSnapshot();
  });

  it('Chem-48', () => {
    expect(tex2mml('\\ce{NaOH(aq,$\\infty$)}')).toMatchSnapshot();
  });

  it('Chem-49', () => {
    expect(tex2mml('\\ce{Fe(CN)_{$\\frac{6}{2}$}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem5', () => {
  it('Chem-50', () => {
    expect(tex2mml('\\ce{X_{$i$}^{$x$}}')).toMatchSnapshot();
  });

  it('Chem-51', () => {
    expect(tex2mml('\\ce{X_$i$^$x$}')).toMatchSnapshot();
  });

  it('Chem-52', () => {
    expect(tex2mml('\\ce{$cis${-}[PtCl2(NH3)2]}')).toMatchSnapshot();
  });

  it('Chem-53', () => {
    expect(tex2mml('\\ce{CuS($hP12$)}')).toMatchSnapshot();
  });

  it('Chem-54', () => {
    expect(tex2mml('\\ce{{Gluconic Acid} + H2O2}')).toMatchSnapshot();
  });

  it('Chem-55', () => {
    expect(tex2mml('\\ce{X_{{red}}}')).toMatchSnapshot();
  });

  it('Chem-56', () => {
    expect(tex2mml('\\ce{{(+)}_589{-}[Co(en)3]Cl3}')).toMatchSnapshot();
  });

  it('Chem-57', () => {
    expect(tex2mml('\\ce{C6H5-CHO}')).toMatchSnapshot();
  });

  it('Chem-58', () => {
    expect(tex2mml('\\ce{A-B=C#D}')).toMatchSnapshot();
  });

  it('Chem-59', () => {
    expect(tex2mml('\\ce{A\\bond{-}B\\bond{=}C\\bond{#}D}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem6', () => {
  it('Chem-60', () => {
    expect(tex2mml('\\ce{A\\bond{1}B\\bond{2}C\\bond{3}D}')).toMatchSnapshot();
  });

  it('Chem-61', () => {
    expect(tex2mml('\\ce{A\\bond{~}B\\bond{~-}C}')).toMatchSnapshot();
  });

  it('Chem-62', () => {
    expect(
      tex2mml('\\ce{A\\bond{~--}B\\bond{~=}C\\bond{-~-}D}')
    ).toMatchSnapshot();
  });

  it('Chem-63', () => {
    expect(tex2mml('\\ce{A\\bond{...}B\\bond{....}C}')).toMatchSnapshot();
  });

  it('Chem-64', () => {
    expect(tex2mml('\\ce{A\\bond{->}B\\bond{<-}C}')).toMatchSnapshot();
  });

  it('Chem-65', () => {
    expect(tex2mml('\\ce{KCr(SO4)2*12H2O}')).toMatchSnapshot();
  });

  it('Chem-66', () => {
    expect(tex2mml('\\ce{KCr(SO4)2.12H2O}')).toMatchSnapshot();
  });

  it('Chem-67', () => {
    expect(tex2mml('\\ce{KCr(SO4)2 * 12 H2O}')).toMatchSnapshot();
  });

  it('Chem-68', () => {
    expect(tex2mml('\\ce{Fe^{II}Fe^{III}2O4}')).toMatchSnapshot();
  });

  it('Chem-69', () => {
    expect(tex2mml('\\ce{OCO^{.-}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem7', () => {
  it('Chem-70', () => {
    expect(tex2mml('\\ce{NO^{(2.)-}}')).toMatchSnapshot();
  });

  it('Chem-71', () => {
    expect(tex2mml("\\ce{O''_{i,x}}")).toMatchSnapshot();
  });

  it('Chem-72', () => {
    expect(tex2mml('\\ce{M^{..}_i}')).toMatchSnapshot();
  });

  it('Chem-73', () => {
    expect(tex2mml("\\ce{$V$^{4'}_{Ti}}")).toMatchSnapshot();
  });

  it('Chem-74', () => {
    expect(tex2mml('\\ce{V_{V,1}C_{C,0.8}$V$_{C,0.2}}')).toMatchSnapshot();
  });

  it('Chem-75', () => {
    expect(tex2mml('\\ce{A + B}')).toMatchSnapshot();
  });

  it('Chem-76', () => {
    expect(tex2mml('\\ce{A - B}')).toMatchSnapshot();
  });

  it('Chem-77', () => {
    expect(tex2mml('\\ce{A = B}')).toMatchSnapshot();
  });

  it('Chem-78', () => {
    expect(tex2mml('\\ce{A \\pm B}')).toMatchSnapshot();
  });

  it('Chem-79', () => {
    expect(tex2mml('\\ce{SO4^2- + Ba^2+ -> BaSO4 v}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem8', () => {
  it('Chem-80', () => {
    expect(tex2mml('\\ce{A v B (v) -> B ^ B (^)}')).toMatchSnapshot();
  });

  it('Chem-81', () => {
    expect(tex2mml('\\ce{NO^*}')).toMatchSnapshot();
  });

  it('Chem-82', () => {
    expect(tex2mml('\\ce{1s^2-N}')).toMatchSnapshot();
  });

  it('Chem-83', () => {
    expect(tex2mml('\\ce{n-Pr}')).toMatchSnapshot();
  });

  it('Chem-84', () => {
    expect(tex2mml('\\ce{iPr}')).toMatchSnapshot();
  });

  it('Chem-85', () => {
    expect(tex2mml('\\ce{\\ca Fe}')).toMatchSnapshot();
  });

  it('Chem-86', () => {
    expect(tex2mml('\\ce{A, B, C; F}')).toMatchSnapshot();
  });

  it('Chem-87', () => {
    expect(tex2mml('\\ce{{and others}}')).toMatchSnapshot();
  });

  it('Chem-88', () => {
    expect(
      tex2mml(
        '\\ce{Zn^2+  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}$  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}}$}'
      )
    ).toMatchSnapshot();
  });

  it('Chem-89', () => {
    expect(
      tex2mml('\\ce{$K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]}$}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem9', () => {
  it('Chem-90', () => {
    expect(
      tex2mml('\\ce{$K = \\ce{\\frac{[Hg^2+][Hg]}{[Hg2^2+]}}$}')
    ).toMatchSnapshot();
  });

  it('Chem-92', () => {
    expect(tex2mml('\\pu{123 kJ}')).toMatchSnapshot();
  });

  it('Chem-93', () => {
    expect(tex2mml('\\pu{123 mm2}')).toMatchSnapshot();
  });

  it('Chem-94', () => {
    expect(tex2mml('\\pu{123 J s}')).toMatchSnapshot();
  });

  it('Chem-95', () => {
    expect(tex2mml('\\pu{123 J*s}')).toMatchSnapshot();
  });

  it('Chem-96', () => {
    expect(tex2mml('\\pu{123 kJ/mol}')).toMatchSnapshot();
  });

  it('Chem-97', () => {
    expect(tex2mml('\\pu{123 kJ//mol}')).toMatchSnapshot();
  });

  it('Chem-98', () => {
    expect(tex2mml('\\pu{123 kJ mol-1}')).toMatchSnapshot();
  });

  it('Chem-99', () => {
    expect(tex2mml('\\pu{123 kJ*mol-1}')).toMatchSnapshot();
  });

  it('Chem-100', () => {
    expect(tex2mml('\\pu{1.2e3 kJ}')).toMatchSnapshot();
  });

  it('Chem-101', () => {
    expect(tex2mml('\\pu{1,2e3 kJ}')).toMatchSnapshot();
  });

  it('Chem-102', () => {
    expect(tex2mml('\\pu{1.2E3 kJ}')).toMatchSnapshot();
  });

  it('Chem-103', () => {
    expect(tex2mml('\\pu{1,2E3 kJ}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mhchem-Ams', () => {
  beforeEach(() => setupTex(['base', 'ams', 'mhchem']));

  it('Chem-2', () => {
    expect(
      tex2mml('\\ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-}')
    ).toMatchSnapshot();
  });

  it('Chem-30', () => {
    expect(tex2mml('\\ce{A ->[H2O] B}')).toMatchSnapshot();
  });

  it('Chem-31', () => {
    expect(
      tex2mml('\\ce{A ->[{text above}][{text below}] B}')
    ).toMatchSnapshot();
  });

  it('Chem-32', () => {
    expect(tex2mml('\\ce{A ->[$x$][$x_i$] B}')).toMatchSnapshot();
  });

  it('Chem-43', () => {
    expect(
      tex2mml('\\ce{x Na(NH4)HPO4 ->[\\Delta] (NaPO3)_x + x NH3 ^ + x H2O}')
    ).toMatchSnapshot();
  });

  it('Chem-91', () => {
    expect(
      tex2mml(
        '\\ce{Hg^2+ ->[I-]  $\\underset{\\mathrm{red}}{\\ce{HgI2}}$  ->[I-]  $\\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}}$}'
      )
    ).toMatchSnapshot();
  });

  it('Mhchem Error', () => {
    expectTexError('\\ce{A\\bond{x}B}').toBe('mhchem bug T. Please report.');
  });

  it('Mhchem stretchy <-', () => {
    expect(tex2mml('\\ce{A <-[text] B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy ->', () => {
    expect(tex2mml('\\ce{A->[text]B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy <->', () => {
    expect(tex2mml('\\ce{A<->[text]B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy <-->', () => {
    expect(tex2mml('\\ce{A<-->[text]B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy <=>', () => {
    expect(tex2mml('\\ce{A <=>[text] B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy <=>>', () => {
    expect(tex2mml('\\ce{A <=>>[text] B}')).toMatchSnapshot();
  });

  it('Mhchem stretchy <<=>', () => {
    expect(tex2mml('\\ce{A <<=>[text] B}')).toMatchSnapshot();
  });

  it('Mhchem leftrightarrow', () => {
    expect(tex2mml('\\ce{A\\leftrightarrow B}')).toMatchSnapshot();
  });

  it('Mhchem rightleftharpoons', () => {
    expect(tex2mml('\\ce{A\\rightleftharpoons B}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('mhchem'));
