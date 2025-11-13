import axios from "axios";
import { appConfig } from "@/constants/appConfig";

const axiosInstance = axios.create({
  baseURL: appConfig.api.url,
});

console.log(appConfig.api.url);

export default axiosInstance;
