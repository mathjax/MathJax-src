system  = require("./lib/system.js");
system.config({map: {'traceur': './lib/traceur.min.js'}});

system.import('main.js').catch(function (error) {console.log(error.message)});
