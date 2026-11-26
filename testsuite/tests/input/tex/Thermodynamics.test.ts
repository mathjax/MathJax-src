import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers/index.js';
import '#js/input/tex/thermodynamics/ThermodynamicsConfiguration.js';
import '#js/input/tex/newcommand/NewcommandConfiguration.js';
import '#js/input/tex/ams/AmsConfiguration.js';

beforeEach(async () => setupTex(['base', 'newcommand', 'ams', 'thermodynamics']));

/**********************************************************************************/

describe('Thermodynamics Examples', () => {
  test('Eq 1', () => {
    expect(tex2mml(String.raw`
      d\Ut = \Partial*{\Ut}{\St}{\Vt,\allNs} d\St
        + \Partial*{\Ut}{\Vt}{\St,\allNs} d\Vt
        + \sumall_i \Partial*{\Ut}{\Nt_i}{\St,\Vt,\allNsbut{i}} d\Nt_i
    `)).toMatchSnapshot();
  });

  test('Eq 2', () => {
    expect(tex2mml(String.raw`
      \begin{thermoextensiveplain}
      \begin{thermomolesrange}
      \renewcommand{\Nt}{N}
      \renewcommand{\ncomponents}{\mathcal{C}}
      d\Ut = \Partial*{\Ut}{\St}{\Vt,\allNs} d\St
        + \Partial*{\Ut}{\Vt}{\St,\allNs} d\Vt
        + \sumall_i \Partial*{\Ut}{\Nt_i}{\St,\Vt,\allNsbut{i}} d\Nt_i
      \end{thermomolesrange}
      \end{thermoextensiveplain}
      \renewcommand{\Nt}{n}
      \renewcommand{\ncomponents}{C}
    `)).toMatchSnapshot();
  });

  test('Eq 3', () => {
    expect(tex2mml(String.raw`
      \Partial*{\Hm}{T}{P} = T\Partial*{\Sm}{T}{P}
                           = -T\PartialSecond*{\Gm}{T}{P} = \cP
    `)).toMatchSnapshot();
  });

  test('Partial Derivatives', () => {
    expect(tex2mml(String.raw`
      \Partial*{\Gpm_i}{P}{T,\allNs}
        = \PartialMixSecond*{\Gt}{P}{\Nt_i}{T,\allNsbut{i}}
        = \PartialMixSecond*{\Gt}{\Nt_i}{P}{T,\allNsbut{i}}
        = \Partial*{\Vt}{\Nt_i}{T,P,\allNsbut{i}} = \Vpm_i
    `)).toMatchSnapshot();
  });

});

describe('Thermodynamics Symbols', () => {
  test('Enthalpy', () => {
    expect(tex2mml(String.raw`\Ht \quad \Hm \quad \Hs \quad \Hpm_i`)).toMatchSnapshot();
  });

  test('Heat capacities', () => {
    expect(tex2mml(String.raw`\cPs \quad \cVs \quad \cPt \quad \cVt`)).toMatchSnapshot();
  });

  test('Heat capacities with super- and subscripts', () => {
    expect(tex2mml(String.raw`\cP_i^{\text{A}} \quad \cP^{\text{A}}_i`)).toMatchSnapshot();
  });

  test('Super- and subscript tests', () => {
    expect(tex2mml(String.raw`
      \cP_i^\IG \quad \cP^\IG_i \quad
      \cPpm_i^\IG \quad \cPpm^\IG_i \quad
      \cPt_i^\IG \quad \cPt^\IG_i \quad
      \cPs_i^\IG \quad \cPs^\IG_i
    `)).toMatchSnapshot();
  });

  test('Molar heat capacities', () => {
    expect(tex2mml(String.raw`\cPpm_i \quad \cVpm_i`)).toMatchSnapshot();
  });

  test('Definition of \\cVpm', () => {
    expect(tex2mml(String.raw`
      \cVpm_i = \Partial*{\cVt}{\Nt_i}{T,P,\allNsbut{i}}
              = \frac{\partial}{\partial\Nt_i}
                   \left[ -T\PartialSecond{\Ft}{T}{\Vt,\allNs}
                   \right]_{T,P,\allNsbut{i}}
    `)).toMatchSnapshot();
  });

  test('More molar tests', () => {
    expect(tex2mml(String.raw`\Upm{i}, \Upm[\IG]{i}, \Vpm_i, \Vpm^\IG_i`)).toMatchSnapshot();
  });

  test('Hat', () => {
    expect(tex2mml(String.raw`\Qt,\Qm,\Qs`)).toMatchSnapshot();
  });

  test('Work', () => {
    expect(tex2mml(String.raw`\Wt,\Wm,\Ws`)).toMatchSnapshot();
  });

  test('Total Energy', () => {
    expect(tex2mml(String.raw`\Et,\Em,\Es,\Epm_i,\EEt,\EE,\EEs,\EEpm_i,\ERt,\ER,\ERs,\ERpm_i`)).toMatchSnapshot();
  });

  test('Internal Energy', () => {
    expect(tex2mml(String.raw`\Ut,\Um,\Us,\Upm_i,\UEt,\UE,\UEs,\UEpm_i,\URt,\UR,\URs,\URpm_i`)).toMatchSnapshot();
  });

  test('Enthalpy', () => {
    expect(tex2mml(String.raw`\Ht,\Hm,\Hs,\Hpm_i,\HEt,\HE,\HEs,\HEpm_i,\HRt,\HR,\HRs,\HRpm_i`)).toMatchSnapshot();
  });

  test('Entropy', () => {
    expect(tex2mml(String.raw`\St,\Sm,\Ss,\Spm_i,\SEt,\SE,\SEs,\SEpm_i,\SRt,\SR,\SRs,\SRpm_i`)).toMatchSnapshot();
  });

  test('Volume', () => {
    expect(tex2mml(String.raw`\Vt,\Vm,\Vs,\Vpm_i,\VEt,\VE,\VEs,\VEpm_i,\VRt,\VR,\VRs,\VRpm_i`)).toMatchSnapshot();
  });

  test('Helmholtz Free Energy', () => {
    expect(tex2mml(String.raw`\Ft,\Fm,\Fs,\Fpm_i,\FEt,\FE,\FEs,\FEpm_i,\FRt,\FR,\FRs,\FRpm_i`)).toMatchSnapshot();
  });

  test('Gibbs Free Energy', () => {
    expect(tex2mml(String.raw`\Gt,\Gm,\Gs,\Gpm_i,\GEt,\GE,\GEs,\GEpm_i,\GRt,\GR,\GRs,\GRpm_i`)).toMatchSnapshot();
  });

  test('Surface Arua', () => {
    expect(tex2mml(String.raw`\At,\Am,\As,\Apm_i`)).toMatchSnapshot();
  });

  test('Grand Potential', () => {
    expect(tex2mml(String.raw`\Lt,\Lm,\Ls,\Lpm_i,\LEt,\LE,\LEs,\LEpm_i,\LRt,\LR,\LRs,\LRpm_i`)).toMatchSnapshot();
  });

  test('Moles', () => {
    expect(tex2mml(String.raw`\Nt`)).toMatchSnapshot();
  });

  test('NewExtensiveProperty', () => {
    expect(tex2mml(String.raw`\NewExtensiveProperty{J}{K} \Jt, \Jm, \Js`)).toMatchSnapshot();
  });

  test('NewPartialMolarProperty', () => {
    expect(tex2mml(String.raw`\NewPartialMolarProperty{J}{K} \Jpm_i`)).toMatchSnapshot();
  });

  test('NewResidualProperty', () => {
    expect(tex2mml(String.raw`\NewResidualProperty{J}{K} \JRt, \JR, \JRs, \JRpm_i`)).toMatchSnapshot();
  });

  test('NewExcessProperty', () => {
    expect(tex2mml(String.raw`\NewExcessProperty{J}{K} \JEt, \JE, \JEs, \JEpm_i`)).toMatchSnapshot();
  });

  test('NewThermodynamicsPropery', () => {
    expect(tex2mml(String.raw`
      \NewThermodynamicProperty{B}{B} \Bt, \Bm, \Bs, \Bpm_i,
        \BRt, \BR, \BRs, \BRpm_i
        \BEt, \BE, \BEs, \BEpm_i
    `)).toMatchSnapshot();
  });

  test('\\cP, etc.', () => {
    expect(tex2mml(String.raw`
      \cP, \cPt, \cPs, \cV, \cVt, \cVs, \cPpm_i, \cVpm_i,
        \kappaS, \kappaT, \alphaS, \alphaP, \muJT
    `)).toMatchSnapshot();
  });

  test('\\mu, etc.', () => {
    expect(tex2mml(String.raw`\mu, \muit, \fpure, \fmix, \fsat, \phipure, \phimix, \phisat`)).toMatchSnapshot();
  });

  test('\\actabs, etc.', () => {
    expect(tex2mml(String.raw`\actabs_i, \actrel_i, \Epot, \xrxn`)).toMatchSnapshot();
  });

  test('\\gamma, etc.', () => {
    expect(tex2mml(String.raw`\gamma, \gammait, \gammarat, \gammamol, \Henryrat, \Henrymol`)).toMatchSnapshot();
  });

  test('\\fmix', () => {
    expect(tex2mml(String.raw`
      \fmix_i = x_i \gamma_i \fpure_i = x_i \gammarat_i \Henryrat_i
              = C_i \gammamol_i \Henrymol_i
    `)).toMatchSnapshot();
  });

  test('\\Psat, etc.', () => {
    expect(tex2mml(String.raw`\Psat, \Pvap, \fsat, \phisat, \sat`)).toMatchSnapshot();
  });

  test('\\Pstd, etc.', () => {
    expect(tex2mml(String.raw`\Pstd, \std, \Cstd, \fstd, \mustd`)).toMatchSnapshot();
  });

  test('\\dbar', () => {
    expect(tex2mml(String.raw`\dbar`)).toMatchSnapshot();
  });

  test('\\Deltamix', () => {
    expect(tex2mml(String.raw`
      \Deltamix\Gm = \Gm - \sumall_i x_i \Gm_i
          = \Deltamix\Hm - T\Deltamix\Sm
    `)).toMatchSnapshot();
  });

  test('\\Deltasub', () => {
    expect(tex2mml(String.raw`
      \Deltasub\Hm = \Hm^V - \Hm^S = \Hm^V - \Hm^L + (\Hm^L - \Hm^S)
          = \Deltafus\Hm + \Deltavap\Hm
    `)).toMatchSnapshot();
  });

  test('\\Deltarxn', () => {
    expect(tex2mml(String.raw`\Deltarxn\Hm^\std = \sumall_i \nu_i \Deltaf\Hm_i^\std`)).toMatchSnapshot();
  });

  test('sumall', () => {
    expect(tex2mml(String.raw`
      \sumall_i x_i = 1 \quad \text{or} \quad
        x_\ncomponents = 1 - \sumallbutlast_i x_i \quad \text{or} \quad
        \Gt = \sumall_j \mu_j\Nt_j \quad \text{and} \quad
        K = \prodall_k a_k^{\nu_k}
    `)).toMatchSnapshot();
  });

  test('Ft =', () => {
    expect(tex2mml(String.raw`
      \Ft = \Ut - T\St = -P\Vt + \sumall_i \mu_i \Nt_i + \sigma \At
      \qquad \Hm = \Um + P\Vm \qquad \Et = \Ut + \frac12 mv^2
    `)).toMatchSnapshot();
  });

  test('Redefine \\excess', () => {
    expect(tex2mml(String.raw`
      \begin{gather*}
        \HE^\std = \Hm^{\excess,\std} = \HE(T,\Pstd)
          = \HR(T,\Pstd) - \HR^\IS(T,\Pstd) = \HR^\std - \HR^{\IS,\std} \\
        \renewcommand{\excess}{{EX}}
        \HE^\std = \Hm^{\excess,\std} = \HE(T,\Pstd)
          = \HR(T,\Pstd) - \HR^\IS(T,\Pstd)
      \end{gather*}
    `)).toMatchSnapshot();
  });
});

describe('Thermodynamics Partials', () => {
  test('\\Partial and \\Partial*', () => {
    expect(tex2mml(String.raw`\Partial{\Hm}{T}{P} = \cP \qquad \Partial*{\Hm}{T}{P} = \cP`)).toMatchSnapshot();
  });

  test('\\Partialinline', () => {
    expect(tex2mml(
      String.raw`\Partial*{\Hm}{T}{P} = \Partialinline{\Hm}{T}{P} = T\Partial{\Sm}{T}{P}`
    )).toMatchSnapshot();
  });

  test('\\Partialinlinetext', () => {
    expect(tex2mml(
      String.raw`\Partialinlinetext{\Hm}{T}{P} = T\Partial{\Sm}{T}{P}`
    )).toMatchSnapshot();
  });

  test('\\Partial unicode', () => {
    expect(tex2mml(String.raw`
      \begin{thermoNOsubscripts}
      \Partialinline{\Hm}{ù}{á}
      \end{thermoNOsubscripts}
    `)).toMatchSnapshot();
  });

  test('Partials with no at', () => {
    expect(tex2mml(String.raw`
      \Partial{\Hm}{T}{}
      \PartialSecond{\Hm}{T}{}
    `)).toMatchSnapshot();
  });

  test('\\PartialSecondinline noscripts', () => {
    expect(tex2mml(String.raw`
      \begin{thermoNOsubscripts}
        \PartialSecondinline{\Hm}{T}{} = \PartialSecond{\Hm}{T}{}
      \end{thermoNOsubscripts}
    `)).toMatchSnapshot();
  });

  test('\\PartialSecondinline', () => {
    expect(tex2mml(
      String.raw`\PartialSecondinline{\Hm}{T}{P} = T\PartialSecond{\Sm}{T}{P}`
    )).toMatchSnapshot();
  });

  test('\\PartialSecondinlinetext', () => {
    expect(tex2mml(
      String.raw`\PartialSecondinlinetext{\Hm}{T}{P} = T\PartialSecond{\Sm}{T}{P}`
    )).toMatchSnapshot();
  });

  test('\\PartialMixSecond', () => {
    expect(tex2mml(String.raw`
      \Vpm_i = \Partial*{\Vt}{\Nt_i}{T,P,\allNsbut{i}}
          = \PartialMixSecond*{\Gt}{\Nt_i}{P}{T,\allNsbut{i}}
          = \PartialMixSecond*{\Gt}{P}{\Nt_i}{T,\allNsbut{i}}
          = \Partial{\Gpm_i}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialMixSecondinline', () => {
    expect(tex2mml(String.raw`
      \Vpm_i = \Partialinline{\Vt}{\Nt_i}{T,P,\allNsbut{i}}
        = \PartialMixSecondinline{\Gt}{\Nt_i}{P}{T,\allNsbut{i}}
        = \PartialMixSecondinline{\Gt}{P}{\Nt_i}{T,\allNsbut{i}}
        = \Partialinline{\Gpm_i}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialMixSecondinline noscripts', () => {
    expect(tex2mml(String.raw`
      \begin{thermoNOsubscripts}
        \PartialMixSecondinline{\Hm}{T}{P}{} = \PartialMixSecond{\Hm}{T}{P}{}
      \end{thermoNOsubscripts}
    `)).toMatchSnapshot();
  });

  test('\\PartialBigg', () => {
    expect(tex2mml(String.raw`
      \Vpm_i = \Partial*{\Vt}{\Nt_i}{T,P,\allNsbut{i}}
          = \Partial*{\Gpm_i}{P}{T,\allNs}
          = \PartialBigg*{\Gpm_i}{P}{T,\allNs}
          = RT\Partial*{\log\fmix_i}{P}{T,\allNs}
          = RT\PartialBigg*{\log\fmix_i}{P}{T,\allNs}
          = RT\Partialbigg{\log\fmix_i}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialSecondBigg', () => {
    expect(tex2mml(String.raw`
      \PartialSecondbigg{\Gpm_i}{P}{T,\allNs},
      \PartialSecondBigg{\Gpm_i}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialMixSecondBigg', () => {
    expect(tex2mml(String.raw`
      \PartialMixSecondbigg{\Ht}{T}{P}{\allNs},
      \PartialMixSecondBigg{\Ht}{T}{P}{\allNs}
    `)).toMatchSnapshot();
  });

  test('\\Partial*', () => {
    expect(tex2mml(String.raw`
      \Vpm_i = \Partial*{\Vt}{\Nt_i}{T,P,\allNsbut{i}}
          = \Partial{\smash{\Gpm_i}}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialMixSecondinlinetext', () => {
    expect(tex2mml(String.raw`
      \Vpm_i = \Partialinlinetext{\Vt}{\Nt_i}{T,P,\allNsbut{i}}
          = \PartialMixSecondinlinetext{\Gt}{\Nt_i}{P}{T,\allNsbut{i}}
          = \PartialMixSecondinlinetext{\Gt}{P}{\Nt_i}{T,\allNsbut{i}}
          = \Partialinlinetext{\Gpm_i}{P}{T,\allNs}
    `)).toMatchSnapshot();
  });

  test('\\PartialMixSecond*', () => {
    expect(tex2mml(String.raw`
      \cPpm_i = T\Partial*{\Spm_i}{T}{P,\allXs}
          = T\PartialMixSecond*{\St}{T}{\Nt_i}{P,\allNsbut{i}}
          = -T\Partial{^3\Gt}{T^2\partial\Nt_i}{P,\allNsbut{i}}
    `)).toMatchSnapshot();
  });

  test('\\Partial with \\allNsbut', () => {
    expect(tex2mml(String.raw`
      \Partial{\Ht}{\Nt_1}{T,P,\allNsbut{1}} =
          \Partial{\Ht}{\Nt_1}{T,P,\allNsbut[m]{1}} = \Hpm_1
    `)).toMatchSnapshot();
  });

  test('\\Partial* with \\allXsbut', () => {
    expect(tex2mml(String.raw`
      \Partial*{\Hm}{x_i}{T,P,\allXsbut{i}}
          = \Partial*{\Hm}{x_i}{T,P,\allXsbut[m]{i}}
          = \Hpm_i - \Hpm_\ncomponents
    `)).toMatchSnapshot();
  });

  test('Partials with thermomolesrange', () => {
    expect(tex2mml(String.raw`
      \Partial{\Ht}{T}{P,\allNs}
        \quad
      \Partial{\Ht}{\Nt_1}{T,P,\allNsbut{1}}
        \quad
      \begin{thermomolesrange}
        \Partial{\Ht}{\Nt_1}{T,P,\allNsbut{1}}
      \end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('Partials with thermomolesindex', () => {
    expect(tex2mml(String.raw`
      \begin{thermomolesrange}
        \Partial{\Ht}{\Nt_1}{T,P,\allNsbut{1}}
        \begin{thermomolesindex}
          = \Partial{\Ht}{\Nt_1}{T,P,\allNsbut{1}}
        \end{thermomolesindex}
      \end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('Parial no-script sorting', () => {
    expect(tex2mml(String.raw`
      \begin{thermoNOsubscripts}
        \Partial{A}{\sigma}{\sigma}, \Partial{A}{\sigma}{\beta}, \Partial{A}{\beta}{\sigma}
      \end{thermoNOsubscripts}
    `)).toMatchSnapshot();
  });
});

describe('Thermodynamics Jacobians', () => {
  test('Jacobian 2 x 2', () => {
    expect(tex2mml(String.raw`\Jacobian{K,L}{X,Y} = \Jacobiandet{K,L}{X,Y}`)).toMatchSnapshot();
  });

  test('Jacobian 3 x 3', () => {
    expect(tex2mml(
      String.raw`\Jacobian{K,L,M}{X,Y,Z} = \Jacobiandet[\displaystyle]{K,L,M}{X,Y,Z}`
    )).toMatchSnapshot();
  });

  test('Jacobian m x m', () => {
    expect(tex2mml(String.raw`
      \Jacobian{f_1,\dots,f_m}{x_1,\dots,x_m}
          = \Jacobiandet{f_1,\dots,f_m}{x_1,\dots,x_m}
    `)).toMatchSnapshot();
  });

  test('Jacobian m x m thermomolesrange', () => {
    expect(tex2mml(String.raw`
      \begin{thermomolesrange}
        \Jacobian{f_1,\dots,f_m}{x_1,\dots,x_m} =
        \Jacobiandet{f_1,\dots,f_m}{x_1,\dots,x_m}
       \end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('Jacobian matrix', () => {
    expect(tex2mml(String.raw`
      \Jacobianmatrix{f_1,f_2}{x,y}
      \Jacobianbmatrix{f_1,f_2}{x,y}
      \Jacobianpmatrix{f_1,f_2}{x,y}
    `)).toMatchSnapshot();
  });

  test('Jacobian matrix with options', () => {
    expect(tex2mml(String.raw`
      \Jacobianmatrix[\scriptstyle]{f_1,f_2}{x,y}
      \Jacobianmatrix[][]{f_1,f_2}{x,y}
      \Jacobianmatrix[][2em]{f_1,f_2}{x,y}
    `)).toMatchSnapshot();
  });
});

describe('Thermodynamics enironments', () => {
  test('thermointesiveplain', () => {
    expect(tex2mml(String.raw`
      \begin{thermointensiveplain}
        \Hpm_i = \Partial*{\Ht}{\Nt_i}{T,P,\allNsbut{i}}
               = \Partial{\Nt\Hm}{\Nt_i}{T,P,\allNsbut{i}}
      \end{thermointensiveplain}
    `)).toMatchSnapshot();
  });

  test('thermoextensiveplain', () => {
    expect(tex2mml(String.raw`
      \begin{thermoextensiveplain}
        \Hpm_i = \Partial*{\Ht}{\Nt_i}{T,P,\allNsbut{i}}
               = \Partial{\Nt\Hm}{\Nt_i}{T,P,\allNsbut{i}}
      \end{thermoextensiveplain}
    `)).toMatchSnapshot();
  });

  test('thermoextensivesuperscript', () => {
    expect(tex2mml(String.raw`
      \begin{thermoextensivesuperscript}
        \Hpm_i = \Partial*{\Ht}{\Nt_i}{T,P,\allNsbut{i}}
          = \Partial{\Nt\Hm}{\Nt_i}{T,P,\allNsbut{i}}
      \end{thermoextensivesuperscript}
    `)).toMatchSnapshot();
  });

  test('thermointensivelowercase', () => {
    expect(tex2mml(String.raw`
      \begin{thermointensivelowercase}
        \Hpm_i = \Partial*{\Ht}{\Nt_i}{T,P,\allNsbut{i}}
                = \Partial{\Nt\Hm}{\Nt_i}{T,P,\allNsbut{i}}
      \end{thermointensivelowercase}
    `)).toMatchSnapshot();
  });

  test('thermointensiveplain all', () => {
    expect(tex2mml(String.raw`
      \begin{thermointensiveplain}
        \Ht \quad \Hm \quad \Hs \quad \Hpm_i
      \end{thermointensiveplain}
    `)).toMatchSnapshot();
  });

  test('thermoextensiveplaion all', () => {
    expect(tex2mml(String.raw`
      \begin{thermoextensiveplain}
        \Ht \quad \Hm \quad \Hs \quad \Hpm_i
      \end{thermoextensiveplain}
    `)).toMatchSnapshot();
  });

  test('thermoextensivesuperscript all', () => {
    expect(tex2mml(String.raw`
      \begin{thermoextensivesuperscript}
        \Ht \quad \Hm \quad \Hs \quad \Hpm_i
      \end{thermoextensivesuperscript}
    `)).toMatchSnapshot();
  });

  test('thermointensivelowercase all', () => {
    expect(tex2mml(String.raw`
      \begin{thermointensivelowercase}
        \Ht \quad \Hm \quad \Hs \quad \Hpm_i
      \end{thermointensivelowercase}
    `)).toMatchSnapshot();
  });

  test('thermoshortpm', () => {
    expect(tex2mml(String.raw`
      \Spm_i = \Spm_i^\IGM + \SRpm_i
        \begin{thermoshortpm}
              = \Spm_i^\IGM + \SRpm_i
        \end{thermoshortpm}
    `)).toMatchSnapshot();
  });

  test('thermolongpm', () => {
    expect(tex2mml(String.raw`
      \begin{thermoshortpm}
        \Spm_i^\IGM + \SRpm_i
        \begin{thermolongpm}
          = \Spm_i^\IGM + \SRpm_i
        \end{thermolongpm}
      \end{thermoshortpm}
    `)).toMatchSnapshot();
  });

  test('thermoparentheses', () => {
    expect(tex2mml(String.raw`
      \begin{thermoparentheses}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermoparentheses}
    `)).toMatchSnapshot();
  });

  test('thermobrackets', () => {
    expect(tex2mml(String.raw`
      \begin{thermobrackets}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermobrackets}
    `)).toMatchSnapshot();
  });

  test('thermobraces', () => {
    expect(tex2mml(String.raw`
      \begin{thermobraces}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermobraces}
    `)).toMatchSnapshot();
  });

  test('thermobar', () => {
    expect(tex2mml(String.raw`
      \begin{thermobar}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermobar}
    `)).toMatchSnapshot();
  });

  test('thermoplain', () => {
    expect(tex2mml(String.raw`
      \begin{thermoplain}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermoplain}
    `)).toMatchSnapshot();
  });

  test('thermosubscripts', () => {
    expect(tex2mml(String.raw`
      \begin{thermosubscripts}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermosubscripts}
    `)).toMatchSnapshot();
  });

  test('thermoNOsubscripts', () => {
    expect(tex2mml(String.raw`
      \begin{thermoNOsubscripts}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
      \end{thermoNOsubscripts}
    `)).toMatchSnapshot();
  });

  test('termoplain thermoNOsubscripts', () => {
    expect(tex2mml(String.raw`
      \begin{thermoplain}
      \begin{thermoNOsubscripts}
        \Partial*{\Vm}{T}{P} = \PartialMixSecond{\Gm}{T}{P}{}
            = \PartialMixSecond{\Gm}{P}{T}{}
            = -\Partial{\Sm}{P}{T}
        \\
        \Partial*{\Vt}{T}{P,\allNs} = \PartialMixSecond{\Gt}{T}{P}{\allNs}
            = \PartialMixSecond{\Gm}{P}{T}{\allNs}
            = -\Partial{\Sm}{P}{T,\allNs}
        \\
        \cP = T \PartialMixSecond{\St}{\Nt}{T}{P} = -\PartialSecond{\Gm}{T}{P}
      \end{thermoNOsubscripts}
      \end{thermoplain}
    `)).toMatchSnapshot();
  });

  test('lowercase Greek', () => {
    expect(tex2mml(String.raw`
      \begin{thermointensivelowercase}
        \intensive{\Omega}, \intensive{\omega}, \intensive{A\Omega}
      \end{thermointensivelowercase}
    `)).toMatchSnapshot();
  });
});

describe('Thermodynamics all* lists', () => {
  test('\\allNs', () => {
    expect(tex2mml(
      String.raw`\allNs, \begin{thermomolesrange}\allNs\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allNsbut{1}', () => {
    expect(tex2mml(
      String.raw`\allNsbut{1}, \begin{thermomolesrange}\allNsbut{1}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allNsbut{i}', () => {
    expect(tex2mml(
      String.raw`\allNsbut{i}, \begin{thermomolesrange}\allNsbut{i}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allNsbut{j}', () => {
    expect(tex2mml(
      String.raw`\allNsbut{j}, \begin{thermomolesrange}\allNsbut{j}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allNsbut{\\ncomponents}', () => {
    expect(tex2mml(
      String.raw`\allNsbut{\ncomponents}, \begin{thermomolesrange}\allNsbut{\ncomponents}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allNsbut[k]{i}', () => {
    expect(tex2mml(
      String.raw`\allNsbut[k]{i}, \begin{thermomolesrange}\allNsbut[k]{i}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allXs', () => {
    expect(tex2mml(
      String.raw`\allXs, \begin{thermomolesrange}\allXs\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allXsbut{1}', () => {
    expect(tex2mml(
      String.raw`\allXsbut{1}, \begin{thermomolesrange}\allXsbut{1}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allXsbut{i}', () => {
    expect(tex2mml(
      String.raw`\allXsbut{i}, \begin{thermomolesrange}\allXsbut{i}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allXsbut{j}', () => {
    expect(tex2mml(
      String.raw`\allXsbut{j}, \begin{thermomolesrange}\allXsbut{j}\end{thermomolesrange}`
    )).toMatchSnapshot();
  });

  test('\\allXsbut{\\ncomponents-1}', () => {
    expect(tex2mml(String.raw`
      \allXsbut{\ncomponents-1},
      \begin{thermomolesrange}\allXsbut{\ncomponents-1}\end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('\\allXsbut[k]{\\ncomponents-1}', () => {
    expect(tex2mml(String.raw`
      \allXsbut[k]{\ncomponents-1},
      \begin{thermomolesrange}\allXsbut[k]{\ncomponents-1}\end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('\\allXsbut{\\ncomponents}', () => {
    expect(tex2mml(String.raw`
      \allXsbut{\ncomponents},
      \begin{thermomolesrange}\allXsbut{\ncomponents}\end{thermomolesrange}
    `)).toMatchSnapshot();
  });

  test('More alls', () => {
    expect(tex2mml(String.raw`
      \allmus, \allmusbut{1},
      \allMs, \allMsbut{1},
      \allXs, \allXsbut{1},
      \allYs, \allYsbut{1},
      \allWs, \allWsbut{1},
      \allbutlastand{1}{x},
    `)).toMatchSnapshot();
  });
});

describe('Thermodynamics bad option values', () => {
  test('Bad eis-style', () => {
    setupTex(['base', 'newcommand', 'ams', 'thermodynamics'], {
      thermodynamics: {'extensive-style': 'invalid'}
    });
    expectTexError('\\Et').toBe("Thermodynamics error: 'invalid' is not a valid symbol style");
  });

  test('Bad symbol-set', () => {
    setupTex(['base', 'newcommand', 'ams', 'thermodynamics'], {
      thermodynamics: {'symbol-set': 'invalid'}
    });
    expect(tex2mml(String.raw`
      \Et\Ut\Ft\Gt\Ht\At\Nt
    `)).toMatchSnapshot();
  });

  test('Bad delimiter-style', () => {
    setupTex(['base', 'newcommand', 'ams', 'thermodynamics'], {
      thermodynamics: {'delimiter-style': 'invalid'}
    });
    expect(tex2mml(String.raw`
      \Partial{f}{x}{a}
    `)).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('thermodynamics'));
