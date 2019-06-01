require('mj-context-menu');
require('./lib/menu.js');

const {MenuHandler} = require('../../../../mathjax3/ui/menu/MenuHandler.js');

if (MathJax.startup && typeof window !== 'undefined') {
    MathJax.startup.extendHandler(handler => MenuHandler(handler), 20);
}

