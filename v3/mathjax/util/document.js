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
  var jsdom = System.nodeRequire("jsdom").jsdom;
  exports.document = jsdom();
  exports.window = exports.document.defaultView;
  exports.DOMParser = exports.window.DOMParser;
  exports.XMLSerializer = exports.window.XMLSerializer;

}
