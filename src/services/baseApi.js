import axios from "axios";
// import { handleUnauthorizedError } from '@/router'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const baseApi = axios.create({
  baseURL: "http://192.168.1.7:8000/api/",
  // baseURL: 'http://127.0.0.1:8000/api/'
});

// Request Interceptor
baseApi.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log("Error response in interceptors: ", error.response);
    if (error.response && error.response.status === 401) {
      handleUnauthorizedError();
    }
    return Promise.reject(error);
  }
);

export default baseApi;
