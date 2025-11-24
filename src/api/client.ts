// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-sankhya-fila-conferencia-6bbe82fb50b8.herokuapp.com",
  timeout: 10000,
});
