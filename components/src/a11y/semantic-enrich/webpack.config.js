const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'a11y/semantic-enrich',
  libs: [
    'components/src/input/mml/lib',
    'components/src/core/lib',
    'components/src/a11y/sre/lib'
  ],
  dir: __dirname
});
