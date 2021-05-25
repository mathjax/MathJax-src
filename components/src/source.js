const src = __dirname;

export const source = {
  'core': `${src}/core/core.js`,
  'adaptors/liteDOM': `${src}/adaptors/liteDOM/liteDOM.js`,
  'input/tex': `${src}/input/tex/tex.js`,
  'input/tex-base': `${src}/input/tex-base/tex-base.js`,
  'input/tex-full': `${src}/input/tex-full/tex-full.js`,
  '[tex]/action': `${src}/input/tex/extensions/action/action.js`,
  '[tex]/all-packages': `${src}/input/tex/extensions/all-packages/all-packages.js`,
  '[tex]/autoload': `${src}/input/tex/extensions/autoload/autoload.js`,
  '[tex]/ams': `${src}/input/tex/extensions/ams/ams.js`,
  '[tex]/amscd': `${src}/input/tex/extensions/amscd/amscd.js`,
  '[tex]/bbox': `${src}/input/tex/extensions/bbox/bbox.js`,
  '[tex]/boldsymbol': `${src}/input/tex/extensions/boldsymbol/boldsymbol.js`,
  '[tex]/braket': `${src}/input/tex/extensions/braket/braket.js`,
  '[tex]/bussproofs': `${src}/input/tex/extensions/bussproofs/bussproofs.js`,
  '[tex]/cancel': `${src}/input/tex/extensions/cancel/cancel.js`,
  '[tex]/centernot': `${src}/input/tex/extensions/centernot/centernot.js`,
  '[tex]/color': `${src}/input/tex/extensions/color/color.js`,
  '[tex]/colorv2': `${src}/input/tex/extensions/colorv2/colorv2.js`,
  '[tex]/configmacros': `${src}/input/tex/extensions/configmacros/configmacros.js`,
  '[tex]/enclose': `${src}/input/tex/extensions/enclose/enclose.js`,
  '[tex]/extpfeil': `${src}/input/tex/extensions/extpfeil/extpfeil.js`,
  '[tex]/html': `${src}/input/tex/extensions/html/html.js`,
  '[tex]/mhchem': `${src}/input/tex/extensions/mhchem/mhchem.js`,
  '[tex]/newcommand': `${src}/input/tex/extensions/newcommand/newcommand.js`,
  '[tex]/noerrors': `${src}/input/tex/extensions/noerrors/noerrors.js`,
  '[tex]/noundefined': `${src}/input/tex/extensions/noundefined/noundefined.js`,
  '[tex]/physics': `${src}/input/tex/extensions/physics/physics.js`,
  '[tex]/require': `${src}/input/tex/extensions/require/require.js`,
  '[tex]/tagformat': `${src}/input/tex/extensions/tagformat/tagformat.js`,
  '[tex]/textmacros': `${src}/input/tex/extensions/textmacros/textmacros.js`,
  '[tex]/unicode': `${src}/input/tex/extensions/unicode/unicode.js`,
  '[tex]/verb': `${src}/input/tex/extensions/verb/verb.js`,
  'input/mml': `${src}/input/mml/mml.js`,
  'input/mml/entities': `${src}/input/mml/entities/entities.js`,
  'input/asciimath': `${src}/input/asciimath/asciimath.js`,
  'output/chtml': `${src}/output/chtml/chtml.js`,
  'output/chtml/fonts/tex': `${src}/output/chtml/fonts/tex/tex.js`,
  'output/svg': `${src}/output/svg/svg.js`,
  'output/svg/fonts/tex': `${src}/output/svg/fonts/tex/tex.js`,
  'a11y/assistive-mml': `${src}/a11y/assistive-mml/assistive-mml.js`,
  'a11y/semantic-enrich': `${src}/a11y/semantic-enrich/semantic-enrich.js`,
  'a11y/complexity': `${src}/a11y/complexity/complexity.js`,
  'a11y/explorer': `${src}/a11y/explorer/explorer.js`,
  '[sre]': (typeof window === 'undefined' ? `${src}/../../js/a11y/sre-node.js` :
            `${src}/../../node_modules/speech-rule-engine/lib/sre_browser.js`),
  'ui/menu': `${src}/ui/menu/menu.js`,
  'ui/safe': `${src}/ui/safe/safe.js`,
  'mml-chtml': `${src}/mml-chtml/mml-chtml.js`,
  'mml-svg': `${src}/mml-svg/mml-svg.js`,
  'tex-chtml': `${src}/tex-chtml/tex-chtml.js`,
  'tex-svg': `${src}/tex-svg/tex-svg.js`,
  'tex-mml-chtml': `${src}/tex-mml-chtml/tex-mml-chtml.js`,
  'tex-mml-svg': `${src}/tex-mml-svg/tex-mml-svg.js`,
  'loader': `${src}/loader/loader.js`,
  'startup': `${src}/startup/startup.js`
};
