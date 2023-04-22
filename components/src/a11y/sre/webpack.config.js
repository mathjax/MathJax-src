const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'a11y/sre',
  libs: [
    'components/src/input/mml/lib',
    'components/src/core/lib',
    'components/src/startup/lib'
  ],
  dir: __dirname
});
