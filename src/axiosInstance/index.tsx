import axios, { AxiosError } from 'axios';
import { store } from '../redux/store';
import { authLogout, authTokenRefresh } from '../redux/actions/auth';

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(config => {
  const route = config.url?.split('/')[1];
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken !== 'undefined' && route != 'auth') {
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  }
  return config;
});

interface HaultedReqCb {
  (newAccessToken: string): void;
}

let isRefreshing = false;
let tokenSubscribers: HaultedReqCb[] = [];

const onRefreshed = (newAccessToken: string) => {
  tokenSubscribers.forEach(cb => cb(newAccessToken));
};

const subscribeTokenRefresh = (haultedReqCb: HaultedReqCb) => {
  tokenSubscribers.push(haultedReqCb);
};

if (process.env.NODE_ENV !== 'test') {
  instance.interceptors.response.use(
    value => value,
    async error => {
      const originalReq = error.config;
      const errorResponse = error.response;
      if (
        errorResponse.status === 401 &&
        errorResponse.data.message === 'jwt expired'
      ) {
        if (!isRefreshing) {
          const refreshToken = localStorage.getItem('refreshToken');
          isRefreshing = true;
          instance
            .post('/auth/refresh-token', { refreshToken })
            .then(res => {
              const { accessToken, refreshToken, expiresIn } = res.data;
              const expirationDate = new Date().getTime() + expiresIn * 1000;

              store.dispatch(
                authTokenRefresh(accessToken, refreshToken, expirationDate),
              );
              isRefreshing = false;
              onRefreshed(accessToken);
            })
            .catch((err: AxiosError) => {
              // @ts-ignore
              store.dispatch(authLogout());
              //throw err;
            });
        }

        return new Promise(resolve => {
          subscribeTokenRefresh(accessToken => {
            originalReq.headers.Authorization = `Bearer ${accessToken}`;
            resolve(instance(originalReq));
          });
        });
      }
      return Promise.reject(error);
    },
  );
}

export default instance;
