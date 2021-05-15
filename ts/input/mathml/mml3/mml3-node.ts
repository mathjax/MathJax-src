/**
 * Create the transform function that uses Saxon-js to perform the
 *   xslt transformation.
 *
 * @return {(mml: string) => string)}   The transformation function
 */
export function createTransform(): (mml: string) => string {
  /* tslint:disable-next-line:no-eval */
  const nodeRequire = eval('require');   // get the actual require from node.
  /* tslint:disable-next-line:no-eval */
  const dirname = eval('__dirname');     // get the actual __dirname
  try {
    nodeRequire.resolve('saxon-js');     // check if saxon-js is installed.
  } catch (err) {
    throw Error('Saxon-js not found.  Run the command:\n    npm install saxon-js\nand try again.');
  }
  const Saxon = nodeRequire('saxon-js'); // dynamically load Saxon-JS.
  const path = nodeRequire('path');      // use the real version from node.
  const fs = nodeRequire('fs');          // use the real version from node.
  const xsltFile = path.resolve(dirname, 'mml3.sef.json');  // load the preprocessed stylesheet.
  const xslt = JSON.parse(fs.readFileSync(xsltFile));       // and parse it.
  return (mml: string) => {
    //
    //  Make sure the namespace is present
    //
    if (!mml.match(/ xmlns[=:]/)) {
        mml = mml.replace(/<(?:(\w+)(:))?math/, '<$1$2math xmlns$2$1="http://www.w3.org/1998/Math/MathML"');
    }
    let result;
    //
    //  Try to run the transform, and if it fails, return the original MathML
    try {
      result = Saxon.transform({
        stylesheetInternal: xslt,
        sourceText: mml,
        destination: 'serialized'
      }).principalResult;
    } catch (err) {
      result = mml;
    }
    return result;
  };
}
