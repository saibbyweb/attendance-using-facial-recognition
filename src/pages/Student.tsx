import { ProfileOption, SectionHeader } from "@/components/SectionHeader";
import { fetchRemoteData } from "@/helpers/api";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function Student() {
  /*  profile options  */
  const [profileOptions, setProfileList] = useState<ProfileOption[]>([
    {
      label: "Fetching...",
      value: "fetching...",
    },
  ]);

  /* active profile  */
  const [activeProfile, setActiveProfile] = useState<ProfileOption>(profileOptions[0]);

  let classesData: any = [];

  /* function to fetch all classes data */
  async function fetchClassesData() {
    const { data } = await fetchRemoteData("class");
    classesData = data.docs;
    fetchStudentData();
  }

  /* fetch student data */
  async function fetchStudentData() {
    const { data } = await fetchRemoteData("student");
    const profileOptions = data.docs.map((point: any) => ({
      ...point,
      label: point.firstName + " " + point.lastName,
      value: point.enrollmentNo,
    }));
    setProfileList(profileOptions);
    setActiveProfile(profileOptions[0]);
  }

  /* update active profile */
  function updateActiveProfile(option: any) {
    setActiveProfile(option);
  }

  useEffect(() => {
    fetchClassesData();
  }, []);

  return (
    <>
      {/* whole page */}
      <Box mt="7vh">
         {/* section header */}
         <SectionHeader profileOptions={profileOptions} activeProfile={activeProfile} updateActiveProfile={updateActiveProfile} />
      </Box>
    </>
  );
}
