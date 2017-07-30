let spawn = require('child_process').spawnSync;
let resolve = require('path').resolve;

function SpawnJsonTest(file,args) {
  if (Array.isArray(file)) file = resolve(file[0],file[1]);
  let proc = spawn('node',[file].concat(args || []));
  if (proc.status === 0) return JSON.parse(proc.stdout.toString());
  throw new Error(proc.stderr.toString());
}

exports.SpawnJsonTest = SpawnJsonTest;
