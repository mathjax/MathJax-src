const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex-base',
  libs: ['components/src/core/lib'],
  dir: __dirname
});
