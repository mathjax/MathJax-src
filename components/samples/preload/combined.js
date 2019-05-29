require('../../dist/startup.js');

MathJax.loader.preLoad(
    'core',
    'tex-input',
    'chtml-output',
    'chtml-fonts/tex'
);

require('../../dist/core.js');
require('../../dist/tex-input.js');
require('../../dist/chtml-output.js');
require('../../dist/chtml-fonts/tex.js');
