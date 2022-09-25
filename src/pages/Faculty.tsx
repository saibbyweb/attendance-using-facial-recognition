import { fetchRemoteData } from "@/helpers/api";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ClassesTable from "@/components/Faculty/ClassesTable";
import DetailsPanel from "@/components/Faculty/DetailsPanel";
import { SectionHeader, ProfileOption } from "@/components/SectionHeader";


export type FacultyMember = ProfileOption & {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  classes?: Array<any>;
};

export default function Faculty() {

  /*  profile options  */
  const [profileOptions, setProfileList] = useState<FacultyMember[]>([
    {
      label: "Fetching...",
      value: "fetching...",
    },
  ]);

  /* active profile  */
  const [activeProfile, setActiveProfile] = useState<FacultyMember>(profileOptions[0]);

  /* active class */
  const [activeClass, setActiveClass] = useState<ClassDetails>();

  let classesData: any = [];

  /* function to fetch all classes data */
  async function fetchClassesData() {
    const { data } = await fetchRemoteData("class");
    classesData = data.docs;
    fetchFacultyData();
  }

  /* find class detail by id */
  function getClassDetails(classId: string) {
    return classesData.find((classPoint: any) => classPoint.classId === classId);
  }

  /* function to fetch all faculty data as profile options */
  async function fetchFacultyData() {
    const { data } = await fetchRemoteData("faculty");
    const profileOptions = data.docs.map((point: any) => ({
      ...point,
      label: point.firstName + " " + point.lastName,
      value: point.employeeId,
      classes: point.classes.map((classPoint: any) => getClassDetails(classPoint.value)),
    }));
    setProfileList(profileOptions);
    setActiveProfile(profileOptions[0]);
  }

  /* fetch all faculty data once on being mounted */
  useEffect(() => {
    fetchClassesData();
  }, []);

  /* update active profile */
  function updateActiveProfile(option: any) {
    setActiveProfile(option);
  }

  /* update active class */
  function updateActiveClass(classDetails: ClassDetails) {
    setActiveClass(classDetails);
  }

  return (
    <>
      {/* whole page */}
      <Box mt="7vh">
        {/* section header */}
        <SectionHeader profileOptions={profileOptions} activeProfile={activeProfile} updateActiveProfile={updateActiveProfile} />
        {/* content part */}
        <Box sx={{ display: "flex" }} gap={1}>
          {/* classes table */}
          <ClassesTable activeProfile={activeProfile} activeClass={activeClass} updateActiveClass={updateActiveClass} />
          {/* details panel */}
          {activeClass && <DetailsPanel activeClass={activeClass!} />}
        </Box>
      </Box>
    </>
  )
}
/* student */
export type Student = {
  id: string;
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  courseCode: string;
  batch: string;
  classes: any;
  tableData?: {
    checked: boolean
  }
};

/* class details */
export type ClassDetails = {
  classId: string;
  course: string;
  subject: string;
  batch: string;
  semester: string;
};

/* type details panel */
export type DetailsPanelProps = {
  activeClass: ClassDetails;
};