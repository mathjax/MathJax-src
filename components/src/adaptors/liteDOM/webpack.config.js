const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'adaptors/liteDOM',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
