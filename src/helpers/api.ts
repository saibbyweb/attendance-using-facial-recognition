import axios from "axios";
/* setting default base URL for axios */
let serverBaseURL;
try {
  serverBaseURL = import.meta.env.DEV ? "http://" + location.hostname + ":" + import.meta.env.VITE_SERVER_PORT : "";
} catch (e) {
  serverBaseURL = "";
}
/* default axios instance with base URL */
export const defaultAxios = axios.create({
  baseURL: serverBaseURL,
});

/* urls */
const CRUD_API = "/crud";

export function saveToDatabase(modelName: string, payload: unknown) {
  defaultAxios.post(CRUD_API, { operation: "add", modelName, payload });
}

export async function fetchRemoteData(modelName: string) {
    const response = await defaultAxios.post(CRUD_API, { operation: "read", modelName })
    return response.data;
}