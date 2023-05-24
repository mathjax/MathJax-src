import './lib/mml.js';

import {MathML} from '#js/input/mathml.js';
export {MathML};

if (MathJax.loader) {
  //
  // Install a path-filter to cause loading of an entity file to load all entities,
  //   since the individual files don't have individual components.
  //
  MathJax.loader.pathFilters.add((data) => {
    data.name = data.name.replace(/\/util\/entities\/.*?\.js/, '/input/mml/entities.js');
    return true;
  });
}
