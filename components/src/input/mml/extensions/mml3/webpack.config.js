const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/mml/extensions/mml3',
  libs: [
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
