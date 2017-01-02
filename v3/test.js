process.chdir(__dirname);
system  = require("./lib/system.js");
system.config({map: {'traceur': './lib/traceur.min.js'}});
system.config({
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

system.import('main.js')
  .then(function (mj) {mathjax = mj.MathJax})
  .catch(function (error) {console.log(error.message)});
