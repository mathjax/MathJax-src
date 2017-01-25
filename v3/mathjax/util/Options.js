//
//  Check if an object is an object literal (as opposed to an instance of a class)
//
const OBJECT = {}.constructor;
function isObject(obj) {
  return typeof obj === 'object' && obj !== null && obj.constructor === OBJECT;
}

//
//  Used to append an array to an array in default options
//
export const APPEND = Symbol('Append to option array');

//
//  Get all keys and symbols from an object
//
export function Keys(def) {
  if (!def) return [];
  return Object.keys(def).concat(Object.getOwnPropertySymbols(def));
}

//
//  Make a deep copy of an object
//
export function Copy(def) {
  let props = {};
  for (let key of Keys(def)) {
    let prop = Object.getOwnPropertyDescriptor(def,key);
    let value = prop.value;
    if (Array.isArray(value)) {
      prop.value = Insert([],value,false);
    } else if (isObject(value)) {
      prop.value = Copy(value);
    }
    if (prop.enumerable) props[key] = prop;
  }
  return Object.defineProperties({},props);
}

//
//  Insert one object into another (with optional warnings about
//  keys that aren't in the original)
//
export function Insert(dst,src,warn = true) {
  for (let key of Keys(src)) {
    if (warn && dst[key] === undefined) {
      if (typeof key === "symbol") key = key.toString();
      throw new Error("Invalid option '"+key+"' (no default value).");
    }
    let sval = src[key], dval = dst[key];
    if (isObject(sval) && dval !== null && 
       (typeof dval === 'object' || typeof dval === 'function')) {
      if (Array.isArray(dval) && Array.isArray(sval[APPEND]) && Keys(sval).length === 1) {
        dval.push(...(sval[APPEND]));
      } else {
        Insert(dval,sval,warn);
      }
    } else if (Array.isArray(sval)) {
      dst[key] = [];
      Insert(dst[key],sval,warn);
    } else if (isObject(sval)) {
      dst[key] = Copy(sval);
    } else {
      dst[key] = sval;
    }
  }
  return dst;
}

//
//  Merge options without warnings (so we can add new default values into an
//  existing default list)
//
export function DefaultOptions(options,...defs) {
  defs.forEach(def => Insert(options,def,false));
  return options;
}

//
//  Merge options with warnings about undefined ones (so we can merge
//  user options into the default list)
//
export function UserOptions(options,...defs) {
  defs.forEach(def => Insert(options,def,true));
  return options;
}

//
//  Select a subset of options by key name
//
export function SelectOptions(options,...keys) {
  let subset = {};
  for (let key of keys) {
    subset[key] = options[key];
  }
  return subset;
}
