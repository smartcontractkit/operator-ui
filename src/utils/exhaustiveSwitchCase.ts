// Add and use this function to get compile time errors if your switches are not exhaustive.

export function unreachable(
  value: never | undefined,
  message = `No such case in exhaustive switch: ${value}`,
) {
  throw new Error(message)
}

/* Example Usage

enum FooBar {
  foo,
  bar,
  fooBar
}

switch (example) {
  case FooBar.foo:
    return 'Foo';
  case FooBar.bar:
    return 'Bar';
  case FooBar.fooBar:
    return 'FooBar';
  default:
    return unreachable(example);
}
*/
