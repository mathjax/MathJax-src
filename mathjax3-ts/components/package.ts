import {CONFIG} from './loader.js';

declare var document: Document;

export type PackageMap = Map<string, Package>;

export type PromiseFunction = (resolve: (name: string) => void,
                               reject: (message: string, name?: string) => void) => void;

export interface PackageConfig {
    ready: (name: string) => void;
    failed: (message: string, name?: string) => void;
    checkReady: () => Promise<void>;
};


export class Package {
    public static packages: PackageMap = new Map();

    public name: string;
    public isLoaded: boolean = false;
    public promise: Promise<any>;
    protected isLoading: boolean = false;
    protected resolve: (name: string) => void;
    protected reject: (message: string, name?:string) => void;
    protected dependents: Package[] = [];
    protected dependencies: Package[] = [];
    protected dependentCount: number;
    protected noLoad: boolean;

    get canLoad() {
        return this.dependentCount === 0 && !this.noLoad;
    }

    constructor(name: string, never: boolean = false) {
        this.name = name;
        this.noLoad = never;
        const map = Package.packages;
        map.set(name, this);
        const dependencies = CONFIG.dependencies[name] || [];
        if (!CONFIG.dependencies.hasOwnProperty(name) && name !== 'core') {
            dependencies.push('core');
        }
        this.dependentCount = dependencies.length;
        for (const dependent of dependencies) {
            const extension = map.get(dependent) || new Package(dependent, never);
            extension.addDependent(this, never);
            this.dependencies.push(extension);
            if (extension.isLoaded) {
                this.dependentCount--;
            }
        }
        this.promise = new Promise<string>(((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        }) as PromiseFunction);
        const config = (CONFIG[name] || {}) as PackageConfig;
        if (config.ready) {
            this.promise = this.promise.then(() => config.ready(this.name));
        }
        this.promise.catch(config.failed || ((message: string) => {}));
    }

    public load() {
        if (!this.isLoaded && !this.isLoading && !this.noLoad) {
            this.isLoading = true;
            const url = this.resolvePath();
            if (CONFIG.require) {
                this.loadCustom(url);
            } else {
                this.loadScript(url);
            }
        }
    }

    protected loadCustom(url: string) {
        try {
            CONFIG.require(url);
            this.checkLoad();
        } catch (err) {
            this.failed(err.message);
        }
    }

    protected loadScript(url: string) {
        const script = document.createElement('script');
        script.src = url;
        script.charset = 'UTF-8';
        script.onload = (event) => this.checkLoad();
        script.onerror = (event) => this.failed('Can\'t load "' + url + '"');
        // Should there be a timeout failure as well?
        document.head.appendChild(script);
    }

    protected loaded() {
        this.isLoaded = true;
        this.isLoading = false;
        for (const dependent of this.dependents) {
            dependent.requirementSatisfied();
        }
        this.resolve(this.name);
    }

    protected failed(message: string) {
        this.isLoading = false;
        this.reject(message, this.name);
    }

    protected checkLoad() {
        const config = (CONFIG[this.name] || {}) as PackageConfig;
        const checkReady = config.checkReady || (() => Promise.resolve());
        checkReady().then(() => this.loaded())
                    .catch((message) => this.failed(message));
    }

    public requirementSatisfied() {
        if (this.dependentCount) {
            this.dependentCount--;
            if (this.canLoad) {
                this.load();
            }
        }
    }

    protected resolvePath() {
        let path = CONFIG.source[this.name] || '[mathjax]/' + this.name;
        if (!path.match(/\.[^\/]+$/)) {
            path += '.js';
        }
        let match;
        while ((match = path.match(/^\[([^\]]*)\]/))) {
            if (!CONFIG.paths.hasOwnProperty(match[1])) break;
            path = CONFIG.paths[match[1]] + path.substr(match[0].length);
        }
        return path;
    }

    public addDependent(extension: Package, never: boolean) {
        this.dependents.push(extension);
        if (!never) {
            this.checkNoLoad();
        }
    }

    public checkNoLoad() {
        if (this.noLoad) {
            this.noLoad = false;
            for (const dependent of this.dependencies) {
                dependent.checkNoLoad();
            }
        }
    }

    public static loadAll() {
        for (const extension of this.packages.values()) {
            if (extension.canLoad) {
                extension.load();
            }
        }
    }

}
