import { FacultyMember, ClassDetails } from "@/pages/Faculty"
import { Box, Button } from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import Table from "@/components/Table";

/* classes table props */
type ClassesTableProps = {
    activeProfile: FacultyMember;
    updateActiveClass: Function;
    activeClass?: ClassDetails;
  };
  
  /* classes table */
  export default function ClassesTable({ activeProfile, updateActiveClass, activeClass }: ClassesTableProps) {
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
  