export const debounce = (func: any, timeout: number = 400) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
