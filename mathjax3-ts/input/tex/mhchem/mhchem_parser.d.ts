declare namespace mhchemParser {
  export function go(input: string, stateMachine: string): string;
}

declare namespace texify {
  export function go(input: string, isInner?: boolean): string;
}
