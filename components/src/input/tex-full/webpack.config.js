const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'input/tex-full',
  libs: [
    'components/src/startup/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
