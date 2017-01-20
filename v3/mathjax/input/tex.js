import {InputJax} from "../core/InputJax.js";
import {LegacyTeX} from "./legacy/TeX.js";
import {LegacyTeX2jax} from "./legacy/tex2jax.js";

export class TeX extends InputJax {
  
  Compile(tex,display) {
    return LegacyTeX.Compile(tex,display);
  }
  
  Translate(tex,display) {
    return LegacyTeX.Translate(tex,display);
  }
  
  FindMath(node) {
    return LegacyTeX2jax.FindMath(node,this);
  }
  
};

TeX.NAME = "TeX";
