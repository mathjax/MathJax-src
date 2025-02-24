module.exports = (pkg) => {
  pkg.experiments = {outputModule: true};
  pkg.output.library = {type: 'module'};
  return pkg;
}
