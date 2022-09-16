import { theme } from "@/App";
import ProfileSwitch from "@/components/ProfileSwitch";
import { fetchRemoteData } from "@/helpers/api";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Table, { TableProps } from "@/components/Table";

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
  // done: fetch faculty list
  // done: there should be an option to switch profile
  // done: change in profile should refetch data
  // done: a list of classes should be fetched on being mounted
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

  /* function to fetch all faculty data as profile options */
  async function fetchFacultyData() {
    const { data } = await fetchRemoteData("faculty");
    const profileOptions = data.docs.map((point: any) => ({
      label: point.firstName + " " + point.lastName,
      value: point.employeeId,
      ...point,
    }));
    setProfileList(profileOptions);
    setActiveProfile(profileOptions[0]);
  }

  /* fetch all faculty data once on being mounted */
  useEffect(() => {
    fetchFacultyData();
  }, []);

  /* update active profile */
  function updateActiveProfile(option: any) {
    setActiveProfile(option);
  }

  return (
    <>
      {/* whole page */}
      <Box mt="7vh">
        {/* top part */}
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
            {" "}
            👋 Hi, {activeProfile.label}{" "}
          </Typography>
          <ProfileSwitch options={profileOptions} updateActiveProfile={updateActiveProfile} activeProfile={activeProfile} />
        </Box>
        {/* content part */}
        <Box sx={{display: 'flex'}} >
          {/* classes table */}
          <Box mt="10px">
          <Table
                title="Classes Table"
                columns={[
                  { title: "ClassID", field: "classId" },
                  // { title: "Course Code", field: "courseCode" },
              
                  { title: "Course", field: "course" },
                  { title: "Subject", field: "subject" },
                  { title: "Batch", field: "batch" },
                  { title: "Semester", field: "semester" }]}
                  data={[]}
            
            />
          </Box>
          {/* details panel */}
        
        </Box>
      </Box>
    </>
  );
}
