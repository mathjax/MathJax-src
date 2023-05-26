module.exports = (pkg) => {
  pkg.output.library = {
    name: 'init',
    type: 'commonjs',
    export: 'init'
  }
  return pkg;
}