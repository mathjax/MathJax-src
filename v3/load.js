process.chdir(__dirname);
require("./lib/system.js");
System.nodeRequire = require;  // make this available to modules running in node for now
System.config({map: {'traceur': './lib/traceur.min.js'}});
System.config({
  packages: {
    "TreeJax/lib": {
      map: {
        fs: "../../lib/fs.js",
        xmldom: "../node_modules/xmldom/dom-parser.js"
      }
    },
    "TreeJax/node_modules/xmldom": {
      map: {
        dom: "dom.js"
      }
    }
  }
});

System.import(process.argv[2] || 'main.js')
  .then(function (mj) {mathjax = mj.MathJax})
  .catch(function (error) {console.log(error.message)});
