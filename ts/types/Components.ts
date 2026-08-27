/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  The component type definitions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import type {
  DOM_TYPES,
  DOC_OPTIONS,
  DOC_TYPE,
  TEX_CONFIG,
  TEX_PACKAGE,
  MML_PACKAGE,
  EMPTY_COMPONENT,
  INPUTJAX,
  OUTPUTJAX,
  N,
  T,
  D,
} from './Types.js';

import type { STARTUP_TYPES } from '../components/startup.js';
import type { LOADER_TYPES } from '../components/loader.js';

import type { HTMLDOCUMENT_OPTIONS } from '../handlers/html/HTMLDocument.js';

import type { TEX_OPTIONS } from '../input/tex.js';
import type { FINDTEX_OPTIONS } from '../input/tex/FindTeX.js';
import type { TAGS_OPTIONS } from '../input/tex/Tags.js';
import type { BASE_OPTIONS } from '../input/tex/base/BaseConfiguration.js';

import type { AMS_OPTIONS } from '../input/tex/ams/AmsConfiguration.js';
import type { AMSCD_OPTIONS } from '../input/tex/amscd/AmsCdConfiguration.js';
import type { AUTOLOAD_OPTIONS } from '../input/tex/autoload/AutoloadConfiguration.js';
import type { BBM_OPTIONS } from '../input/tex/bbm/BbmConfiguration.js';
import type { BBOLDX_OPTIONS } from '../input/tex/bboldx/BboldxConfiguration.js';
import type { BEGINGROUP_OPTIONS } from '../input/tex/begingroup/BegingroupConfiguration.js';
import type { COLOR_OPTIONS } from '../input/tex/color/ColorConfiguration.js';
import type { CONFIGMACROS_OPTIONS } from '../input/tex/configmacros/ConfigMacrosConfiguration.js';
import type { DSFONT_OPTIONS } from '../input/tex/dsfont/DsfontConfiguration.js';
import type { MATHTOOLS_OPTIONS } from '../input/tex/mathtools/MathtoolsConfiguration.js';
import type { NEWCOMMAND_OPTIONS } from '../input/tex/newcommand/NewcommandConfiguration.js';
import type { NOUNDEFINED_OPTIONS } from '../input/tex/noundefined/NoUndefinedConfiguration.js';
import type { PHYSICS_OPTIONS } from '../input/tex/physics/PhysicsConfiguration.js';
import type { REQUIRE_OPTIONS } from '../input/tex/require/RequireConfiguration.js';
import type { SETOPTIONS_OPTIONS } from '../input/tex/setoptions/SetOptionsConfiguration.js';
import type { TAGFORMAT_OPTIONS } from '../input/tex/tagformat/TagFormatConfiguration.js';
import type { TEXHTML_OPTIONS } from '../input/tex/texhtml/TexHtmlConfiguration.js';
import type { TEXTMACROS_OPTIONS } from '../input/tex/textmacros/TextMacrosConfiguration.js';
import type { UNITS_OPTIONS } from '../input/tex/units/UnitsConfiguration.js';

import type { MATHML_OPTIONS } from '../input/mathml.js';
import type { MATHMLCOMPILE_OPTIONS } from '../input/mathml/MathMLCompile.js';
import type { MML3_OPTIONS } from '../input/mathml/mml3/mml3.js';

import type { ASCIIMATH_OPTIONS } from '../input/asciimath.js';
import type { FINDASCIIMATH_OPTIONS } from '../input/asciimath/FindAsciiMath.js';

import type { CHTML_OPTIONS } from '../output/chtml.js';
import type { CHTML_FONT_OPTIONS } from '../output/chtml/FontData.ts';
import type { SVG_OPTIONS } from '../output/svg.js';

import type {
  OPTIONS as ASSISTIVEMML_OPTIONS,
  AssistiveMmlMathDocument,
} from '../a11y/assistive-mml.js';
import type {
  OPTIONS as ENRICH_OPTIONS,
  EnrichedMathDocument,
} from '../a11y/semantic-enrich.js';
import type {
  OPTIONS as COMPLEXITY_OPTIONS,
  ComplexityMathDocument,
} from '../a11y/complexity.js';
import type { SPEECH_OPTIONS, SpeechMathDocument } from '../a11y/speech.js';
import type {
  OPTIONS as EXPLORER_OPTIONS,
  ExplorerMathDocument,
} from '../a11y/explorer.js';

import type {
  OPTIONS as MENU_OPTIONS,
  MenuMathDocument,
} from '../ui/menu/MenuHandler.js';
import type {
  OPTIONS as LAZY_OPTIONS,
  LazyMathDocument,
} from '../ui/lazy/LazyHandler.js';
import type {
  OPTIONS as SAFE_OPTIONS,
  SafeMathDocument,
} from '../ui/safe/SafeHandler.js';

/**
 * The mapping of component names to their component definitions.
 *
 * @template DOM   The DOM node types to use in the types that need them.
 */
export type COMPONENTS<DOM extends DOM_TYPES> = {
  'input/asciimath': INPUTJAX<
    'asciimath',
    ASCIIMATH_OPTIONS<DOM> & FINDASCIIMATH_OPTIONS
  >;
  'input/mml': INPUTJAX<
    'mathml',
    MATHML_OPTIONS<DOM> & MATHMLCOMPILE_OPTIONS,
    'mml'
  >;
  'input/tex':
    | INPUTJAX<'tex', TEX_OPTIONS<DOM> & FINDTEX_OPTIONS & TAGS_OPTIONS>
    | '__PACKAGES__';
  'input/tex-base':
    | INPUTJAX<
        'tex',
        TEX_OPTIONS<DOM> & FINDTEX_OPTIONS & TAGS_OPTIONS,
        'tex-base'
      >
    | '__base__';

  '[tex]/action': EMPTY_COMPONENT<'[tex]/action'>;
  '[tex]/ams': TEX_PACKAGE<'ams', AMS_OPTIONS>;
  '[tex]/amscd': TEX_PACKAGE<'amscd', AMSCD_OPTIONS>;
  '[tex]/autoload': TEX_PACKAGE<'autoload', AUTOLOAD_OPTIONS>;
  '[tex]/bbm': TEX_PACKAGE<'bbm', BBM_OPTIONS>;
  '[tex]/bboldx': TEX_PACKAGE<'bboldx', BBOLDX_OPTIONS>;
  '[tex]/bbox': EMPTY_COMPONENT<'[tex]/bbox'>;
  '[tex]/begingroup': TEX_PACKAGE<'begingroup', BEGINGROUP_OPTIONS>;
  '[tex]/boldsymbol': EMPTY_COMPONENT<'[tex]/boldsymbol'>;
  '[tex]/braket': EMPTY_COMPONENT<'[tex]/braket'>;
  '[tex]/bussproofs': EMPTY_COMPONENT<'[tex]/bussproofs'>;
  '[tex]/cancel': EMPTY_COMPONENT<'[tex]/cancel'>;
  '[tex]/cases': EMPTY_COMPONENT<'[tex]/cases'>;
  '[tex]/centernot': EMPTY_COMPONENT<'[tex]/centernot'>;
  '[tex]/color': TEX_PACKAGE<'color', COLOR_OPTIONS>;
  '[tex]/colorv2': EMPTY_COMPONENT<'[tex]/colorv2'>;
  '[tex]/configmacros': TEX_PACKAGE<'configmacros', CONFIGMACROS_OPTIONS>;
  '[tex]/dsfont': TEX_PACKAGE<'dsfont', DSFONT_OPTIONS>;
  '[tex]/empheq': EMPTY_COMPONENT<'[tex]/empheq'>;
  '[tex]/enclose': EMPTY_COMPONENT<'[tex]/enclose'>;
  '[tex]/extpfeil': EMPTY_COMPONENT<'[tex]/extpfeil'>;
  '[tex]/fontsizev3': EMPTY_COMPONENT<'[tex]/fontsizev3'>;
  '[tex]/gensymb': EMPTY_COMPONENT<'[tex]/gensymb'>;
  '[tex]/html': EMPTY_COMPONENT<'[tex]/html'>;
  '[tex]/mathtools': TEX_PACKAGE<'mathtools', MATHTOOLS_OPTIONS>;
  '[tex]/mhchem': EMPTY_COMPONENT<'[tex]/mhchem'>;
  '[tex]/newcommand': TEX_PACKAGE<'newcommand', NEWCOMMAND_OPTIONS>;
  '[tex]/noerrors': EMPTY_COMPONENT<'[tex]/noerrors'>;
  '[tex]/noundefined': TEX_PACKAGE<'noundefined', NOUNDEFINED_OPTIONS>;
  '[tex]/physics': TEX_PACKAGE<'physics', PHYSICS_OPTIONS>;
  '[tex]/require': TEX_PACKAGE<'require', REQUIRE_OPTIONS>;
  '[tex]/setoptions': TEX_PACKAGE<'setoptions', SETOPTIONS_OPTIONS>;
  '[tex]/tagformat': TEX_PACKAGE<'tagformat', TAGFORMAT_OPTIONS>;
  '[tex]/texhtml': TEX_PACKAGE<'texhtml', TEXHTML_OPTIONS>;
  '[tex]/textcomp': EMPTY_COMPONENT<'[tex]/textcomp'>;
  '[tex]/textmacros': TEX_PACKAGE<'textmacros', TEXTMACROS_OPTIONS>;
  '[tex]/unicode': EMPTY_COMPONENT<'[tex]/unicode'>;
  '[tex]/units': TEX_PACKAGE<'units', UNITS_OPTIONS>;
  '[tex]/upgreek': EMPTY_COMPONENT<'[tex]/upgreek'>;
  '[tex]/verb': EMPTY_COMPONENT<'[tex]/verb'>;

  '[mml]/mml3': MML_PACKAGE<'mml3', MML3_OPTIONS>;
  'input/mml/entities': EMPTY_COMPONENT<'input/mml/entities'>;

  'output/chtml': OUTPUTJAX<
    'chtml',
    CHTML_OPTIONS<DOM> & CHTML_FONT_OPTIONS,
    DOM
  >;
  'output/svg': OUTPUTJAX<'svg', SVG_OPTIONS<DOM>, DOM>;

  'a11y/semantic-enrich':
    | DOC_OPTIONS<ENRICH_OPTIONS<DOM>>
    | DOC_TYPE<EnrichedMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'a11y/assisitive-mml':
    | DOC_OPTIONS<ASSISTIVEMML_OPTIONS>
    | DOC_TYPE<AssistiveMmlMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'a11y/complexity':
    | 'a11y/semantic-enrich'
    | DOC_OPTIONS<COMPLEXITY_OPTIONS>
    | DOC_TYPE<ComplexityMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'a11y/speech':
    | 'a11y/semantic-enrich'
    | DOC_OPTIONS<SPEECH_OPTIONS<DOM>>
    | DOC_TYPE<SpeechMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'a11y/explorer':
    | 'a11y/speech'
    | DOC_OPTIONS<EXPLORER_OPTIONS>
    | DOC_TYPE<ExplorerMathDocument>;

  'ui/menu': DOC_OPTIONS<MENU_OPTIONS> | DOC_TYPE<MenuMathDocument>;
  'ui/lazy':
    | DOC_OPTIONS<LAZY_OPTIONS<DOM>>
    | DOC_TYPE<LazyMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'ui/safe':
    | DOC_OPTIONS<SAFE_OPTIONS>
    | DOC_TYPE<SafeMathDocument<N<DOM>, T<DOM>, D<DOM>>>;
  'ui/no-dark-mode': EMPTY_COMPONENT<'ui/no-dark-mode'>;

  'adaptors/liteDOM': EMPTY_COMPONENT<'adaptors/liteDOM'>;
  'adaptors/jsdom': EMPTY_COMPONENT<'adaptors/jsdom'>;
  'adaptors/linkedom': EMPTY_COMPONENT<'adaptors/linkedom'>;

  startup: STARTUP_TYPES<DOM> &
    LOADER_TYPES &
    DOC_OPTIONS<HTMLDOCUMENT_OPTIONS<DOM>>;
  loader: LOADER_TYPES;

  'mml-chtml':
    'input/mml' | 'output/chtml' | 'ui/menu' | '__a11y__' | 'startup';
  'mml-chtml-nofont': 'mml-chtml';
  'mml-svg': 'input/mml' | 'output/svg' | 'ui/menu' | '__a11y__' | 'startup';
  'mml-svg-nofont': 'mml-svg';
  'tex-chtml':
    'input/tex' | 'output/chtml' | 'ui/menu' | '__a11y__' | 'startup';
  'tex-chtml-nofont': 'tex-chtml';
  'tex-mml-chtml':
    | 'input/tex'
    | 'input/mml'
    | 'output/chtml'
    | 'ui/menu'
    | '__a11y__'
    | 'startup';
  'tex-mml-chtml-nofont': 'tex-mml-chtml';
  'tex-svg': 'input/tex' | 'output/svg' | 'ui/menu' | '__a11y__' | 'startup';
  'tex-svg-nofont': 'tex-svg';
  'tex-mml-svg':
    | 'input/tex'
    | 'input/mml'
    | 'output/svg'
    | 'ui/menu'
    | '__a11y__'
    | 'startup';
  'tex-mml-svg-nofont': 'tex-mml-svg';

  __base__: TEX_CONFIG<BASE_OPTIONS>;
  __PACKAGES__:
    | '__base__'
    | '[tex]/ams'
    | '[tex]/configmacros'
    | '[tex]/newcommand'
    | '[tex]/textmacros'
    | '[tex]/noundefined'
    | '[tex]/autoload'
    | '[tex]/require';
  __a11y__: 'a11y/explorer' | 'input/mml';
};
