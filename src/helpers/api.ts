import axios from "axios";
/* setting default base URL for axios */
const serverBaseURL = import.meta.env.DEV ? "http://" + location.hostname + ":" + import.meta.env.VITE_SERVER_PORT : "";
console.log(import.meta.env);
/* default axios instance with base URL */
export const defaultAxios = axios.create({
  baseURL: serverBaseURL,
});

/* urls */
const CRUD_API = '/crud';

export function saveToDatabase(modelName: string, payload: unknown) {
    defaultAxios.post(CRUD_API, { operation: 'add', modelName, payload  })
}
