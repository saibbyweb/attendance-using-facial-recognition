import { DetailsPanelProps, Student } from "@/pages/Faculty";
import { useState, useRef, useEffect } from "react";
import { fetchStudentListInAClass } from "@/helpers/api";
import { theme } from "@/App";
import { Box, Button, Typography, Dialog, DialogTitle } from "@mui/material";
import AddCardIcon from "@mui/icons-material/AddCard";
import Modal from "@mui/material/Modal";
import MarkAttendance from "@/components/Faculty/MarkAttendance";
import { FaceMatcher } from "face-api.js";
import { generateFaceMatcher, loadRequiredFaceAPIModels } from "@/helpers/faceRecognition";

export default function DetailsPanel({ activeClass }: DetailsPanelProps) {
  /* attendance modal visibility toggle */
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  /* student list */
  const [studentList, setStudentList] = useState<Student[]>([]);
  /* face recognition response */
  const [responseMsg, setResponseMsg] = useState({ show: false, msg: "" });
  /* face matcher */
  const faceMatcher = useRef<FaceMatcher>();

  /* load face api models and labels */
  useEffect(() => {
    loadFaceAPIModelsAndLabels();
  }, []);

  /* load face api models and labels */
  async function loadFaceAPIModelsAndLabels() {
    setResponseMsg({ show: true, msg: "Loading Face Detection Models & Labels..." });
    await loadRequiredFaceAPIModels();
    faceMatcher.current = await generateFaceMatcher();
    setResponseMsg({ show: false, msg: "" });
  }
  /* fetch student list and open modal */
  async function openModalAndFetchStudentList(classId: string) {
    setOpenAttendanceModal(true);
    const remoteStudentList = await fetchStudentListInAClass(classId);
    setStudentList(remoteStudentList.data);
  }
  /* check recognized students */
  function markRecognizedStudents(recognizedStudents: string[]): string[] {
    let matchedEnrollmentNos: string[] = [];
    const studentListCopy: Student[] = JSON.parse(JSON.stringify(studentList));

    studentListCopy.forEach((student, index) => {
      let foundStudent = recognizedStudents.find((enrollmentNo) => student.enrollmentNo === enrollmentNo);
      if (foundStudent) {
        studentListCopy[index] = { ...student, tableData: { checked: true } };
        matchedEnrollmentNos.push(student.enrollmentNo)
      }
    });
    
    /* update student list (table data) */
    if (matchedEnrollmentNos.length > 0) setStudentList(studentListCopy);

    /* show response dialog for some seconds */
    setResponseMsg({ show: true, msg: `${matchedEnrollmentNos.length} record(s) matched` });
    setTimeout(() => setResponseMsg({ show: false, msg: "" }), 1500);

    return matchedEnrollmentNos;
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
        <MarkAttendance faceMatcher={faceMatcher} classId={activeClass.classId} studentList={studentList} markRecognizedStudents={markRecognizedStudents} />
      </Modal>

      {/* face matching response */}
      <Dialog onClose={() => setResponseMsg({ show: false, msg: "" })} open={responseMsg.show}>
        <DialogTitle>{responseMsg.msg}</DialogTitle>
      </Dialog>
    </Box>
  );
}
