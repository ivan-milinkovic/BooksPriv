import axios from "axios";
import { ApiUrl, jsonHeaders } from "./apiConfig";

export const apiAxios = axios.create({
  baseURL: ApiUrl,
  headers: jsonHeaders,
});
