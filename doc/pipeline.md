```
MathItem {
  math: string or MathML node,
  format: "TeX" or "AsciiMath" or "MathML",
  display: true or false,
  start: {index: i, char: n, delim: c},
  end: {index: i, char: n, delim: c},
  root: internal-mathml,
  typeset: DOMnode,
  state: n,         // what processing has been done
  metrics: {
    em: n,
    ex: n,
    containerWidth: n,
    lineWidth: n,
    scale: s
  },
  bbox: {},
  inputData: {},    // whatever input jax needs
  outputData: {}    // whatever output jax needs
  
  Compile(),
  Typeset(),
  AddEventHandlers()
}
```

```
Document {
  document: null,
  type: name,
  math: [],
  processed: {},       // which operations are finished
  
  Compile()            // do input processing
  GetMetrics()
  Typeset(format)      // produce output DOM elements
  AddEventHandlers()
  UpdateDocument()     // reinsert into document
  
  Concat(collection)
  Clear()              // clear processed variables
}
```

```
mathjax = require("mathjax/mathjax.js");
require("mathjax/handlers/html.js");

processor = mathjax.HandlerFor(document);
processor.FindMath({options})
    .CompileMath({options})
    .GetMetrics()
    .Typeset({options})
    .AddEvents({options})
    .UpdateDocument();
      
processor = mathjax.HandlerFor(document);
mathjax.HandleRetries(function () {
  processor.FindMath({options})
           .CompileMath({options})
           .GetMetrics()
           .Typeset({options})
           .AddEvents({options})
           .UpdateDocument();
}).then(function () {})
  .catch(function () {});
```

```
PriorityList = {
  items: [],        // list of {item:f, priority:p}
  Add(item,priority),
  Remove(item)
}

FunctionList (extends PriorityList) {
  Execute(...data),
  asyncExecute(...data)
}

Handlers (extends FunctionList) {
  Register(handler,priority),
  UnRegister(handler),
  HandlesDocument(document),
  HandlerFor(document)
}

Handler = {
  name: "...",
  priority: n,
  Register(),
  UnRegister(),
  HandlesDocument(document),
  Create(document,options)
}
```

```
InputJax {
  name: string,
  version: string,
  config: {},         // is this needed?
  extensionDir: url,  // is this needed?

  Register(),
  UnRegister(),
  
  FindMath(string,options),
  Translate(MathItem,options)
}

OutputJax {
  name: string,
  version: string,
  config: {},       // is this needed?
  extensionDir: url,  // is this needed?

  Register(),
  UnRegister(),

  Translate(MathItem,options)
}
```
