import {Configuration} from '#js/input/tex/Configuration.js';
import {ConfigurationType} from '#js/input/tex/HandlerTypes.js';

import {VERSION} from '#js/components/version.js';

MathJax.loader.checkVersion('[tex]/error', VERSION, 'tex-extension');

Configuration.create('error', {
  [ConfigurationType.CONFIG]: () => {throw new Error('Error in Dependency')}
});
