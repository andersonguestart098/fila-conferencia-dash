// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-fila-backup-b77fd15314e7.herokuapp.com",
  timeout: 10000,
});
