let REQUIRE;
try { REQUIRE = eval("require") } catch(_) { REQUIRE = () => {} }
const path = REQUIRE("path");
const fs = REQUIRE("fs");

let source = null;
if (fs.existsSync(path.resolve(__dirname, '..', '..', 'source.js'))) {
  source = async () => {return (await import(/* webpackIgnore: true */ '../../source.js')).source};
}

module.exports.REQUIRE = REQUIRE;
module.exports.path = path;
module.exports.source = source;

