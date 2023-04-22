const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE({
  name:   'ui/menu',
  libs:   [
    'components/src/core/lib',
    'node_modules/mj-context-menu/js'
  ],
  dir:   __dirname
});
