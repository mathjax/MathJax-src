export type OptionList = {[name: string]: any};

export function DefaultOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export function UserOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export function SeparateOptions(options: OptionList, ...objects: OptionList[]): OptionList[];

