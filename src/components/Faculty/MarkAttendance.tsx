import { Box, Paper, TextField, Typography, Stack } from "@mui/material";
import Table from "@/components/Table";
import { LoadingButton } from "@mui/lab";
import { UploadFile } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { Student } from "@/pages/Faculty";

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
};

export default function MarkAttendance({ studentList }: MarkAttendanceProps) {
  /* date */
  const [date, setDate] = useState<Dayjs | null>(null);

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
            onSelectionChange={(selectedStudents: Student[]) => console.log(selectedStudents.map((stu) => stu.enrollmentNo))}
          />
        </Box>
        {/* attendance actions */}
        <Stack gap="20px" alignItems="space-around" justifyContent="space-between">
          {/* upload image */}
          <LoadingButton loading={false} loadingPosition="start" startIcon={<UploadFile />} variant="contained">
            Upload Class Image
          </LoadingButton>
          {/* calendar */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Select Date" value={date} onChange={(newValue) => setDate(newValue!)} renderInput={(params) => <TextField {...params} />} />
          </LocalizationProvider>
          {/* submit button */}
          <LoadingButton loading={false} loadingPosition="start" startIcon={<UploadFile />} variant="contained">
            Submit Attendance
          </LoadingButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
