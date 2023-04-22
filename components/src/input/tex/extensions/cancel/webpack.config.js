const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex/extensions/cancel',
  libs: [
    'components/src/input/tex-base/lib',
    'components/src/input/tex/extensions/enclose/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
