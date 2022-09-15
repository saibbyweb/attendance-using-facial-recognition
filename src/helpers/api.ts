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

/* crud call */
export async function modifyDatabase(operation:string, modelName: string, payload: unknown) {
    return await defaultAxios.post(CRUD_API, { operation, modelName, payload });
}
  
export async function fetchRemoteData(modelName: string, filters?: Record<string, string>) {
  const response = await defaultAxios.post(CRUD_API, { operation: "read", modelName, filters });
  return response.data;
}
