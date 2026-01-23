/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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

import {dirname} from '#source/source.cjs';
import {context} from '#js/util/context.js';
const src = context.path(dirname);

export const source = {
  'core': `${src}/core/core.js`,
  'adaptors/jsdom': `${src}/adaptors/jsdom/jsdom.js`,
  'adaptors/linkedom': `${src}/adaptors/linkedom/linkedom.js`,
  'adaptors/liteDOM': `${src}/adaptors/liteDOM/liteDOM.js`,
  'input/tex': `${src}/input/tex/tex.js`,
  'input/tex-base': `${src}/input/tex-base/tex-base.js`,
  'input/tex-full': `${src}/input/tex-full/tex-full.js`,
  '[tex]/action': `${src}/input/tex/extensions/action/action.js`,
  '[tex]/ams': `${src}/input/tex/extensions/ams/ams.js`,
  '[tex]/amscd': `${src}/input/tex/extensions/amscd/amscd.js`,
  '[tex]/autoload': `${src}/input/tex/extensions/autoload/autoload.js`,
  '[tex]/bbm': `${src}/input/tex/extensions/bbm/bbm.js`,
  '[tex]/bboldx': `${src}/input/tex/extensions/bboldx/bboldx.js`,
  '[tex]/bbox': `${src}/input/tex/extensions/bbox/bbox.js`,
  '[tex]/begingroup': `${src}/input/tex/extensions/begingroup/begingroup.js`,
  '[tex]/boldsymbol': `${src}/input/tex/extensions/boldsymbol/boldsymbol.js`,
  '[tex]/braket': `${src}/input/tex/extensions/braket/braket.js`,
  '[tex]/bussproofs': `${src}/input/tex/extensions/bussproofs/bussproofs.js`,
  '[tex]/cancel': `${src}/input/tex/extensions/cancel/cancel.js`,
  '[tex]/cases': `${src}/input/tex/extensions/cases/cases.js`,
  '[tex]/centernot': `${src}/input/tex/extensions/centernot/centernot.js`,
  '[tex]/color': `${src}/input/tex/extensions/color/color.js`,
  '[tex]/colortbl': `${src}/input/tex/extensions/colortbl/colortbl.js`,
  '[tex]/colorv2': `${src}/input/tex/extensions/colorv2/colorv2.js`,
  '[tex]/configmacros': `${src}/input/tex/extensions/configmacros/configmacros.js`,
  '[tex]/dsfont': `${src}/input/tex/extensions/dsfont/dsfont.js`,
  '[tex]/empheq': `${src}/input/tex/extensions/empheq/empheq.js`,
  '[tex]/enclose': `${src}/input/tex/extensions/enclose/enclose.js`,
  '[tex]/extpfeil': `${src}/input/tex/extensions/extpfeil/extpfeil.js`,
  '[tex]/gensymb': `${src}/input/tex/extensions/gensymb/gensymb.js`,
  '[tex]/html': `${src}/input/tex/extensions/html/html.js`,
  '[tex]/mathtools': `${src}/input/tex/extensions/mathtools/mathtools.js`,
  '[tex]/mhchem': `${src}/input/tex/extensions/mhchem/mhchem.js`,
  '[tex]/newcommand': `${src}/input/tex/extensions/newcommand/newcommand.js`,
  '[tex]/noerrors': `${src}/input/tex/extensions/noerrors/noerrors.js`,
  '[tex]/noundefined': `${src}/input/tex/extensions/noundefined/noundefined.js`,
  '[tex]/physics': `${src}/input/tex/extensions/physics/physics.js`,
  '[tex]/require': `${src}/input/tex/extensions/require/require.js`,
  '[tex]/setoptions': `${src}/input/tex/extensions/setoptions/setoptions.js`,
  '[tex]/tagformat': `${src}/input/tex/extensions/tagformat/tagformat.js`,
  '[tex]/texhtml': `${src}/input/tex/extensions/texhtml/texhtml.js`,
  '[tex]/textcomp': `${src}/input/tex/extensions/textcomp/textcomp.js`,
  '[tex]/textmacros': `${src}/input/tex/extensions/textmacros/textmacros.js`,
  '[tex]/unicode': `${src}/input/tex/extensions/unicode/unicode.js`,
  '[tex]/units': `${src}/input/tex/extensions/units/units.js`,
  '[tex]/upgreek': `${src}/input/tex/extensions/upgreek/upgreek.js`,
  '[tex]/verb': `${src}/input/tex/extensions/verb/verb.js`,
  'input/mml': `${src}/input/mml/mml.js`,
  'input/mml/entities': `${src}/input/mml/entities/entities.js`,
  '[mml]/mml3': `${src}/input/mml/extensions/mml3/mml3.js`,
  'input/asciimath': `${src}/input/asciimath/asciimath.js`,
  'output/chtml': `${src}/output/chtml/chtml.js`,
  'output/svg': `${src}/output/svg/svg.js`,
  'a11y/assistive-mml': `${src}/a11y/assistive-mml/assistive-mml.js`,
  'a11y/semantic-enrich': `${src}/a11y/semantic-enrich/semantic-enrich.js`,
  'a11y/speech': `${src}/a11y/speech/speech.js`,
  'a11y/complexity': `${src}/a11y/complexity/complexity.js`,
  'a11y/explorer': `${src}/a11y/explorer/explorer.js`,
  'a11y/sre': `${src}/a11y/sre/sre.js`,
  '[mathmaps]': `${src}/../../bundle/sre/mathmaps`,
  'ui/lazy': `${src}/ui/lazy/lazy.js`,
  'ui/menu': `${src}/ui/menu/menu.js`,
  'ui/no-dark-mode': `${src}/ui/nodarkmode/nodarkmode.js`,
  'ui/safe': `${src}/ui/safe/safe.js`,
  'mml-chtml': `${src}/mml-chtml/mml-chtml.js`,
  'mml-chtml-nofont': `${src}/mml-chtml-nofont/mml-chtml-nofont.js`,
  'mml-svg': `${src}/mml-svg/mml-svg.js`,
  'mml-svg-nofont': `${src}/mml-svg-nofont/mml-svg-nofont.js`,
  'tex-chtml': `${src}/tex-chtml/tex-chtml.js`,
  'tex-chtml-nofont': `${src}/tex-chtml-nofont/tex-chtml-nofont.js`,
  'tex-svg': `${src}/tex-svg/tex-svg.js`,
  'tex-svg-nofont': `${src}/tex-svg-nofont/tex-svg-nofont.js`,
  'tex-mml-chtml': `${src}/tex-mml-chtml/tex-mml-chtml.js`,
  'tex-mml-chtml-nofont': `${src}/tex-mml-chtml-nofont/tex-mml-chtml-nofont.js`,
  'tex-mml-svg': `${src}/tex-mml-svg/tex-mml-svg.js`,
  'tex-mml-svg-nofont': `${src}/tex-mml-svg-nofont/tex-mml-svg-nofont.js`,
  'loader': `${src}/loader/loader.js`,
  'startup': `${src}/startup/startup.js`
};
