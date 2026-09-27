import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import ParentLayout from "@/Components/ParentLayout";
import style from "../styles/Home.module.css";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import ManagerNavBar from "@/Components/ParentNavBar";

const StudentResult = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [studentsResult, setStudentsResult] = useState([]);
  const [parent_Id, setParentId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();
    const parentId = localStorage.getItem("parentId");
    setParentId(parentId)

    if (!token || role !== "parent") {
      router.push("/ParentLogin");
      return;
    }

    fetchResults(parentId);
  }, []);

  const fetchResults = async (parentId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await api.get(
        `/grades/getStudentsResultsByParentId/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status) {
        console.log(data.studentsResult);
        setStudentsResult(data.studentsResult || []);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Result",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load student results.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "green";

      case "B2":
      case "B3":
        return "teal";

      case "C4":
      case "C5":
      case "C6":
        return "yellow";

      case "D7":
      case "E8":
        return "orange";

      default:
        return "red";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <ParentLayout parentId={parent_Id}>
        <Box textAlign="center" mt={20}>
          <Spinner size="xl" />
        </Box>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout parentId={parent_Id}>
      <div className="print-area">
        <Box
          flex="1"
          h="calc(100vh - 70px)"
          overflowY="auto"
          p={6}
        >
          {/* Everything from your Heading downwards */}
          <Box p={6}>
            <div >
              <Flex
                justify="space-between"
                align="center"
                mb={8}
              >
                <Box>
                  <Heading>
                    Student Report Sheet
                  </Heading>

                  <Text color="gray.500">
                    Academic Performance Report
                  </Text>
                </Box>

                <Button
                  colorScheme="blue"
                  onClick={handlePrint}
                >
                  Print Result
                </Button>
              </Flex>

              {studentsResult.length === 0 ? (
                <Heading
                  size="md"
                  textAlign="center"
                >
                  No Result Available
                </Heading>
              ) :
                (
                  studentsResult.filter(item => item.result).map((item, index) => {
                    const termKey =
                      item.result.term === "First Term"
                        ? "firstTerm"
                        : item.result.term === "Second Term"
                          ? "secondTerm"
                          : "thirdTerm";

                    return (
                      <Box
                        key={item.student.studentId}
                        mb={12}
                      >
                        <Grid
                          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                          gap={6}
                          mb={6}
                        >

                          {/* Performance Summary */}
                          <GridItem>
                            <Card shadow="md" h="100%">
                              <CardHeader>
                                <Heading size="md">
                                  Performance Summary
                                </Heading>
                              </CardHeader>

                              <CardBody>
                                <Grid
                                  templateColumns="repeat(2,1fr)"
                                  gap={5}
                                >
                                  <Box>
                                    <Text color="gray.500">Total Score</Text>
                                    <Heading size="md">
                                      {item.result.totalScore}
                                    </Heading>
                                  </Box>

                                  <Box>
                                    <Text color="gray.500">Average</Text>
                                    <Heading size="md">
                                      {item.result.average}%
                                    </Heading>
                                  </Box>

                                  <Box>
                                    <Text color="gray.500">Overall Grade</Text>

                                    <Badge
                                      fontSize="18px"
                                      colorScheme={getGradeColor(item.result.overallGrade)}
                                    >
                                      {item.result.subjects.length
                                        ? item.result.subjects[0].grade
                                        : "-"}
                                    </Badge>
                                  </Box>

                                  <Box>
                                    <Text color="gray.500">Position</Text>

                                    <Heading size="md">
                                      {item.result.overallPosition}
                                    </Heading>
                                  </Box>

                                  <Box gridColumn="span 2">
                                    <Text color="gray.500">Overall Remark</Text>

                                    <Heading size="sm">
                                      {item.result.subjects.length
                                        ? item.result.subjects[0].teacherRemark
                                        : "-"}
                                    </Heading>
                                  </Box>
                                </Grid>
                              </CardBody>
                            </Card>
                          </GridItem>

                          {/* Attendance Summary */}
                          <GridItem>
                            <Card shadow="md" h="100%">
                              <CardHeader>
                                <Heading size="md">
                                  Attendance Summary
                                </Heading>
                              </CardHeader>

                              <CardBody>
                                <Grid
                                  templateColumns="repeat(2,1fr)"
                                  gap={5}
                                >
                                  <Box>
                                    <Text color="gray.500">Days Present</Text>
                                    <Heading>
                                      {item.attendanceSummary.present}
                                    </Heading>
                                  </Box>

                                  <Box>
                                    <Text color="gray.500">Days Absent</Text>
                                    <Heading>
                                      {item.attendanceSummary.absent}
                                    </Heading>
                                  </Box>
                                </Grid>
                              </CardBody>
                            </Card>
                          </GridItem>

                        </Grid>

                        {/* Subject Results */}

                        <Card mt={6} shadow="md">
                          <CardHeader>
                            <Heading size="md">
                              Subject Results
                            </Heading>
                          </CardHeader>

                          <CardBody>

                            <TableContainer>

                              <Table
                                variant="striped"
                                colorScheme="teal"
                              >

                                <Thead>

                                  <Tr>

                                    <Th>Subject</Th>

                                    <Th>1st CA</Th>

                                    <Th>2nd CA</Th>

                                    <Th>CA</Th>

                                    <Th>Exam</Th>

                                    <Th>Total</Th>

                                    <Th>Grade</Th>

                                    <Th>Remark</Th>

                                  </Tr>

                                </Thead>

                                <Tbody>
                                  {item.grades.map((grade) => {
                                    const score = grade[termKey];

                                    return (
                                      <Tr key={`${grade.studentId}-${grade.subjectId}`}>
                                        <Td>{grade.subjectId}</Td>

                                        <Td>{score?.firstCa ?? "-"}</Td>

                                        <Td>{score?.secondCa ?? "-"}</Td>

                                        <Td>{score?.continuousAssessment ?? "-"}</Td>

                                        <Td>{score?.exam ?? "-"}</Td>

                                        <Td fontWeight="bold">
                                          {score?.totalScore ?? "-"}
                                        </Td>

                                        <Td>
                                          <Badge
                                            colorScheme={getGradeColor(score?.grade)}
                                            px={3}
                                            py={1}
                                            borderRadius="md"
                                          >
                                            {score?.grade}
                                          </Badge>
                                        </Td>

                                        <Td>{score?.teacherRemark ?? "-"}</Td>
                                      </Tr>
                                    );
                                  })}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </CardBody>
                        </Card>
                      </Box>

                    )
                  }))
              }
            </div>
          </Box>
        </Box>
        <style jsx global>{`
  @media print {

    @page {
      size: A4 landscape;
      margin: 10mm;
    }

    /* Hide everything except the result */
    body * {
      visibility: hidden;
    }

    .print-area,
    .print-area * {
      visibility: visible;
    }

    /* Put the result at the top-left of the paper */
    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Remove screen scrolling/height restrictions */
    .print-area,
    .print-area * {
      overflow: visible !important;
    }

    /* Remove the fixed viewport height */
    .print-area {
      height: auto !important;
      min-height: 0 !important;
    }

    /* Don't split individual student reports unnecessarily */
    .print-area > div {
      break-inside: avoid;
    }

    /* Tables should use the available paper width */
    table {
      width: 100% !important;
      font-size: 11px !important;
    }

    th,
    td {
      padding: 5px !important;
    }

    /* Avoid cards being cut between pages */
    .chakra-card {
      break-inside: avoid;
    }

    /* Don't print buttons */
    button {
      display: none !important;
    }
  }
`}</style>
      </div>
    </ParentLayout>
  )
}

export default StudentResult;