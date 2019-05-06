require('../../dist/startup.js');

MathJax.loader.preLoad(
    'core',
    'input/tex',
    'output/chtml',
    'output/chtml/fonts/tex'
);

require('../../dist/core.js');
require('../../dist/input/tex.js');
require('../../dist/output/chtml.js');
require('../../dist/output/chtml/fonts/tex.js');
