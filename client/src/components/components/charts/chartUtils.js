export const memoize = fn => {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    fn.cache = fn.cache || {};
    return fn.cache[args]
      ? fn.cache[args]
      : (fn.cache[args] = fn.apply(this, args));
  };
};
