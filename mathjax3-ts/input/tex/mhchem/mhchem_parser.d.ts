declare namespace mhchemParser {
  export function go(input: string, stateMachine: string): any[];
}

declare namespace texify {
  export function go(input: any[], isInner?: boolean): string;
}
