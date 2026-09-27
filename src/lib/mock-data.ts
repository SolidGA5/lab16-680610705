import type { Student, Course, Enrollment, ADMIN } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    status: "Active",
    enrolledCourses: []
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    status: "Active",
    enrolledCourses: []
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    status: "Active",
    enrolledCourses: []
  },
];

export const courses: Course[] = [
  {
    courseCode: "CS101",
    courseTitle: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseCode: "CPE301",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseCode: "CPE302",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseCode: "ISNE101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
  {
    courseCode: "CS201",
    courseTitle: "Data Structures",
    instructors: ["Chanadda"],
  },
];

export const enrollments: Enrollment[] = [
  { studentId: "650610002", courseId: "261497" },
  { studentId: "650610003", courseId: "269101" },
  { studentId: "650610003", courseId: "261497" },
];


export const CURRENT_STUDENT_ID = "650610002";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;



export const admin: ADMIN = {
  firstName: "Phuphing",
  lastName: "Chompubang",
  studentId: "680610705",
};
