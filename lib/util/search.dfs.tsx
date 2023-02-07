export type PredicateFn<T> = (data: T, target: any) => boolean;

export type SearchFn<T> = (
  data: T[] | undefined,
  path: number[]
) => null | T | undefined;

export type SearchPathFn<T> = (
  data: T[] | undefined,
  path: number[]
) => number[];

export const searchDFSFactory = <T,>(
  predicate: PredicateFn<T>,
  target: any,
  key: string
): SearchFn<T> => {
  const searchDFS: SearchFn<T> = (
    data: T[] | undefined,
    path: number[] = []
  ) => {
    // if undefined, or if empty array
    if (!data || !data.length) {
      return null;
    }

    const head = data[0];
    const rest = data.slice(1);

    let res: null | T | undefined = null;

    path.push(-data.length);

    if (head) {
      if (predicate(head, target)) {
        return head;
      }

      // search children nodes
      if (head[key]) {
        if ((res = searchDFS(head[key], path))) {
          return res;
        }
      }
    }
    path.pop();

    // search neighbor nodes
    if (rest.length) {
      if ((res = searchDFS(rest, path))) {
        return res;
      }
    }

    return res;
  };

  return searchDFS;
};

export const searchDFSPathFactory = <T,>(
  predicate: PredicateFn<T>,
  target: any,
  key: string
): SearchPathFn<T> => {
  const searchDFSPath: SearchPathFn<T> = (
    data: T[] | undefined,
    path: number[] = []
  ) => {
    // if undefined, or if empty array
    if (!data || !data.length) {
      return path;
    }

    const head = data[0];
    const rest = data.slice(1);

    path.push(-data.length);

    if (head) {
      if (predicate(head, target)) {
        return path;
      }

      // search children nodes
      if (head[key]) {
        const res = searchDFSPath(head[key], path);
        if (res) {
          return res;
        }
      }
    }
    path.pop();

    // search neighbor nodes
    if (rest.length) {
      const res = searchDFSPath(head[key], path);
      if (res) {
        return res;
      }
    }

    return null;
  };

  return searchDFSPath;
};
