import { Box, Paper, TextField, Typography, Stack, Button } from "@mui/material";
import Table from "@/components/Table";
import { LoadingButton } from "@mui/lab";
import { UploadFile, Send, PhotoCamera } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useRef, useState } from "react";
import { Dayjs } from "dayjs";
import { Student } from "@/pages/Faculty";
import { updateAttendance } from "@/helpers/api";

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
};

export default function MarkAttendance({ studentList, classId }: MarkAttendanceProps) {
  /* selected student list */
  const [selectedStudentList, setSelectedStudentList] = useState<string[]>([]);
  /* date */
  const [date, setDate] = useState<Dayjs | null>(null);
  /* error message */
  const [errorMsg, setErrorMsg] = useState("Attendance already updated for this date.");
  /* ref for class image */
  const classImage = useRef<HTMLInputElement | null>(null);
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
          {/* upload image */}
          {/* <LoadingButton loading={false} loadingPosition="start" startIcon={<UploadFile />} variant="contained">
            Upload Class Image
          </LoadingButton> */}

          <Button variant="contained" component="label">
            <PhotoCamera />
            &nbsp; Upload Class Image
            <input ref={classImage} hidden accept="image/*" multiple type="file" />
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
    </Paper>
  );
}
