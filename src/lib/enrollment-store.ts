import { create } from "zustand";

import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";
import { persist } from "zustand/middleware";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  enroll: (studentId: string[], courseId: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string, courseId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  addCourse: (newCourse: Course) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeInstucutre: (name: string, coursesId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  removeCourse: (courseId: string) => void;

};

export const useEnrollmentStore = create<EnrollmentStore>()(persist((set) => ({
  students: initialStudents,
  courses: initialCourses,

  addCourse: (newCourse: Course) => set((state) => ({
    courses: [...state.courses, newCourse]
  })),

  removeCourse: (courseId: string) => set((state) => ({
    courses: state.courses.filter(c => c.courseCode !== courseId)
  })),

  removeInstucutre: (name: string, coursesId: string) => set((state) => ({
    courses: state.courses.map((c: Course) => c.courseCode === coursesId ? { ...c, instructors: c.instructors?.filter(i => i !== name) } : c)
  })),


  enroll: (studentIds: string[], courseId: string) =>
    set((state) => ({
      students: state.students.map((s: Student) =>
        studentIds.includes(s.studentId)
          ? { ...s, enrolledCourses: [...s.enrolledCourses, courseId] }
          : s
      ),
    })),

  removeStudent: (studentId: string, courseId: string) =>
    set((state) => ({
      students: state.students.map((s: Student) => s.studentId == studentId ? { ...s, enrolledCourses: s.enrolledCourses.filter(cId => cId != courseId) } : s)
    })),

}),
  {
    name: "lab16-2569-680610705",
    partialize: (state) => ({
      students: state.students,
      courses: state.courses,
    }
    ),
  }
)
);
