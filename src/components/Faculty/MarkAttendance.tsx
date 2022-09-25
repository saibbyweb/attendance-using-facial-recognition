import { Box, Paper, TextField, Typography, Stack, Button, Dialog, DialogTitle } from "@mui/material";
import Table from "@/components/Table";
import { LoadingButton } from "@mui/lab";
import { Send, PhotoCamera } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useRef, useState, forwardRef, ForwardedRef, MutableRefObject } from "react";
import { Dayjs } from "dayjs";
import { Student } from "@/pages/Faculty";
import { updateAttendance } from "@/helpers/api";
import { detectFaces } from "@/helpers/faceRecognition";
import { FaceMatcher } from "face-api.js";

const ModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type MarkAttendanceProps = {
  studentList: Student[];
  classId: string;
  markRecognizedStudents(recognizedStudents: string[]) : string[];
  faceMatcher: MutableRefObject<FaceMatcher | undefined>;
};

export default forwardRef(function MarkAttendance({ studentList, classId, markRecognizedStudents, faceMatcher }: MarkAttendanceProps, ref: ForwardedRef<any>) {
  /* selected student list */
  const [selectedStudentList, setSelectedStudentList] = useState<string[]>([]);
  /* date */
  const [date, setDate] = useState<Dayjs | null>(null);
  /* error message */
  const [errorMsg, setErrorMsg] = useState("");
  /* response msg */
  const [responseMsg, setResponseMsg] = useState({ show: false, msg: "" });
  /* upload button ref */
  const uploadButton = useRef<HTMLInputElement | null>(null);

  /* handle class image change */
  async function handleClassImageChange(event: React.SyntheticEvent<HTMLInputElement>) {
    if(!event.currentTarget.files)
      return;
    const file = event.currentTarget.files[0];
    const detections = await detectFaces(file);
    const results = detections.map(d => faceMatcher.current!.findBestMatch(d.descriptor))
    const recognizedStudents = results.map(result => result.label).filter(enrollmentNo => enrollmentNo !== "unknown")
    const matchedEnrollmentNos = markRecognizedStudents(recognizedStudents);
    
    /* reset file selection */
    if(uploadButton.current)
      uploadButton.current.value = "";

    /* update student selection */
    setSelectedStudentList([...new Set([...selectedStudentList, ...matchedEnrollmentNos])])
  }

  /* handle date change */
  function handleDateChange(value: any | null) {
    setDate(value.$d);
    setErrorMsg("");
  }
  /* handle student selection change */
  function handleStudentSelectionChange(selectedStudents: Student[]) {
    setErrorMsg("");
    const enrollmentNos = selectedStudents.map((stu) => stu.enrollmentNo);
    setSelectedStudentList(enrollmentNos);
  }

  /* handle submit attendance */
  async function handleSubmitAttendance() {
    /* if no student selected */
    if (!selectedStudentList.length) {
      setErrorMsg("Please select atleast one student");
      return;
    }
    /* if no date selected */
    if (!date) {
      setErrorMsg("Plese select a date first");
      return;
    }
    /* show dialog depicting network call initialization  */
    setResponseMsg({show: true, msg: "Updating attendance"})
    const response = await updateAttendance(classId, date?.toString()!, selectedStudentList);
    
    /* show error message and clear response dialog */
    if(response.msg === "already_updated") {
      setErrorMsg("Attendance already updated for this date and class");
      setResponseMsg({show: false, msg: ""});
      return;
    }
    
    /* show confirmation dialog */
    setResponseMsg({show: true, msg: "✅ Database records updated"});
    setTimeout(() => setResponseMsg({show: false, msg: ""}), 1500);
  }

  return (
    <Paper sx={ModalStyle}>
      <Typography variant="h4"> Student List </Typography>
      {/* student list and attendance actions */}
      <Stack direction="row" gap="20px">
        {/* student list */}
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
            onSelectionChange={handleStudentSelectionChange}
          />
        </Box>
        {/* attendance actions */}
        <Stack gap="20px" justifyContent="flex-end">
          <Button variant="contained" component="label">
            <PhotoCamera />
            &nbsp; Upload Class Image
            <input ref={uploadButton} onChange={handleClassImageChange} hidden accept="image/*" multiple type="file" />
          </Button>
          {/* calendar */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Select Date" value={date} onChange={handleDateChange} renderInput={(params) => <TextField {...params} />} />
          </LocalizationProvider>
          {/* submit button */}
          <LoadingButton loading={false} loadingPosition="start" startIcon={<Send />} variant="contained" onClick={handleSubmitAttendance}>
            Submit Attendance
          </LoadingButton>
          {/* error */}
          <Typography variant="body2" color="error" align="center">
            {errorMsg}
          </Typography>
        </Stack>
      </Stack>

      <Dialog onClose={() => setResponseMsg({ show: false, msg: "" })} open={responseMsg.show}>
        <DialogTitle>{responseMsg.msg}</DialogTitle>
      </Dialog>
    </Paper>
  );
});
