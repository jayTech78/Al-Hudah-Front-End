"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import Layout from "@/Components/ManagerLayout";

export default function ClassDebtorsPage() {
  const router = useRouter();
  const { className } = router.query;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || role !== "manager") {
  //     router.push("/StaffLogin");
  //     return;
  //   }

  //   api
  //     .get("/staff/getDashboard", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       if (!res.data.status) {
  //         router.push("/StaffLogin");
  //       }
  //     })
  //     .catch(() => router.push("/StaffLogin"));
  // }, [router]);

  // Fetch debtors
  useEffect(() => {
    const className = router.query.id;
    if (!className) return;

    const fetchDebtors = async () => {
      try {
        const { data } = await api.post(
          `/payment/getDebtorsByClass/${className}`
        );

        console.log(data);

        if (data.status) {
          setStudents(data.students || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, [className]);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Layout>
      <Box p={8}>
        <Heading mb={2}>Debtors - {className}</Heading>

        <Text mb={6}>
          Total Debtors: <strong>{students.length}</strong>
        </Text>

        <Box
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
        >
          {/* Table Header */}
          <Table>
            <Thead bg="blue.600">
              <Tr>
                <Th color="white">Student ID</Th>
                <Th color="white">Student Name</Th>
                <Th color="white">Fee Debt</Th>
                <Th color="white">Book Debt</Th>
                <Th color="white">Total Debt</Th>
                <Th color="white">Outstanding Fees</Th>
                <Th color="white">Outstanding Books</Th>
              </Tr>
            </Thead>
          </Table>

          {/* Scrollable Body */}
          <Box maxH="500px" overflowY="auto">
            <Table variant="striped">
              <Tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <Tr key={student.studentId}>
                      <Td>{student.studentId}</Td>

                      <Td>{student.studentName}</Td>

                      <Td color="red.500" fontWeight="bold">
                        ₦{student.fees.debt.toLocaleString()}
                      </Td>

                      <Td color="red.500" fontWeight="bold">
                        ₦{student.books.debt.toLocaleString()}
                      </Td>

                      <Td color="red.600" fontWeight="bold">
                        ₦
                        {(
                          student.fees.debt +
                          student.books.debt
                        ).toLocaleString()}
                      </Td>

                      <Td>
                        {student.fees.unpaidItems.length > 0 ? (
                          student.fees.unpaidItems.map((fee, index) => (
                            <Badge
                              key={index}
                              colorScheme="red"
                              mr={2}
                              mb={2}
                            >
                              {fee.description}
                            </Badge>
                          ))
                        ) : (
                          <Badge colorScheme="green">
                            Cleared
                          </Badge>
                        )}
                      </Td>

                      <Td>
                        {student.books.unpaidItems.length > 0 ? (
                          student.books.unpaidItems.map((book, index) => (
                            <Badge
                              key={index}
                              colorScheme="orange"
                              mr={2}
                              mb={2}
                            >
                              {book.bookName}
                            </Badge>
                          ))
                        ) : (
                          <Badge colorScheme="green">
                            Cleared
                          </Badge>
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      No debtors found for this class.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}