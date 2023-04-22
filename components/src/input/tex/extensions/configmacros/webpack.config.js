const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex/extensions/configmacros',
  libs: [
    'components/src/input/tex/extensions/newcommand/lib',
    'components/src/input/tex-base/lib',
    'components/src/core/lib',
    'components/src/startup/lib'
  ],
  dir: __dirname
});
