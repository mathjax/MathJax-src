import {asyncLoad} from '../util/AsyncLoad.js';

declare const window: Window;

const SRELIB = (typeof window === 'undefined' ? './a11y/sre-node.js' :
                '../../node_modules/speech-rule-engine/lib/sre_browser.js');

let srePromise = (typeof sre === 'undefined' ? asyncLoad(SRELIB) : Promise.resolve());

const SRE_DELAY = 100;        // in milliseconds
const SRE_TIMEOUT = 5 * 1000; // 5 seconds

export const sreReady = new Promise<void>((resolve, reject) => {
    srePromise.then(() => {
        const start = new Date().getTime();
        function checkSRE() {
            if (sre.Engine.isReady()) {
                resolve();
            } else {
                if (new Date().getTime() - start < SRE_TIMEOUT) {
                    setTimeout(checkSRE, SRE_DELAY);
                } else {
                    reject('Timed out waiting for Speech-Rule-Engine');
                }
            }
        }
        checkSRE();
    }).catch((error: Error) => reject(error.message));
});

