import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Button,
  Select,
  Input,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
} from "@chakra-ui/react";
import Layout from "@/Components/PrincipalLayout";

export default function StudentResultFilter() {
  const toast = useToast();

  const [studentId, setStudentId] = useState("");
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");

  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
    fetchTerms();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:9500/session/getSessions"
      );

      setSessions(data.sessions || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTerms = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:9500/term/getTerms"
      );

      setTerms(data.terms || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    if (!studentId || !session || !term) {
      toast({
        title: "Fill all fields",
        status: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:9500/result/student",
        {
          studentId,
          session,
          term,
        }
      );
      console.log(data.result)
      if (data.status && data.result) {
        setResult(data.result);
      } else {
        setResult(null);

        toast({
          title: "No Result Found",
          status: "info",
        });
      }
    } catch (err) {
      console.log(err);

      toast({
        title: "Error fetching result",
        status: "error",
      });
    }

    setLoading(false);
  };

  return (
    <Layout>
      <Box p={6}>
        <Heading mb={6}>Filter Student Result</Heading>

        <Box className="row">

          <div className="col-md-3 mb-3">
            <Input
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <Select
              placeholder="Select Session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              {sessions.map((item) => (
                <option
                  key={item._id}
                  value={item.sessionName}
                >
                  {item.sessionName}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-md-3 mb-3">
            <Select
              placeholder="Select Term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              {terms.map((item) => (
                <option
                  key={item._id}
                  value={item.termName}
                >
                  {item.termName}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-md-3 mb-3">
            <Button
              colorScheme="green"
              width="100%"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Box>

        {loading && (
          <Spinner
            mt={10}
            size="xl"
          />
        )}

        {!loading && result && (
  <Box mt={8}>

    <Heading size="md" mb={4}>
      Student Information
    </Heading>

    <Text>
      <b>Name:</b>{" "}
      {result.student?.surName} {result.student?.otherNames}
    </Text>

    <Text>
      <b>Student ID:</b>{" "}
      {result.student?.studentId}
    </Text>

    <Text>
      <b>Class:</b>{" "}
      {result.result?.className}
    </Text>

    <Text>
      <b>Term:</b>{" "}
      {result.result?.term}
    </Text>

    <Text mb={6}>
      <b>Session:</b>{" "}
      {result.result?.session}
    </Text>

    <Table
      variant="striped"
      colorScheme="blue"
    >
      <Thead>
        <Tr>
          <Th>Subject</Th>
          <Th>1st CA</Th>
          <Th>2nd CA</Th>
          <Th>Exam</Th>
          <Th>Total</Th>
          <Th>Grade</Th>
          <Th>Remark</Th>
        </Tr>
      </Thead>

      <Tbody>
        {result?.grades?.map((grade, index) => {
          const termResult =
            grade[result.termField];

          return (
            <Tr key={grade._id || index}>
              <Td>
                {grade.subjectId}
              </Td>

              <Td>
                {termResult?.firstCa ?? "-"}
              </Td>

              <Td>
                {termResult?.secondCa ?? "-"}
              </Td>

              <Td>
                {termResult?.exam ?? "-"}
              </Td>

              <Td>
                {termResult?.totalScore ?? "-"}
              </Td>

              <Td>
                {termResult?.grade ?? "-"}
              </Td>

              <Td>
                {termResult?.teacherRemark ?? "-"}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>

    <Box mt={6}>
      <Text>
        <b>Total Score:</b>{" "}
        {result.result?.totalScore}
      </Text>

      <Text>
        <b>Average:</b>{" "}
        {result.result?.average}
      </Text>

      <Text>
        <b>Percentage:</b>{" "}
        {result.result?.percentage}%
      </Text>

      <Text>
        <b>Position:</b>{" "}
        {result.result?.overallPosition}
      </Text>
    </Box>
  </Box>
)}
      </Box>
    </Layout>
  );
}