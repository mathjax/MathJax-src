const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex/extensions/cases',
  libs: [
    'components/src/input/tex-base/lib',
    'components/src/input/tex/extensions/ams/lib',
    'components/src/input/tex/extensions/empheq/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});

