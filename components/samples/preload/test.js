require('./config.js');
require('../../src/startup/startup.js');

MathJax.loader.preLoad(
    'core',
    'adaptors/liteDOM',
    'input/tex',
    'output/chtml',
    'output/chtml/fonts/tex'
);

require('../../src/core/core.js');
require('../../src/adaptors/liteDOM/liteDOM.js');
require('../../src/input/tex/tex.js');
require('../../src/output/chtml/chtml.js');
require('../../src/output/chtml/fonts/tex/tex.js');

require('./run.js');
