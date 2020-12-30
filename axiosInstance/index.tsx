import axios from 'axios';

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

export default instance;
