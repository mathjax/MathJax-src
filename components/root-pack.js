//
//  Replacement for __dirname for root directory
//

const config = global.MathJax?.config || {};
export const mjxRoot = () => config?.loader?.paths?.mathjax || config?.__dirname || '/';
