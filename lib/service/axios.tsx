import assert from 'assert';
import Axios, { AxiosRequestConfig } from 'axios';
import storage from './storage';

assert(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'env variable not set: NEXT_PUBLIC_API_BASE_URL'
);

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

function authRequestInterceptor(config: AxiosRequestConfig) {
  if (!config.url?.includes('login')) {
    return {
      ...config,
      header: {
        ...config.headers,
        Authorization: 'Bearer ' + storage.token(),
      },
    };
  }
  return config;
}

axios.interceptors.request.use(authRequestInterceptor);
