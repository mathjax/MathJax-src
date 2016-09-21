/**
 * Ensure reload.
 */
require.cache = {};

/**
 * Pretty prints an XML representation.
 * @param {string} xml The serialised XML string.
 * @return {string} The formatted string.
 */
let formatXml = function(xml) {
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  reg = /(>)(.+)(<c)/g;
  xml = xml.replace(reg, '$1\r\n$2\r\n$3');
  var formatted = '';
  var padding = '';
  xml.split('\r\n')
      .forEach(function(node) {
        if (node.match(/.+<\/\w[^>]*>$/)) {
          // Node with content.
          formatted += padding + node + '\r\n';
        } else if (node.match(/^<\/\w/)) {
          if (padding) {
            // Closing tag
            padding = padding.slice(2);
            formatted += padding + node + '\r\n';
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          // Opening tag
          formatted += padding + node + '\r\n';
          padding += '  ';
        } else {
          // Empty tag
          formatted += padding + node + '\r\n';
        }
      });
  console.log(formatted);
  reg = /-->\s*</g;
  formatted = formatted.replace(reg, '--><');
  formatted = formatted.replace(/#x/g, '&#x');
  return formatted;
};

if (__dirname) {
  process.chdir(__dirname); process.cwd();
}
var location = '../';
var tj = require(location + 'lib/index.js');
//var tree = tj.parseFile(location + 'samples/superscript.json');
var tree = tj.parseFile(location + 'samples/faa_di_bruno.json');
//var tree = tj.parseFile(location + 'samples/sum.json');
var mv = new tj.MathmlVisitor();
tree.accept(mv);
console.log(formatXml(mv.getResult().toString()));

