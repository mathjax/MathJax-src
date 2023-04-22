const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex/extensions/all-packages',
  libs: [
    'components/src/input/tex-base/lib',
    'components/src/startup/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
