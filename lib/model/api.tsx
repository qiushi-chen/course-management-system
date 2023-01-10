export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface QueryParams {
  [key: string]: string | number;
}

export interface Paginator {
  page: number;
  limit: number;
  total: number;
}

export interface ListResponse {
  total: number;
  paginator?: Paginator;
}

export interface BaseType {
  id: number;
  name: string;
}
