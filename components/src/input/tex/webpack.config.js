const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex',
  libs: [
    'components/src/startup/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
