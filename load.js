process.chdir(__dirname);
require("./lib/system.js");
System.nodeRequire = require;  // make this available to modules running in node for now
System.config({map: {'traceur': './lib/traceur.min.js'}});

System.import(process.argv[2] || 'main.js')
  .then(function (mj) {mathjax = mj.MathJax})
  .catch(function (error) {console.log(error.message)});
