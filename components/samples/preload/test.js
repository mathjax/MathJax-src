require('./config.js');
require('../../src/startup/startup.js');

MathJax.loader.preLoad(
    'core',
    'liteDOM',
    'tex-input',
    'chtml-output',
    'chtml-fonts/tex'
);

require('../../src/core/core.js');
require('../../src/liteDOM/liteDOM.js');
require('../../src/tex-input/tex-input.js');
require('../../src/chtml-output/chtml-output.js');
require('../../src/chtml-output/fonts/tex/tex.js');

require('./run.js');
