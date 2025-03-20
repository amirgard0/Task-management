import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: process.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config): Promise<InternalAxiosRequestConfig> => {
    let token = Cookies.get("access_token");

    if (!token) {
      console.warn("No access token found!");
      return config;
    }

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        const refreshToken = Cookies.get("refresh_token");

        if (refreshToken) {
          try {
            Cookies.remove("access_token")
            Cookies.remove("refresh_token")
            const response = await axios.post(
              `${process.env.VITE_BASE_URL}token/refresh/`,
              { refresh: refreshToken },
              { withCredentials: true }
            );

            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;
            console.log(newAccessToken, newRefreshToken)
            Cookies.set("access_token", newAccessToken);
            Cookies.set("refresh_token", newRefreshToken);

            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          } catch (error) {
            console.error("Token refresh failed:", error);
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
          }
        } else {
          console.warn("No refresh token available!");
          Cookies.remove("access_token");
        }
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Invalid access token format:", error);
      Cookies.remove("access_token");
    }

    return config;
  },
  (error) => { console.log("reject"); return Promise.reject(error) }
);


export default api;