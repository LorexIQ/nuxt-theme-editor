type Pipe = <
  TInput,
  TFunctions extends [(arg: TInput) => any, ...Array<(arg: any) => any>]
>(
  initial: TInput,
  ...functions: TFunctions
) => TFunctions extends [...infer _, (arg: any) => infer TLast]
  ? TLast
  : never;

const pipe: Pipe = (initial, ...functions) => {
  return functions.reduce((value, fn) => fn(value), initial) as any;
};

export default pipe;
