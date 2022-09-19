import dayjs, { Dayjs } from "dayjs";
import { Student, DetailsPanelProps } from "@/pages/Faculty"
import { useState } from "react";
import { fetchStudentListInAClass } from "@/helpers/api";
import { theme } from "@/App";
import { Box, Button, Paper, TextField, Typography, Stack } from "@mui/material";
import AddCardIcon from "@mui/icons-material/AddCard";
import Modal from "@mui/material/Modal";
import Table, { TableProps } from "@/components/Table";
import { LoadingButton } from "@mui/lab";
import { UploadFile } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


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

  
export default function DetailsPanel({ activeClass }: DetailsPanelProps) {
    /* attendance modal visibility toggle */
    const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
    /* student list */
    const [studentList, setStudentList] = useState<Student[]>([]);
    /* date */
    const [date, setDate] = useState<Dayjs | null>(null);
  
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
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newValue) => setDate(newValue!)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                {/* submit button */}
               <LoadingButton loading={false} loadingPosition="start" startIcon={<UploadFile />} variant="contained">
                  Submit Attendance
                </LoadingButton>
              </Stack>
            </Stack>
          </Paper>
        </Modal>
      </Box>
    );
  }