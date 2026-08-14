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
import Layout from "@/Components/PrincipalLayout";
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

   useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "Principal") {
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
          console.log(response.data);
          if (!response.data.status) {
            router.push("/StaffLogin");
          }
        })
        .catch(() => router.push("/StaffLogin"));
    }, [router]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const classesRes = await axios.get(
        "http://localhost:9500/class/getAllClasses"
      );
      setClasses(classesRes.data.classes);
      console.log(classesRes.data.classes);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };
  const gotToClass = async (className)=>
  {
    router.push(`/VPClassInfo/${className}`);
  }
  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>
      <Box p={5}>
        <Heading size="lg" mb={4}>
          All Classes
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
                      onClick={() =>gotToClass(cls.className)}
                    >
                      View Class Info
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
