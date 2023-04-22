const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex/extensions/bbox',
  libs: [
    'components/src/input/tex-base/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
