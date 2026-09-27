import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Badge } from "@/components/ui/badge";

type Option = { value: string; label: string };
type TableDisplay = { CourseCode: string, NameCourse: string, AmountEnroll: number, Who: string[] };

function MultiSelet({ choice, disabled, placeHolder, nameOf, onChange }:
  { choice: Option[], disabled: boolean, placeHolder: string, nameOf: (x: string) => string, onChange: (v: string[]) => void }) {
  const anchor = useComboboxAnchor();
  const [values, setValues] = useState<string[]>([])
  function handleValue(v: string[]) {
    setValues(v)
    onChange(v)
  }
  return <Combobox
    multiple
    autoHighlight
    disabled={disabled}
    value={values}
    onValueChange={(v) => handleValue(v)}
  >
    <ComboboxChips ref={anchor} className="w-full">
      <ComboboxValue>
        {(values) => (
          <React.Fragment>
            {values.map((value: string) => (
              <ComboboxChip key={value}>{nameOf(value)}</ComboboxChip>
            ))}
          </React.Fragment>
        )}
      </ComboboxValue>
      <ComboboxChipsInput placeholder={values.length == 0 ? placeHolder : ""}></ComboboxChipsInput>
    </ComboboxChips>
    <ComboboxContent ref={anchor}>
      <ComboboxList>
        {choice.map((item) => (
          <ComboboxItem key={item.value} value={item.value}>
            {item.label}
          </ComboboxItem>
        )
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox >
}

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue className="w-0" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, enroll, removeStudent
  } = useEnrollmentStore();
  const [formStudent, setFormStudent] = useState<string[] | null>(null);
  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));


  const handleEnroll = () => {
    if (!formStudent || !formCourse) return;
    enroll(formStudent, formCourse);
    setFormStudent(null)
    setFormCourse(null)
    setEnrollDialogOpen(false);
  };

  const handleDeleteStudent = (studentId: string, courseCode: string) => {
    removeStudent(studentId, courseCode)
  }

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormStudent(null);
      setFormCourse(null);
    }
  };
  const TableD: TableDisplay[] = courses.map(c => {
    let count = 0;
    students.map(s =>
      s.enrolledCourses.includes(c.courseCode) ? count++ : count)
    const who: string[] = [];
    students.forEach((s) => {
      if (s.enrolledCourses.includes(c.courseCode)) {
        who.push(s.studentId);
      }
    });
    return {
      CourseCode: c.courseCode,
      AmountEnroll: count,
      NameCourse: c.courseTitle,
      Who: who
    }
  })


  const nameOf = (studentId: string) => {
    const s = students.find((x) => x.studentId === studentId);
    return s ? `${s.firstName} ${s.lastName}` : "-";
  };

  const titleOf = (courseId: string) =>
    courses.find((c) => c.courseCode === courseId)?.courseTitle ?? "-";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">วิชา</Label>
              <OptionSelect
                id="formCourse"
                options={courseOptions}
                value={formCourse}
                placeholder="เลือกวิชา"
                onChange={setFormCourse}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="formStudent">นักศึกษา</Label>
              <MultiSelet disabled={formCourse == null}
                choice={studentOptions}
                placeHolder={formCourse == null ? "เลือกวิชาก่อน" : "ค้นหา/เลือกนักศึกษา"}
                nameOf={nameOf}
                onChange={v => setFormStudent(v)}
              >
              </MultiSelet>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!formStudent || !formCourse} onClick={handleEnroll}>
              <PlusCircle className="h-4 w-4" />
              ลงทะเบียน ({formStudent?.length} คน)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>	ชื่อวิชา</TableHead>
              <TableHead>จำนวน นศ.</TableHead>
              <TableHead>	นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TableD.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {TableD.map((e) => (
              <TableRow key={e.NameCourse}>
                <TableCell>{e.CourseCode}</TableCell>
                <TableCell>{titleOf(e.CourseCode)}</TableCell>
                <TableCell>{e.AmountEnroll}</TableCell>
                <TableCell className="space-x-1">{e.Who.map(c =>
                  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {nameOf(c)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full text-blue-300 hover:text-red-500 p-0"
                      onClick={() => handleDeleteStudent(c, e.CourseCode)}
                    >
                      <X className="h-0.5 w-0.5" />
                    </Button>
                  </Badge>
                )
                }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
