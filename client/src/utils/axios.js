import axios from 'axios';
import { LOCAL_TOKEN } from '../actions/types';

// Set dev = true to test the service worker in the build folder
const dev = true;
const http = axios.create({
  baseURL: !dev ? 'http://localhost:5000' : null
});

http.interceptors.request.use(
  config => {
    const token = localStorage.getItem(LOCAL_TOKEN);
    if (token) config.headers.authorization = token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
