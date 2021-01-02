import axios, { AxiosError } from 'axios';
import { store } from '../redux/store';
import { authLogout } from '../redux/actions/auth';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
        const refreshToken = localStorage.getItem('refreshToken');
        return instance
          .post('/auth/refresh-token', { refreshToken })
          .then(res => {
            const { accessToken, refreshToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            originalReq.headers['Authorization'] = `Bearer ${accessToken}`;

            return instance(originalReq);
          })
          .catch((err: AxiosError) => {
            // @ts-ignore
            store.dispatch(authLogout());
            throw err;
          });
      }
      return Promise.reject(error);
    },
  );
}

export default instance;
