import { Student } from "@/pages/Faculty";
import axios from "axios";
import dayjs from "dayjs";
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
const GET_STUDENT_LIST_API = "/getStudentsInAClass";
const UPDATE_ATTENDANCE_API = "/updateAttendance";

/* crud call */
export async function modifyDatabase(operation:string, modelName: string, payload: unknown) {
    return await defaultAxios.post(CRUD_API, { operation, modelName, payload });
}
  
export async function fetchRemoteData(modelName: string, filters?: Record<string, string>) {
  const response = await defaultAxios.post(CRUD_API, { operation: "read", modelName, filters });
  return response.data;
}
/* fetch student list in a class */
export async function fetchStudentListInAClass(classId: string) {
  const response = await defaultAxios.post(GET_STUDENT_LIST_API, { classId })
  return response.data;
}

/* update attendance for a class */
export async function updateAttendance(classId: string, date: string, studentList:Student[]) {
  const response = await defaultAxios.post(UPDATE_ATTENDANCE_API, { classId, date, studentList});
  return response.data;
}
