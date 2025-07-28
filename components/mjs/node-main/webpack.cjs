module.exports = (pkg) => {
  pkg.output.library = {
    name: 'MathJax',
    type: 'commonjs',
    export: ['MathJax'],
  }
  return pkg;
}
