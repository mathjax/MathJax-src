const PACKAGE = require('../../webpack.common.js');

module.exports = env => {
  const package = PACKAGE({
    name: 'node-main',
    dir: __dirname
  })(env);

  // make node-main.js exports available to caller
  package.output.library = {
    name: 'init',
    type: 'commonjs',
    export: 'init'
  };

  return package;
}

