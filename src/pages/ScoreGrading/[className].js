import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  useToast,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import ManagerNavBar from "@/Components/ParentNavBar";
import TeacherSideNav from "@/Components/TeacherSideNav";
import { useRouter } from "next/router";
import TeacherLayout from "@/Components/TeacherLayout";

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toast = useToast();
  const router = useRouter();
  const { className,teacherId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (!className) return;
      try {
        const res = await axios.post(
          `http://localhost:9500/class/getStudentsAndSubjectsByClassName/${className}`
        );
        setStudents(res.data.students || []);
        setSubjects(res.data.subjects || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [className]);

  const handleGradeChange = (studentId, field, value) => {
  const n = parseInt(value, 10);
  const safe = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;

  setGrades(prev => ({
    ...prev,
    [studentId]: {
      ...prev[studentId],
      [field]: safe,
    },
  }));
};

  useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "Teacher") {
        router.push("/Login");
        return;
      }
  
      axios
        .get("http://localhost:9500/staff/getDashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          // console.log(response.data);
          if (!response.data.status) {
            router.push("/Login");
          }
        })
        .catch(() => router.push("/Login"));
    }, [router]);

  const handleSubmit = async () => {
  const payload = students.map((student) => ({
    studentId: student.studentId,
    className,
    subjectId: selectedSubject.subject,
    // only include values if entered, else leave undefined
    ...(grades[student.studentId]?.firstCa !== undefined && {
      firstCa: grades[student.studentId].firstCa,
    }),
    ...(grades[student.studentId]?.secondCa !== undefined && {
      secondCa: grades[student.studentId].secondCa,
    }),
    ...(grades[student.studentId]?.exam !== undefined && {
      exam: grades[student.studentId].exam,
    }),
  }));

  // check if at least *one* student has any score entered
  const hasAtLeastOneScore = payload.some(
    (p) => p.firstCa !== undefined || p.secondCa !== undefined || p.exam !== undefined
  );

  if (!hasAtLeastOneScore) {
    toast({ title: "Enter at least one score before submitting.", status: "error" });
    return;
  }

  try {
    console.log(payload)
    await axios.post("http://localhost:9500/grades/record", payload);
    toast({ title: "Grades submitted successfully.", status: "success" });
    setSelectedSubject(null); // close modal
  } catch (error) {
    toast({ title: "Grade submission failed.", status: "error" });
    console.error(error);
  }
};

  return (
    <TeacherLayout className={className} teacherId={teacherId}>
    <Box height="100vh" overflow="hidden">
      <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
          <div
          className="flex-grow-1"
          style={{
            overflowY: "auto",
            padding: "20px",
            height: "100vh",
          }}
        >
          <Box p={4} mb={4}>
            {loading ? (
              <Spinner size="xl" />
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Box>
                <Heading mb={4}>Subjects</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Subject</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {subjects.map((subject) => (
                      <Tr key={subject._id}>
                        <Td>{subject.subject}</Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            onClick={() => setSelectedSubject(subject)}
                          >
                            Mark Grades
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>
        </div>
      </div>

      {/* Modal for entering grades */}
      <Modal isOpen={!!selectedSubject} onClose={() => setSelectedSubject(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mark Grades for {selectedSubject?.subject}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>1st CA</Th>
                  <Th>2nd CA</Th>
                  <Th>Exam</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student) => (
                  <Tr key={student._id}>
                    <Td>{`${student.surName} ${student.otherNames}`}</Td>
                    <Td>
                      <Input
                        type="number"
                        value={grades[student.studentId]?.firstCa || ""}
                        onChange={(e) =>
                          handleGradeChange(student.studentId, "firstCa", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={grades[student.studentId]?.secondCa || ""}
                        onChange={(e) =>
                          handleGradeChange(student.studentId, "secondCa", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={grades[student.studentId]?.exam || ""}
                        onChange={(e) =>
                          handleGradeChange(student.studentId, "exam", e.target.value)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleSubmit}>
              Submit Grades
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </TeacherLayout>
  );
}
