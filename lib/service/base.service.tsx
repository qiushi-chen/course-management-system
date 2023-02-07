import { message } from 'antd';
import { AxiosError } from 'axios';
import { IResponse, QueryParams } from '../model/api';
import { axios } from './axios';

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);

    if (params) {
      path = `${path}?${Object.entries(params)
        .map((key, value) => `${key}=${value}`)
        .join('&')}`;
    }

    return axios
      .get(path)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axios
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axios
      .put(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axios
      .delete(this.getPath(path))
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected isError(code: number): boolean {
    const str = code.toString();
    return !(str.startsWith('2') || str.startsWith('3'));
  }

  protected showMessage =
    (isSuccess = false) =>
    (res: IResponse): IResponse => {
      const { code, msg } = res;
      const isError = this.isError(code);

      if (isError) {
        message.error(msg);
      }

      if (isSuccess && !isError) {
        message.success(msg);
      }

      return res;
    };

  private getPath(path: IPath): string {
    return Array.isArray(path) ? path.join('/') : String(path);
  }

  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response?.data.msg ?? 'unknown error';
    const code = err.response?.status ?? -1;

    if (!err.response) {
      console.error(
        '%c [ err ]-149',
        'font-size:13px; background:pink; color: #bf2c9f;',
        err
      );
    }
    return { msg, code };
  }
}

export default BaseApiService;
