const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'ui/safe',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
