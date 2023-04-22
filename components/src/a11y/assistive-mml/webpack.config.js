const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'a11y/assistive-mml',
  libs: [
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
