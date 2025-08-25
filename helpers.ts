export const tryTo = <A extends (...args: any[]) => any>(action: A) => {
  try {
    const data = action();
    return [data, null] as [ReturnType<A>, null];
  } catch (error) {
    return [null, error as Error] as [null, Error];
  }
};
