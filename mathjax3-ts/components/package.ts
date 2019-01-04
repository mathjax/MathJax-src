import {CONFIG} from './loader.js';

declare var document: Document;

export type PackageMap = Map<string, Package>;

export class PackageError extends Error {
    public package: string;
    constructor(message: string, name: string) {
        super(message);
        this.package = name;
    }
};

export type PackageReady = (name: string) => string;
export type PackageFailed = (message: PackageError) => void;
export type PackagePromise = (resolve: PackageReady, reject: PackageFailed) => void;

export interface PackageConfig {
    ready: PackageReady,
    failed: PackageFailed,
    checkReady: () => Promise<void>;
};


export class Package {
    public static packages: PackageMap = new Map();

    public name: string;
    public isLoaded: boolean = false;
    public promise: Promise<string>;
    protected isLoading: boolean = false;
    protected resolve: PackageReady;
    protected reject: PackageFailed;
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
        Package.packages.set(name, this);
        const promises = [] as Promise<string>[];
        this.makeDependencies(promises);
        this.makePromise(promises)
    }

    protected makeDependencies(promises: Promise<string>[]) {
        const map = Package.packages;
        const never = this.noLoad;
        const name = this.name;
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
            promises.push(extension.promise);
        }
    }

    protected makePromise(promises: Promise<string>[]) {
        let promise = new Promise<string>(((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        }) as PackagePromise);
        const config = (CONFIG[this.name] || {}) as PackageConfig;
        if (config.ready) {
            promise = promise.then((name: string) => config.ready(this.name));
        }
        if (promises.length) {
            promises.push(promise);
            promise = Promise.all(promises).then((names: string[]) => names.join(', '));
        }
        this.promise = promise;
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
        const config = (CONFIG[this.name] || {}) as PackageConfig;
        const error = new PackageError(message, this.name);
        if (config.failed) {
            config.failed(error);
        }
        this.reject(error);
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
        let file = CONFIG.source[this.name] || this.name;
        if (!file.match(/^(?:[a-z]+:\/)?\//)) {
            file = '[mathjax]/' + file.replace(/^\.\//, '');
        }
        if (!file.match(/\.[^\/]+$/)) {
            file += '.js';
        }
        let match;
        while ((match = file.match(/^\[([^\]]*)\]/))) {
            if (!CONFIG.paths.hasOwnProperty(match[1])) break;
            file = CONFIG.paths[match[1]] + file.substr(match[0].length);
        }
        return file;
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
