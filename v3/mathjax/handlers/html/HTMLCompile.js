import {Translate} from "mathjax/input/legacy/TeX.js";

export function HTMLCompile(math) {
  return Translate(math.math,math.display);
}