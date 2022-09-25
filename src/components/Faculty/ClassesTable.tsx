import { FacultyMember, ClassDetails } from "@/pages/Faculty"
import { Box, Button } from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import Table from "@/components/Table";

/* classes table props */
type ClassesTableProps = {
  width?: string;
  extraColumns?: { title: string; field: string }[];
  activeProfile: FacultyMember;
  updateActiveClass: Function;
  activeClass?: ClassDetails;
};

/* classes table */
export default function ClassesTable({ width, extraColumns, activeProfile, updateActiveClass, activeClass }: ClassesTableProps) {
  /* base columns */
  let columns = [
    { title: "ClassID", field: "classId" },
    { title: "Course", field: "course" },
    { title: "Subject", field: "subject" },
    { title: "Batch", field: "batch" },
    { title: "Semester", field: "semester" },
    {
      title: "Actions",
      field: "classId",
      render: (rowData: any) => {
        return (
          <Button variant={rowData.classId === activeClass?.classId ? "contained" : "text"} onClick={() => updateActiveClass(rowData)}>
            <PreviewIcon />
          </Button>
        );
      },
    },
  ];

  /* append extra columns if available */
  if (extraColumns) columns = [...columns, ...extraColumns].filter((c) => c.title !== "Actions");

  return (
    <Box mt="10px" width={width || "65%"}>
      <Table title="Classes Table" columns={columns} data={activeProfile.classes!} />
    </Box>
  );
}
