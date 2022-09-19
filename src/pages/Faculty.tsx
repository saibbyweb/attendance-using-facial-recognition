import { theme } from "@/App";
import ProfileSwitch from "@/components/ProfileSwitch";
import { fetchRemoteData } from "@/helpers/api";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ClassesTable from "@/components/Faculty/ClassesTable";
import DetailsPanel from "@/components/Faculty/DetailsPanel";

/* profile option type */
export type ProfileOption = {
  label: string;
  value: string;
};

export type FacultyMember = ProfileOption & {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  classes?: Array<any>;
};

export default function Faculty() {
  // a click on the class id should fetch the list of students for the class
  // there should be some action buttons, one of taking attendance, one for viewing attendance
  // a date selector component might also be needed

  // take attendance button will show a modal to upload an image
  // image is then processed by the face api and *THE MAGIC HAPPENS*
  // the list of all students will popup with those being present having a check mark
  // checkboxes can be manually be marked or unmarked
  // then a button can finalize the attendace and sent it to server to update the database
  // a success message and failure message component may also be needed

  // show attedance modal will populate the list of students in a table with the attendance details (total classes, classes attended, attendance %, shortage)

  // SIDE_NOTE: student list in the admin panel should have an option to upload an image

  /* state */
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
        {/* faculty header */}
        <FacultyHeader profileOptions={profileOptions} activeProfile={activeProfile} updateActiveProfile={updateActiveProfile} />
        {/* content part */}
        <Box sx={{ display: "flex" }} gap={1}>
          {/* classes table */}
          <ClassesTable activeProfile={activeProfile} activeClass={activeClass} updateActiveClass={updateActiveClass} />
          {/* details panel */}
          {activeClass && <DetailsPanel activeClass={activeClass!} />}
        </Box>
      </Box>
    </>
  );
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



/* faculty header props */
type FacultyHeaderProps = {
  profileOptions: ProfileOption[];
  activeProfile: ProfileOption;
  updateActiveProfile: Function;
};

/* faculty header component */
function FacultyHeader({ profileOptions, activeProfile, updateActiveProfile }: FacultyHeaderProps) {
  return (
    <Box
      padding="10px"
      borderRadius="4px"
      sx={{
        display: "flex",
      }}
      justifyContent="space-around"
      bgcolor="white"
    >
      <Typography variant="h4" color={theme.palette.primary.dark} sx={{ width: "50%" }}>
        👋 Hi, {activeProfile.label}
      </Typography>
      <ProfileSwitch options={profileOptions} updateActiveProfile={updateActiveProfile} activeProfile={activeProfile} />
    </Box>
  );
}
