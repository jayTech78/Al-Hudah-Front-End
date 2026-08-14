import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/Components/PrincipalLayout";
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
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const className = router.query.className;

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!className) return;
    fetchGrades();
  }, [className]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token || (role !== "principal")) {
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

  const fetchGrades = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:9500/grades/class",
        {
          className,
          session,
          term,
        }
      );

      setGrades(data.grades || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    const { data } = await axios.get(
      "http://localhost:9500/session/getSessions"
    );

    setSessions(data.sessions || []);
  };

  const fetchTerms = async () => {
    const { data } = await axios.get(
      "http://localhost:9500/term/getTerms"
    );

    setTerms(data.terms || []);
  };

  useEffect(() => {
    fetchSessions();
    fetchTerms();
  }, []);

  useEffect(() => {
    if (className && session && term) {
      fetchGrades();
    }
  }, [className, session, term]);

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <Layout>
      <h2>{className?.toUpperCase()}</h2>
      {loading && <p>Loading...</p>}
      <div className="row my-4">

        <div className="col-md-4">
          <select
            className="form-select"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>

            {sessions.map((item) => (
              <option key={item._id} value={item.sessionName}>
                {item.sessionName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="">Select Term</option>

            {terms.map((item) => (
              <option key={item._id} value={item.termName}>
                {item.termName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <Button
            colorScheme="blue"
            onClick={fetchGrades}
            isDisabled={!session || !term}
            w="100%"
          >
            Filter Grades
          </Button>
        </div>

      </div>
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
    </Layout>
  );
}
