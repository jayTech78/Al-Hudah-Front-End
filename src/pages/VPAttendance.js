import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  Box,
  Input,
  HStack,
  Button,
} from "@chakra-ui/react";
import Layout from "@/Components/VicePrincipalLayout";
import Router from "next/router";

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = Router
  // Filters
  
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchClasses();
  }, []);
//  useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = (localStorage.getItem("role") || "").toLowerCase();

//     if (!token || (role !== "principal")) {
//       router.push("/StaffLogin");
//       return;
//     }

//     axios
//       .get("http://localhost:9500/staff/getDashboard", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       })
//       .then((response) => {
//         if (!response.data.status) {
//           router.push("/StaffLogin");
//         }
//       })
//       .catch(() => router.push("/StaffLogin"));
//   }, [router]);
  const fetchClasses = async () => {
  setLoading(true);
  try {
    const classesRes = await axios.get(
      "http://localhost:9500/class/getAllClasses"
    );

    let allClasses = classesRes.data.classes || [];
    let userRole = (localStorage.getItem("role") || "").toLowerCase();

    if (userRole === "principal" || userRole === "vice principal") {
      allClasses = allClasses.filter(
        (c) =>
          c.className.toLowerCase().startsWith("jss") ||
          c.className.toLowerCase().startsWith("ss")
      );
    } else if (
      userRole === "head master" ||
      userRole === "assistant head master"
    ) {
      allClasses = allClasses.filter((c) =>
        c.className.toLowerCase().startsWith("primary")
      );
    }

    setClasses(allClasses);
  } catch (err) {
    console.error("Error fetching attendance:", err);
  } finally {
    setLoading(false);
  }
};

  const gotToAttendance = async (className)=>
  {
    router.push(`/PAttendanceByClass/${className}`);
  }

  const goTofilteredAttendance = (className) => {
    router.push(`/PFilterAttendanceByClass/${className}`);
  }

  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>
      <Box p={5}>
        <Heading size="lg" mb={4}>
          Attendance - All Classes
        </Heading>
  
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Class Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classes.map((cls) => (
                <Tr key={cls._id}>
                  <Td>{cls.className.toUpperCase()}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() =>gotToAttendance(cls.className)}
                    >
                      View Attendance
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      className="ms-2"
                      onClick={() =>goTofilteredAttendance(cls.className)}
                    >
                      Filter Attendance
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
  
}
