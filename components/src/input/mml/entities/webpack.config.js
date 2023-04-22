const PACKAGE = require('../../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/mml/entities',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
