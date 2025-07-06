const fs = require('fs');
const path = require('path');

const link = path.resolve(path.dirname(process.argv[1]), '@mathjax');
const mathjax = path.dirname(path.dirname(require.resolve('@mathjax/src/package.json')));
if (!fs.existsSync(link)) fs.symlinkSync(mathjax, link);
