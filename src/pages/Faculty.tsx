import { theme } from "@/App";
import ProfileSwitch from "@/components/ProfileSwitch";
import { fetchRemoteData, fetchStudentListInAClass } from "@/helpers/api";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Table, { TableProps } from "@/components/Table";
import PreviewIcon from "@mui/icons-material/Preview";
import AddCardIcon from "@mui/icons-material/AddCard";
import Modal from "@mui/material/Modal";
import { style } from "@mui/system";
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
type Student = {
  id: string,
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  courseCode: string;
  batch: string;
  classes: any;
};

/* class details */
type ClassDetails = {
  classId: string;
  course: string;
  subject: string;
  batch: string;
  semester: string;
};

/* type details panel */
type DetailsPanelProps = {
  activeClass: ClassDetails;
};

const ModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '70%',
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DetailsPanel({ activeClass }: DetailsPanelProps) {
  /* attendance modal visibility toggle */
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  /* student list */
  const [studentList, setStudentList] = useState<Student[]>([]);

  /* fetch student list and open modal */
  async function openModalAndFetchStudentList(classId: string) {
    setOpenAttendanceModal(true);
    const remoteStudentList = await fetchStudentListInAClass(classId);
    setStudentList(remoteStudentList.data);
  }

  return (
    <Box mt="10px" width="33%" borderRadius={2} sx={{ backgroundColor: "white" }}>
      <Typography variant="h5" color={theme.palette.primary.dark}>
        {activeClass.classId}
      </Typography>
      {/* actions bar */}
      <Box>
        <Button variant="contained" onClick={() => openModalAndFetchStudentList(activeClass.classId)}>
          <AddCardIcon sx={{ marginRight: "10px" }} />
          Take Attendance
        </Button>
      </Box>
      {/* attendance modal */}
      <Modal open={openAttendanceModal} onClose={() => setOpenAttendanceModal(false)}>
        <Paper sx={ModalStyle}>
          <Typography variant="h4"> Student List </Typography>
          <Box width="80%">
          <Table
                title="Classes Table"
                columns={[
                  { title: "Enrollment No.", field: "enrollmentNo" },
                  { title: "First Name", field: "firstName" },
                  { title: "Last Name", field: "lastName" },
                  { title: "Course Code", field: "courseCode" },
                  { title: "Batch", field: "batch" },
                ]}
                data={studentList}
                enableSelection
                onSelectionChange={(selectedStudents: Student[]) => console.log(selectedStudents.map(stu => stu.enrollmentNo))}
              />
              </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

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

/* classes table props */
type ClassesTableProps = {
  activeProfile: FacultyMember;
  updateActiveClass: Function;
  activeClass?: ClassDetails;
};

/* classes table */
function ClassesTable({ activeProfile, updateActiveClass, activeClass }: ClassesTableProps) {
  return (
    <Box mt="10px" width="65%">
      <Table
        title="Classes Table"
        columns={[
          { title: "ClassID", field: "classId" },
          { title: "Course", field: "course" },
          { title: "Subject", field: "subject" },
          { title: "Batch", field: "batch" },
          { title: "Semester", field: "semester" },
          {
            title: "Actions",
            field: "classId",
            render: (rowData) => {
              return (
                <Button variant={rowData.classId === activeClass?.classId ? "contained" : "text"} onClick={() => updateActiveClass(rowData)}>
                  <PreviewIcon />
                </Button>
              );
            },
          },
        ]}
        data={activeProfile.classes!}
      />
    </Box>
  );
}
