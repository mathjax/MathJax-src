const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name: 'a11y/explorer',
  libs: [
    'components/src/ui/menu/lib',
    'components/src/a11y/semantic-enrich/lib',
    'components/src/a11y/sre/lib',
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  dir: __dirname
});
