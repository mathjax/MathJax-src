const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE.NOFONT({
  name: 'output/svg',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
