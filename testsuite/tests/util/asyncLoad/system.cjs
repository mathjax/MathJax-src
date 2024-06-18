const path = require('path');

/**
 *  Fake SystemJS, which is hard to run within jest
 */
System = {
  import(name, root) {
    return import(new URL(name, root).href);
  }
}

