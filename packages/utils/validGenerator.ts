export type AsyncCallback = Promise<void> | AsyncGenerator<void, void, void>;

const validGenerator = (cb: AsyncCallback): cb is AsyncGenerator<void, void, void> =>
  //@ts-ignore
  typeof cb[Symbol.asyncIterator] === 'function';

export default validGenerator;
