import { fetchRemoteData } from "@/helpers/api";
import { useEffect } from "react";

export default function Student() {
  let classesData: any = [];

  /* function to fetch all classes data */
  async function fetchClassesData() {
    const { data } = await fetchRemoteData("class");
    classesData = data.docs;
    console.log(classesData);
  }

  useEffect(() => {
    fetchClassesData();
  },[])

  return <h1> Student page </h1>;
}
