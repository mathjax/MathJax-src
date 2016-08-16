import {Translate} from "mathjax/input/LegacyTeX.js";

export function HTMLCompile(math) {
  return Translate(math.math,math.display);
}