import { startup, readyAfter } from './init.js';
import { Loader } from '#js/components/loader.js';

const COMPONENT = 'startup';

Loader.saveVersion(COMPONENT);
readyAfter(COMPONENT, startup);
