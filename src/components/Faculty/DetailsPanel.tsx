import { DetailsPanelProps, Student } from "@/pages/Faculty";
import { useState } from "react";
import { fetchStudentListInAClass } from "@/helpers/api";
import { theme } from "@/App";
import { Box, Button, Typography } from "@mui/material";
import AddCardIcon from "@mui/icons-material/AddCard";
import Modal from "@mui/material/Modal";
import MarkAttendance from "@/components/Faculty/MarkAttendance";

export default function DetailsPanel({ activeClass }: DetailsPanelProps) {
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
  /* check recognized students */
  function markRecognizedStudents(recognizedStudents: string[]) {
    const studentListCopy: Student[] = JSON.parse(JSON.stringify(studentList));
    studentListCopy.forEach((student, index) => {
      let foundStudent = recognizedStudents.find(enrollmentNo => student.enrollmentNo === enrollmentNo)
      if(foundStudent) 
        studentListCopy[index] = {...student, tableData: { checked: true }}
    })
    // console.log(studentListCopy);
    setStudentList(studentListCopy)
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
            <MarkAttendance classId={activeClass.classId} studentList={studentList} markRecognizedStudents={markRecognizedStudents} />
      </Modal>
    </Box>
  );
}
