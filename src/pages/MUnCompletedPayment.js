import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import {
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import Layout from "@/Components/BursarLayout";
import { useRouter } from "next/router";

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //  useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     const role = (localStorage.getItem("role") || "").toLowerCase();
  
  //     if (!token || (role !== "manager")) {
  //       router.push("/StaffLogin");
  //       return;
  //     }
  //     api
  //       .get("/staff/getDashboard", {
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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [classRes] =
        await Promise.all([
          api.get("/class/getAllClasses"),
        ]);

      let allClasses = classRes.data.classes || [];

    
      setClasses(allClasses);
    } catch (error) {
      console.error("Error fetching:", error.message);
    } finally {
      setLoading(false);
    }
  };

 
  const gotToClass = (className) => {
    router.push(`/PClassDebtors/${className}`);
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>
      <Box p={5}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">All Classes</Heading>
        </HStack>

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
                    <HStack>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => gotToClass(cls.className)}
                      >
                        View
                      </Button>
                      
                    </HStack>
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