const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'a11y/complexity',
  libs: [
    'components/src/a11y/semantic-enrich/lib',
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
