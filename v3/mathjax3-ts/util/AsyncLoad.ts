declare var System: {import: Function};
declare var __moduleName: string;

export function AsyncLoad(name: string) {
    return System.import(name,__moduleName);
}
