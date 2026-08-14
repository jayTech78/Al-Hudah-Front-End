import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Heading, Spinner, Box, Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "@/Components/PrincipalLayout";
export default function AttendancePage() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.query.className) {
      router.push(`/PAttendance`);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    fetchAttendance(today, router.query.className);
    console.log(today)
  }, []);

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

  const fetchAttendance = async (date, classId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:9500/attendance/getAttendanceForToday/${classId}/${date}`
      );
      console.log(data)
      setAttendanceData(data.attendances || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>

<Box p={5}>
      <Heading size="lg" mb={4}>
        Attendance for {router.query.className}
      </Heading>

      {attendanceData.length === 0 ? (
        <Text fontSize="lg" color="red.500">
          Attendance has not been marked for today.
        </Text>
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Student Name</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendanceData.map((record) => (
                <Tr key={record._id}>
                  <Td>{record.surName} {record.otherNames}</Td>
                  <Td>{record.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
    </Layout>
  );
}
