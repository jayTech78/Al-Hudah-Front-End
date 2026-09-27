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
  Divider,
  SimpleGrid
} from "@chakra-ui/react";
import Layout from "@/Components/PrincipalLayout";

export default function ClassInfoPage() {
  const router = useRouter();
  const { className } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token || (role !== "principal")) {
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
        if (!response.data.status) {
          router.push("/StaffLogin");
        }
      })
      .catch(() => router.push("/StaffLogin"));
  }, [router]);

  useEffect(() => {
    if (!className) return;

    const fetchClassInfo = async () => {
      try {
        const response = await api.post(
          `/class/classInfo/${className}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching class info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassInfo();
  }, [className]);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!data?.status) {
    return (
      <Box textAlign="center" mt={20}>
        <Text color="red.500">Class not found</Text>
      </Box>
    );
  }

  const { foundClass, students } = data;

  return (
   <Layout>
  <Box p={8}>
  {/* Class Title */}
  <Heading mb={6}>{foundClass.className}</Heading>

  {/* Class Details */}
  <Heading size="md" mb={3}>
    Class Information
  </Heading>

  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="sm">
      <Text fontWeight="bold">Class Teacher</Text>
      <Text>{foundClass.classTeacher}</Text>
    </Box>

    <Box p={4} borderWidth="1px" borderRadius="md" shadow="sm">
      <Text fontWeight="bold">Class ID</Text>
      <Text>{foundClass.classId}</Text>
    </Box>

    <Box p={4} borderWidth="1px" borderRadius="md" shadow="sm">
      <Text fontWeight="bold">Approved</Text>
      <Text color={foundClass.isApproved ? "green.500" : "red.500"}>
        {foundClass.isApproved ? "Yes" : "No"}
      </Text>
    </Box>
  </SimpleGrid>

  {/* Subjects, Books & Fees */}
  <Heading size="md" mb={3}>
    Academic Information
  </Heading>

  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
      maxH="250px"
      overflowY="auto"
    >
      <Text fontWeight="bold" mb={2}>
        Subjects
      </Text>

      {foundClass.classSubjects.map((subject, index) => (
        <Text key={index}>{subject}</Text>
      ))}
    </Box>

    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
      maxH="250px"
      overflowY="auto"
    >
      <Text fontWeight="bold" mb={2}>
        Books
      </Text>

      {foundClass.classBooks.map((book, index) => (
        <Text key={index}>{book}</Text>
      ))}
    </Box>

    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
      maxH="250px"
      overflowY="auto"
    >
      <Text fontWeight="bold" mb={2}>
        Fees
      </Text>

      {foundClass.classFees.map((fee, index) => (
        <Text key={index}>{fee}</Text>
      ))}
    </Box>
  </SimpleGrid>

  {/* Students */}
  <Heading size="lg" mb={4}>
    Students ({students.length})
  </Heading>

  <Box
    borderWidth="1px"
    borderRadius="md"
    overflow="hidden"
  >
    <Table variant="striped" colorScheme="green">
      <Thead bg="green.600">
        <Tr>
          <Th color="white">Student ID</Th>
          <Th color="white">Student Name</Th>
          <Th color="white">Gender</Th>
        </Tr>
      </Thead>
    </Table>

    {/* Scrollable Table Body */}
    <Box maxH="400px" overflowY="auto">
      <Table variant="striped" colorScheme="green">
        <Tbody>
          {students.map((student) => (
            <Tr key={student._id}>
              <Td>{student.studentId}</Td>
              <Td>
                {student.surName} {student.otherNames}
              </Td>
              <Td>{student.gender}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  </Box>
</Box>
</Layout>

  );
}
