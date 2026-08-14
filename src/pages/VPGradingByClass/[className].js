import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/Components/VicePrincipalLayout";
import { useRouter } from "next/router";
import {
  Table, Thead, Tbody, Tr, Th, Td,
  Button, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";

export default function ClassGrades() {
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const className = router.query.className;

  const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token || (role !== "vice principal")) {
      router.push("/StaffLogin");
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
        if (!response.data.status) {
          router.push("/StaffLogin");
        }
      })
      .catch(() => router.push("/StaffLogin"));
  }, [router]);
    
  useEffect(() => {
    if (!className) return;
    fetchGrades();
  }, [className]);
  //  useEffect(() => {
  //       const token = localStorage.getItem("token");
  //       const role = localStorage.getItem("role");
  //       if (!token || role !== "Vice Principal") {
  //         router.push("/StaffLogin");
  //         return;
  //       }
    
  //       axios
  //         .get("http://localhost:9500/staff/getDashboard", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           if (!response.data.status) {
  //             router.push("/StaffLogin");
  //           }
  //         })
  //         .catch(() => router.push("/StaffLogin"));
  //     }, [router]);
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:9500/grades/getGradesByClass/${className}`
      );
      setGrades(res.data.grades || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2>{className?.toUpperCase()}</h2>
        {loading && <p>Loading...</p>}
        {grades.length > 0 ? (
          <Table variant="simple" mt={4}>
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Student ID</Th>
                <Th>Student Name</Th>
                <Th>Total Score</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {grades.map((g) => (
                <Tr key={g.studentId}>
                  <Td>{g.position}</Td>
                  <Td>{g.studentId}</Td>
                  <Td>{g.studentName}</Td>
                  <Td>{g.totalScore}</Td>
                  <Td>
                    <Button colorScheme="blue" size="sm" onClick={() => openStudentModal(g)}>
                      View Subjects
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          !loading && <p>No grades found for this class.</p>
        )}

        {/* Modal for subject breakdown */}
        {selectedStudent && (
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedStudent.studentName} - Subjects</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Subject</Th>
                      <Th>CA</Th>
                      <Th>Exam</Th>
                      <Th>Total</Th>
                      <Th>Grade</Th>
                      <Th>Remark</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedStudent.subjects.map((s, idx) => (
                      <Tr key={idx}>
                        <Td>{s.subjectId}</Td>
                        <Td>{s.continuousAssesment}</Td>
                        <Td>{s.exam}</Td>
                        <Td>{s.weightedAverageScore}</Td>
                        <Td>{s.grade}</Td>
                        <Td>{s.teacherRemarks}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
