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
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import api from '@/utils/api'
import TeacherLayout from "@/Components/TeacherLayout";

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [afternoonAttendance, setAfternoonAttendance] = useState({});
  const toast = useToast();
  const router = useRouter();
  const [error, setError] = useState("");
  const { className, teacherId } = router.query;
  const [isTimeClocked, setIsTimeClocked] = useState(false)
  const [isAfternoonTimeClocked, setIsAfternoonTimeClocked] = useState(false)

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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!className) return;
        const res = await axios.post(
          `http://localhost:9500/class/getStudentsByClassName/${className}`
        );
        setStudents(res.data.students || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [className]);

  const handleChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
// afternoon attendance
const handleAfternoonChange = (studentId, status) => {
    setAfternoonAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours > 12 || (hours === 12 && minutes >= 30)) {
        setIsAfternoonTimeClocked(false)
        setIsTimeClocked(true); // Attendance is now CLOSED
      } 
      else if (hours < 12 || (hours === 12 && minutes <= 30) && hours < 3 || (hours === 3 && minutes <= 30)) 
      {
        setIsTimeClocked(false); // Attendance is still OPEN
        setIsAfternoonTimeClocked(true)
      }
      else{
        setIsTimeClocked(true); // Attendance is still OPEN
        setIsAfternoonTimeClocked(true)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (Object.keys(attendance).length === 0) {
      toast({
        title: "No attendance selected",
        description: "Please mark attendance for at least one student.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Always mark attendance for "today"
      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

      const payload = students.map((student) => ({
        className: className.toUpperCase(),
        studentId: student.studentId,
        date: today,
        morningStatus: attendance[student.studentId] || "Absent",
      }));

      // console.log("Submitting payload:", payload);

      await axios.post(
        "http://localhost:9500/attendance/markAttendance",
        payload
      );

      toast({ title: "Attendance submitted successfully.", status: "success" });
    } catch (error) {
      console.error("Submission error:", error);
      toast({ title: "Submission failed.", status: "error" });
    }
  };
  const handleAfternoonSubmit = async () => {
    if (Object.keys(afternoonAttendance).length === 0) {
      toast({
        title: "No attendance selected",
        description: "Please mark attendance for at least one student.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Always mark attendance for "today"
      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

      const payload = students.map((student) => ({
        className: className.toUpperCase(),
        studentId: student.studentId,
        date: today,
        afternoonStatus: afternoonAttendance[student.studentId] || "Absent",
      }));

      console.log("Submitting payload:", payload);

      await axios.post(
        "http://localhost:9500/attendance/markAttendance",
        payload
      );

      toast({ title: "Afternoon Attendance submitted successfully.", status: "success" });
    } catch (error) {
      console.error("Submission error:", error);
      toast({ title: "Submission failed.", status: "error" });
    }
  };

  return (
    <TeacherLayout teacherId={teacherId} className={className}>
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
                <div className="col-8 mx-auto">
                  <Heading mb={4}>Attendance</Heading>
                  <div className="mb-4 border-bottom">
                    Date: {new Date().toDateString()}
                  </div>

                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Morning</Th>
                        <Th>Afternoon</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <Tr key={student._id}>
                            <Td>
                              {student.surName} {student.otherNames}
                            </Td>
                            {/* //Morning Attendances */}
                            <Td>
                              <Box display="flex" gap="6">
                                <label>
                                  <input
                                    type="radio"
                                    name={`attendance-${student.studentId}`}
                                    value="Present"
                                    checked={
                                      attendance[student.studentId] ===
                                      "Present"
                                    }
                                    onChange={() =>
                                      handleChange(student.studentId, "Present")
                                    }
                                  />{" "}
                                  Present
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`attendance-${student.studentId}`}
                                    value="Absent"
                                    checked={
                                      attendance[student.studentId] === "Absent"
                                    }
                                    onChange={() =>
                                      handleChange(student.studentId, "Absent")
                                    }
                                  />{" "}
                                  Absent
                                </label>
                              </Box>
                            </Td>
                            {/* //Afternoon Attendance */}
                            <Td>
                              <Box display="flex" gap="6">
                                <label>
                                  <input
                                    type="radio"
                                    name={`afternoonAttendance-${student.studentId}`}
                                    value="Present"
                                    checked={
                                      afternoonAttendance[student.studentId] ===
                                      "Present"
                                    }
                                    onChange={() =>
                                      handleAfternoonChange(student.studentId, "Present")
                                    }
                                  />{" "}
                                  Present
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`afternoonAttendance-${student.studentId}`}
                                    value="Absent"
                                    checked={
                                      afternoonAttendance[student.studentId] === "Absent"
                                    }
                                    onChange={() =>
                                      handleAfternoonChange(student.studentId, "Absent")
                                    }
                                  />{" "}
                                  Absent
                                </label>
                              </Box>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="2">No students exist for this class</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>

                  <Button
                    mt={6}
                    colorScheme="green"
                    onClick={() => {
                      if (isTimeClocked) {
                        toast({
                          title: "Attendance Closed",
                          description: "Morning Attendance cannot be submitted after 12:30 PM.",
                          status: "error",
                        });
                        return;
                      }

                      handleSubmit();
                    }}
                  >
                    Submit Attendance
                  </Button>
                  <Button
                    mt={6}
                    ms={2}
                    colorScheme="blue"
                    onClick={() => {
                      if (isAfternoonTimeClocked) {
                        toast({
                          title: "Attendance Closed",
                          description: "Afternoon Attendance cannot be submitted after 12:30 PM.",
                          status: "error",
                        });
                        return;
                      }

                      handleAfternoonSubmit();
                    }}
                  >
                    Submit Afternoon Attendance
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </Box>
    </TeacherLayout>
  );
}