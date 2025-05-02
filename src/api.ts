import axios from "axios";

export const api = axios.create({
  baseURL: "https://todo-backend-ten.vercel.app/",
  withCredentials: true,
});
