import path from 'path';
import fs from 'fs';

function processDir(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (file.match(/\.js$/)) {
      processFile(file);
    }
    if (fs.lstatSync(file).isDirectory()) {
      processDir(file);
    }
  }
}

function processFile(name) {
  let lines = String(fs.readFileSync(name));
  if (!lines.match(/import /)) return;
  lines = lines.replace(
    /(?:import|export .*? from) .*?'.*?'/g,
    line => line.substr(-4) === ".js'" ? line : line.substr(0, line.length-1) + ".js'"
  );
  fs.writeFileSync(name, lines);
}

processDir('./es6/speech-rule-engine/js');
