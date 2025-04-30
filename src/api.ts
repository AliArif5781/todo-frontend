import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "todo-backend-production-d1a9.up.railway.app",
  withCredentials: true,
});
