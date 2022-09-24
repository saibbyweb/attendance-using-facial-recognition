import { Box, Paper, TextField, Typography, Stack, Button, Dialog, DialogTitle } from "@mui/material";
import Table from "@/components/Table";
import { LoadingButton } from "@mui/lab";
import { UploadFile, Send, PhotoCamera } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useRef, useState, forwardRef, ForwardedRef } from "react";
import { Dayjs } from "dayjs";
import { Student } from "@/pages/Faculty";
import { updateAttendance } from "@/helpers/api";
import { generateFaceMatcher, loadRequiredFaceAPIModels, detectFaces } from "@/helpers/faceRecognition";
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
  markRecognizedStudents: Function;
};

export default forwardRef(function MarkAttendance({ studentList, classId, markRecognizedStudents }: MarkAttendanceProps, ref: ForwardedRef<any>) {
  /* selected student list */
  const [selectedStudentList, setSelectedStudentList] = useState<string[]>([]);
  /* date */
  const [date, setDate] = useState<Dayjs | null>(null);
  /* error message */
  const [errorMsg, setErrorMsg] = useState("Attendance already updated for this date.");
  /* loading */
  const [loading, setLoading] = useState(false);
  /* upload button ref */
  const uploadButton = useRef<HTMLInputElement | null>(null);
  /* face matcher */
  const faceMatcher = useRef<FaceMatcher>();
  /* load face api models and labels */
  async function loadFaceAPIModelsAndLabels() {
    setLoading(true);
    await loadRequiredFaceAPIModels();
    faceMatcher.current = await generateFaceMatcher();
    setLoading(false);
  }

  /* load face api models and labels */
  useEffect(() => {
      loadFaceAPIModelsAndLabels();
  },[])
  
  /* handle class image change */
  async function handleClassImageChange(event: React.SyntheticEvent<HTMLInputElement>) {
    if(!event.currentTarget.files)
      return;
    const file = event.currentTarget.files[0];
    const detections = await detectFaces(file);
    const results = detections.map(d => faceMatcher.current!.findBestMatch(d.descriptor))
    // results.forEach(result => console.log(result.label))
    const recognizedStudents = results.map(result => result.label).filter(enrollmentNo => enrollmentNo !== "unknown")
    console.log(recognizedStudents);
    markRecognizedStudents(recognizedStudents);

    if(uploadButton.current)
      uploadButton.current.value = "";

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
  function handleSubmitAttendance() {
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
    updateAttendance(classId, date?.toString()!, selectedStudentList);
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
      
      {/* loading dialog */}
      <Dialog onClose={() => setLoading(false)} open={loading}>
      <DialogTitle>Loading Face Detection Models & Labels...</DialogTitle>
     </Dialog>


    </Paper>
  );
});
