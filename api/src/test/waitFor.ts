export const waitFor = async (cb: () => unknown) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      cb();
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  }
};
