(function () {
  var MML = MathJax.ElementJax.mml;
  
  var PROPERTY = [
    'movesupsub',
    'subsupOK',
    'primes',
    'movablelimits',
    'scriptlevel',
    'open',
    'close',
    'isError',
    'multiline',
    'variantForm',
    'texClass',
    'autoOP'
  ];

  MML.mbase.Augment({
    toMmlNode: function (factory) {
      var m = this.data.length;
      var kind = this.type; if (kind === 'texatom') kind = 'TeXAtom';
      if (this.inferred) kind = 'inferredMrow';
      var node = factory.MML[kind]();
      for (var i = 0; i < m; i++) {
        var child = this.data[i];
        if (child) node.appendChild(child.toMmlNode(factory));
      }
      this.nodeAddAttributes(node);
      this.nodeAddProperties(node);
      return node;
    },
    nodeAddAttributes: function (node) {
      var defaults = (this.type === "mstyle" ? MML.math.prototype.defaults : this.defaults);
      var names = (this.attrNames||MML.copyAttributeNames),
          skip = MML.skipAttributes,
          copy = MML.copyAttributes;
      if (!this.attrNames) {
        for (var id in defaults) {
          if (!skip[id] && !copy[id] && defaults.hasOwnProperty(id)) {
            if (this[id] != null && this[id] !== defaults[id]) {
              if (this.Get(id,null,1) !== this[id]) node.attributes.set(id,this[id]);
            }
          }
        }
      }
      for (var i = 0, m = names.length; i < m; i++) {
        if (copy[names[i]] === 1 && !defaults.hasOwnProperty(names[i])) continue;
        value = (this.attr||{})[names[i]];
        if (value == null) value = this[names[i]];
        if (value != null) node.attributes.set(names[i],value);
      }
    },
    nodeAddProperties: function (node) {
      for (var i = 0, m = PROPERTY.length; i < m; i++) {
        var name = PROPERTY[i];
        if (this[name] != null &&
            (this.defaults[name] == null || this.defaults[name] === MML.AUTO)) {
          node.setProperty(name, this[name]);
        }
      }
    }
  });
  
  MML.chars.Augment({
    toMmlNode: function (factory) {
      return factory.MML.text().setText(this.data.join(""));
    }
  });
  MML.entity.Augment({
    toMmlNode: function (factory) {
      return factory.MML.text(this.toString());
    }
  });
  
  MML.msubsup.Augment({
    toMmlNode: function (factory) {
      var kind = (this.data[this.sub] == null ? 'msup' :
                  this.data[this.sup] == null ? 'msub' : 'msubsup'); 
      var node = factory.MML[kind]();
      for (var i = 0, m = this.data.length; i < m; i++) {
        var child = this.data[i];
        if (child) node.appendChild(child.toMmlNode(factory));
      }
      this.nodeAddAttributes(node);
      return node;
    }
  });
  
  MML.munderover.Augment({
    toMmlNode: function (factory) {
      var kind = (this.data[this.under] == null ? 'mover' :
                  this.data[this.over]  == null ? 'mover' : 'munderover'); 
      var node = factory.MML[kind]();
      for (var i = 0, m = this.data.length; i < m; i++) {
        var child = this.data[i];
        if (child) node.appendChild(child.toMmlNode(factory));
      }
      this.nodeAddAttributes(node);
      return node;
    }
  });
  
  MML.xml.Augment({
    toMmlNode: function (factory) {
      return factory.MML.xml(this.data);
    }
  });
  
})();
