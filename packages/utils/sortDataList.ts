import stringToLower from './stringToLower';

export type SortType = 'asc' | 'desc';

export default function sortDataList<T>(data: T[], sortType: SortType, sortKey: keyof T | undefined = undefined) {
  return [...data].sort((aRecord, bRecord) => {
    let a = sortKey === undefined ? aRecord : aRecord[sortKey],
      b = sortKey === undefined ? bRecord : bRecord[sortKey];

    if (typeof a === 'string' && typeof b === 'string') {
      a = stringToLower(a);
      b = stringToLower(b);
    }

    if (a < b) {
      return sortType === 'asc' ? -1 : 1;
    }

    if (a > b) {
      return sortType === 'asc' ? 1 : -1;
    }

    return 1;
  });
}
