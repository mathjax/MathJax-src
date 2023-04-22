const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'ui/lazy',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
