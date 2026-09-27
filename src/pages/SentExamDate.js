import { useState, useEffect } from "react";
import Layout from "../Components/PrincipalLayout";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import api from "@/utils/api";
import { useRouter } from "next/router";

const SentExamDate = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sentExamDates, setSentExamDate] = useState([]);

  useEffect(() => {
    const fetchSentExamDate = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/student/sentExaminationDate"
        );
        console.log("API Response:", response);
        setSentExamDate(response.data || []); // <-- CORRECT DATA SET
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchSentExamDate();
  }, []);

  useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "Principal") {
          router.push("/StaffLogin");
          return;
        }
    
        api
          .get("/staff/getDashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((response) => {
            console.log(response.data);
            if (!response.data.status) {
              router.push("/StaffLogin");
            }
          })
          .catch(() => router.push("/StaffLogin"));
      }, [router]);

  return (
    <Layout>
      <Box size="lg" maxW="2000px" className="py-1">
        <Box p={4}>
          <h2 className="text-center p-2 border-bottom">
            Parents Sent Examination Dates
          </h2>

          <TableContainer className="mt-4">
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Parent</Th>
                  <Th>Student</Th>
                  <Th>Applied To Class</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {loading && (
                  <Tr>
                    <Td colSpan="4" className="text-center p-3">
                      Loading...
                    </Td>
                  </Tr>
                )}

                {!loading && sentExamDates.length === 0 && (
                  <Tr>
                    <Td colSpan="4" className="text-center p-3">
                      No record found.
                    </Td>
                  </Tr>
                )}

                {!loading &&
                  sentExamDates.map((parent, index) =>
                    parent.students.map((stu, i) => (
                      <Tr key={`${index}-${i}`}>
                        {/* Parent Column */}
                        <Td>
                          <b>{parent.parentName}</b> <br />
                          <small>{parent.parentEmail}</small>
                        </Td>

                        {/* Student Column */}
                        <Td>
                          {stu.surName} {stu.otherNames}
                        </Td>

                        {/* Class Column */}
                        <Td>{stu.classTo}</Td>

                        {/* Action Column */}
                        <Td>
                          <Button
                            variant="solid"
                            colorScheme="green"
                            size="sm"
                          >
                            Admit
                          </Button>

                          <Button
                            variant="solid"
                            colorScheme="blue"
                            size="sm"
                            ml={2}
                          >
                            Send Exam Date Again
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Layout>
  );
};

export default SentExamDate;