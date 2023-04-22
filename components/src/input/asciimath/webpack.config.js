const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/asciimath',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
