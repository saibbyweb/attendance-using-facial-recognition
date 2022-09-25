import ClassesTable from "@/components/Faculty/ClassesTable";
import { ProfileOption, SectionHeader } from "@/components/SectionHeader";
import { fetchRemoteData } from "@/helpers/api";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { ClassDetails } from "@/pages/Faculty";

export default function Student() {
  /*  profile options  */
  const [profileOptions, setProfileList] = useState<ProfileOption[]>([
    {
      label: "Fetching...",
      value: "fetching...",
    },
  ]);

  /* active profile  */
  const [activeProfile, setActiveProfile] = useState<ProfileOption>(profileOptions[0]);

  /* active class */
  const [activeClass, setActiveClass] = useState<ClassDetails>();

  let classesData: any = [];

  /* function to fetch all classes data */
  async function fetchClassesData() {
    const { data } = await fetchRemoteData("class");
    classesData = data.docs;
    fetchStudentData();
  }

  /* find class detail by id */
  function getClassDetails(classId: string) {
    return classesData.find((classPoint: any) => classPoint.classId === classId);
  }

  /* attendance record */
  type AttendanceRecord = {
    date: string;
    studentList: string[];
  };

  /* calculate attendance */
  function calculateAttendance(attendance: AttendanceRecord[], enrollmentNo: string) {
    /* attendance data  */
    const attendanceData = {
      totalClasses: attendance.length,
      attendedClasses: 0,
      percentage: "",
    };

    /* calculate attended classes */
    attendance.forEach((record) => {
      if (record.studentList.includes(enrollmentNo)) attendanceData.attendedClasses++;
    });

    /* calculate percentage */
    attendanceData.percentage = ((attendanceData.attendedClasses / attendanceData.totalClasses) * 100).toFixed(2) + "%";
    return attendanceData;
  }

  /* fetch student data */
  async function fetchStudentData() {
    const { data } = await fetchRemoteData("student");
    const profileOptions = data.docs.map((student: any) => ({
      ...student,
      label: student.firstName + " " + student.lastName + ` (${student.enrollmentNo})`,
      value: student.enrollmentNo,
      classes: student.classes.map((classPoint: any) => {
        const classData = getClassDetails(classPoint.value);
        const attendanceData = calculateAttendance(classData.attendance, student.enrollmentNo);
        return { ...classData, ...attendanceData };
      }),
    }));
    setProfileList(profileOptions);
    setActiveProfile(profileOptions[0]);
  }

  /* update active profile */
  function updateActiveProfile(option: any) {
    setActiveProfile(option);
  }

  /* update active class */
  function updateActiveClass(classDetails: ClassDetails) {
    setActiveClass(classDetails);
  }

  useEffect(() => {
    fetchClassesData();
  }, []);
    
  /* extra columns for classes table */
  const extraColumns = [
    { title: "Total Classes", field: "totalClasses" },
    { title: "Attended Classes", field: "attendedClasses" },
    { title: "Percentage", field: "percentage" },
  ];

  return (
    <>
      {/* whole page */}
      <Box mt="7vh">
        {/* section header */}
        <SectionHeader profileOptions={profileOptions} activeProfile={activeProfile} updateActiveProfile={updateActiveProfile} />
        {/* content part */}
        <Box sx={{ display: "flex" }} gap={1}>
          {/* classes table */}
          <ClassesTable width="100%" extraColumns={extraColumns} activeProfile={activeProfile} activeClass={activeClass} updateActiveClass={updateActiveClass} />
          {/* details panel */}
        </Box>
      </Box>
    </>
  );
}
