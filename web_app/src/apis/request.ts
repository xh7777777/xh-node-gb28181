import axios from "axios";
import store from "../store/configure";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? import.meta.env.VITE_PROD_URL
      : import.meta.env.VITE_DEV_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});


axiosInstance.interceptors.request.use(
    function (config) {
      const { accessToken } =
        store.getState().userInfo;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  export default axiosInstance;