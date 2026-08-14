"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";
import Layout from "@/Components/VicePrincipalLayout";

export default function ClassInfoPage() {
  const router = useRouter();
  const { className } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const fetchClassInfo = async () => {
      try {
        const response = await axios.post(
          `http://localhost:9500/class/classInfo/${className}`
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
      <Box
        p={8}
        h="100vh" // take full height of viewport
        overflowY="auto" // only this section scrolls
      >
        {/* Class Info */}
        <Heading mb={2}>{foundClass.className}</Heading>
        <Text>Class Teacher: {foundClass.classTeacher}</Text>
        <Text>Class ID: {foundClass.classId}</Text>
        <Text>Approved: {foundClass.isApproved ? "Yes" : "No"}</Text>

        <Divider my={6} />

        {/* Subjects */}
        <Heading size="md" mb={2}>
          Subjects
        </Heading>
        <Text>{foundClass.classSubjects.join(", ")}</Text>

        <Divider my={6} />

        {/* Books */}
        <Heading size="md" mb={2}>
          Books
        </Heading>
        <Text>{foundClass.classBooks.join(", ")}</Text>

        <Divider my={6} />

        {/* Fees */}
        <Heading size="md" mb={2}>
          Fees
        </Heading>
        <Text>{foundClass.classFees.join(", ")}</Text>

        <Divider my={6} />

        {/* Students */}
        <Heading size="lg" mb={4}>
          Students
        </Heading>
        <Table variant="striped" colorScheme="green">
          <Thead>
            <Tr>
              <Th>Student ID</Th>
              <Th>Name</Th>
              <Th>Gender</Th>
              <Th>Class To</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student._id}>
                <Td>{student.studentId}</Td>
                <Td>
                  {student.surName} {student.otherNames}
                </Td>
                <Td>{student.gender}</Td>
                <Td>{student.classTo}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
}
