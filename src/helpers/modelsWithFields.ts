import { TableProps } from "@/components/Table";

/* extra table field props */
type ExtraFieldProps = {
    lookup?: Record<string | number, string | number>
}
export type ModelsWithFields = Record<string, TableProps<{}>['columns'] & ExtraFieldProps>;

/* models with fields */
export const modelsWithFields: ModelsWithFields = {
    class: [
        { title: "Course Code", field: "courseCode" },
        { title: "Subject", field: "subject" },
        { title: "Course", field: "course" },
        { title: "Batch", field: "batch" },
        { title: "Semester", field: "semester" },
        // {
        // render: (rowData) => ( <button onClick={() => console.log(rowData.subject)}>Upload </button>)
        // }
    ],
    faculty: [
        { title: "Employee ID", field: "employeeId" },
        { title: "First Name", field: "firstName" },
        { title: "Last Name", field: "lastName" },
        { title: "Classes", field: "classes" }
    ],
    student: [
        { title: "Enrollment No", field: "enrollmentNo" },
        { title: "First Name", field: "firstName" },
        { title: "Last Name", field: "lastName" },
        // {
        //     title: "Course Code", field: "courseCode",
        //     editComponent: (props: any) => (
        //         <Select options={options} onChange={handleChange} isMulti />
        //     )
        //     // lookup: { "PGDWD": 'PGDWD', "PGDCA": 'PGDCA' },
        // },
        { title: "Batch", field: "batch" }
    ]
} 