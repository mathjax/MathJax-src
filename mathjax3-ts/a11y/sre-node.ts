declare const global: any;
declare const require: (name: string) => any;

const SRE = require('speech-rule-engine');

global.sre = {Engine: {isReady() {return SRE.engineReady()}}};
