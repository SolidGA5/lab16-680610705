import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEnrollmentStore } from "@/lib/enrollment-store"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Course } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { CirclePlus, Trash2, X } from "lucide-react"
import React, { useState } from "react"
import { Label } from "@/components/ui/label"
function DelAlert({ courseId }: { courseId: string }) {
  const { removeCourse } = useEnrollmentStore();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const handleDel = (courseId: string) => {
    removeCourse(courseId)
    setOpenAlert(false);
  }
  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogTrigger
        render={<Button variant="ghost"
          size="icon"
          className="h-4 w-4 rounded-full text-red-500 p-0"
        ><Trash2 className="h-0.5 w-0.5" /></Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ลบวิชา?</AlertDialogTitle>
          <AlertDialogDescription>
            ลบ {courseId} — Introduction to Programming ออกจากรายวิชาที่เปิดสอน
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => handleDel(courseId)}>ยืนยัน</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}




function AddDialog() {
  const { addCourse } = useEnrollmentStore();
  const [CourseInstructur, setCourseInstructur] = useState<string[] | null>([]);
  const [opened, setOpenClose] = useState(false)
  const [CourseCode, setCourseCode] = useState<string>("")
  const [CourseTitle, setCourseTitle] = useState<string>("")
  const handleAdd = (code: string, title: string, instructors: string[]) => {
    const thisCourse: Course = {
      courseCode: code,
      instructors: instructors,
      courseTitle: title
    }
    addCourse(thisCourse)
    setOpenClose(false);
    setCourseInstructur([])
    setCourseCode("")
    setCourseTitle("")
  }
  const { courses } = useEnrollmentStore();

  const isDuplicate = !(courses.find(c => c.courseCode === CourseCode.toUpperCase()) == undefined)

  function createInstucutre() {
    const instructors: string[] = [];
    courses.forEach(c => {
      c.instructors?.forEach(i => {
        if (!instructors.includes(i)) {
          instructors.push(i);
        }
      });
    });
    return instructors;
  }
  return <Dialog open={opened} onOpenChange={setOpenClose}>
    <form>
      <DialogTrigger render={<Button onClick={() => setOpenClose(true)}><CirclePlus></CirclePlus>เพิ่มวิชา</Button>} />
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
          <DialogDescription className={"space-y-2"}>
            วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
          </DialogDescription>
          <div className="space-y-2">
            <Label htmlFor="courseId">รหัสวิชา</Label>
            <Input
              onChange={e => setCourseCode(e.target.value)}
              type="text"
              value={CourseCode}
              placeholder="เช่น CPE303"
              aria-invalid={isDuplicate}
            />
            {
              isDuplicate && <div className="text-sm text-destructive invalid-feedback">
                มีรหัสวิชา {CourseCode.toUpperCase()} นี้แล้ว
              </div>
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseTitle">ชื่อวิชา</Label>
            <Input
              onChange={e => setCourseTitle(e.target.value)}
              type="text"
              value={CourseTitle}
              placeholder="เช่น Mobile Application Development"
            />
          </div>
          <Label htmlFor="courseTitle">ผู้สอน</Label>
          <MultiSelet choice={createInstucutre()} placeHolder="เลือก" onChange={v => setCourseInstructur(v)}
          ></MultiSelet>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" disabled={CourseCode === "" || CourseTitle === ""} onClick={() => handleAdd(CourseCode.toUpperCase(),
            CourseTitle, CourseInstructur == null ? [] : CourseInstructur)}>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog >
}


function MultiSelet({ choice, placeHolder, onChange }:
  { choice: string[], placeHolder: string, onChange: (v: string[]) => void }) {
  const anchor = useComboboxAnchor();
  const [newInsturctre, setNewInsturcture] = useState("")
  const [boxValue, setBoxValue] = useState<string[]>([])
  const [choices, setChoices] = useState(choice)
  function isNewInsturctre(name: string) {
    if (name === "") {
      return true;
    }
    return choice.includes(name);
  }
  function addNewInsturcture(name: string, oldData: string[]) {
    setBoxValue(p => [...p, name])
    setChoices(p => [...p, name])
    handleChange([...oldData, name])
  }

  function handleChange(names: string[]) {
    setBoxValue(names)
    onChange(names)
  }

  return <Combobox
    multiple
    autoHighlight
    value={boxValue}
    onValueChange={(v) => handleChange(v)}
  >
    <ComboboxChips ref={anchor} className="w-full">
      <ComboboxValue placeholder={placeHolder}>
        {(values) => (
          <React.Fragment>
            {values.map((value: string) => (
              <ComboboxChip key={value} >{value}</ComboboxChip>
            ))}
          </React.Fragment>
        )}
      </ComboboxValue>
      <ComboboxChipsInput placeholder={boxValue.length == 0 ? placeHolder : ""} onChange={(e) => setNewInsturcture(e.target.value)}></ComboboxChipsInput>
    </ComboboxChips>
    <ComboboxContent ref={anchor}>
      {
        choices.length == 0 && <ComboboxEmpty>พิมพ์ชื่อเพื่อเพิ่มผู้สอนใหม่</ComboboxEmpty>
      }
      <ComboboxList>
        {choices.map((item) => (
          <ComboboxItem key={item} value={item} onClick={() => setBoxValue(p => [...p, item])}>
            {item}
          </ComboboxItem>
        )
        )}
        {
          !isNewInsturctre(newInsturctre) &&
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => addNewInsturcture(newInsturctre, boxValue)}>+ เพิ่มผู้สอน "{newInsturctre}"</Button>
        }
      </ComboboxList>
    </ComboboxContent>
  </Combobox >
}


export function AdminCouresPage() {
  const { courses, removeInstucutre } = useEnrollmentStore();
  const titleOf = (courseId: string) =>
    courses.find((c) => c.courseCode === courseId)?.courseTitle ?? "-";

  return <div className="space-y-3">
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">จัดการวิชาเรียน </div><AddDialog></AddDialog></div>
      <div className="text-sm text-muted-foreground">{courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
      </div>
    </div>
    <div className="rounded-lg border">
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>	ชื่อวิชา</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-20 text-center text-muted-foreground"
              >
                ไม่พบข้อมูลการลงทะเบียน
              </TableCell>
            </TableRow>
          )}
          {
            courses.map(c => <TableRow>
              <TableCell>{c.courseCode}</TableCell>
              <TableCell>{titleOf(c.courseCode)}</TableCell>
              <TableCell aria-placeholder="ยังไม่มีผู้สอน" className="space-x-1">{
                c.instructors?.map(i =>
                  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {i}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full text-blue-300 hover:text-red-500 p-0"
                      onClick={() => removeInstucutre(i, c.courseCode)}
                    >
                      <X className="h-0.5 w-0.5" />
                    </Button>
                  </Badge>
                )
              }
              </TableCell>
              <TableCell>
                <DelAlert courseId={c.courseCode}></DelAlert>
              </TableCell>
            </TableRow >
            )
          }
        </TableBody >
      </Table >
    </div>
  </div >
}

