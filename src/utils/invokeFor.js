// Like forEach, but also for non-array values
export function invokeFor(fn, value) {
  if (Array.isArray(value)) {
    value.forEach(x => fn(x));
  } else {
    fn(value);
  }
}
