const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE.NOFONT({
  name: 'output/chtml',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
