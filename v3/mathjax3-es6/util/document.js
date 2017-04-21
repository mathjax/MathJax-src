try {

  //
  //  Browser version
  //
  document;  // errors if not in browser
  exports.document = document;
  exports.window = window;
  exports.DOMParser = DOMParser;
  exports.XMLSerializer = XMLSerializer;
  
} catch (err) {
  
  //
  //  Node version
  //
  var jsdom = System.nodeRequire("jsdom");
  
  function XMLSerializer() {}
  XMLSerializer.prototype.serializeToString = function (node) {
    return jsdom.serializeDocument(node);
  };
  
  exports.document = jsdom.jsdom();
  exports.window = exports.document.defaultView;
  exports.DOMParser = exports.window.DOMParser;
  exports.XMLSerializer = XMLSerializer;

}
