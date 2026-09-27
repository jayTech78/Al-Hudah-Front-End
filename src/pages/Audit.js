import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
  useToast,
  Table,
  Td,
  Tr,
  Th,
  Thead,
  Tbody,
  Flex
} from "@chakra-ui/react";
import api from "@/utils/api";
import Layout from "@/Components/BursarLayout";
import Swal from "sweetalert2";

export default function ViewTransactions() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleSearchByStudentId = async () => {
    if (!selectedStudentId.trim()) {
      Swal.fire("Error", "Please enter a student ID.", "error");
      return;
    }

    try {
      const response = await api.post(
        "/audit/getTransactionByStudentId",
        { studentId: selectedStudentId.trim() }
      );

      if (response.data.status) {
        const transactions = response.data.transactions;
        // console.log(transactions)
        setTransactions(transactions);

        const total = transactions.reduce(
          (sum, item) => sum + Number(item.amountPaid),
          0
        );
        setTotalAmount(total);

        Swal.fire("Success", "Transactions fetched successfully", "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not fetch transactions", "error");
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || role !== "bursar") {
  //     router.push("/StaffLogin");
  //     return;
  //   }

  //   api
  //     .get("/staff/getDashboard", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       if (!response.data.status) {
  //         router.push("/StaffLogin");
  //       }
  //     })
  //     .catch(() => router.push("/StaffLogin"));
  // }, [router]);

  return (
    <Layout>
      <Box height="100vh" overflow="hidden">
        <Box display="flex" height="100vh">
          <Box p={6} flex="1" overflowY="auto">
            <Heading mb={5} textAlign="center">
              Transactions
            </Heading>

            <Box
              display="flex"
              justifyContent="center"
              gap={4}
              mb={6}
            >
              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={4}
                width={{ base: "100%", lg: "auto" }}
                align={{ base: "stretch", lg: "center" }}
              >
                <Input
                  placeholder="Enter Student ID"
                  width={{ base: "100%", lg: "300px" }}
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                />

                <Button
                  colorScheme="blue"
                  onClick={handleSearchByStudentId}
                  width={{ base: "100%", lg: "auto" }}
                >
                  Fetch Transactions
                </Button>
              </Flex>
            </Box>

            {transactions.length > 0 && (
              <Box p={4} bg="white" borderRadius="md" boxShadow="md">
                <Heading size="md" mb={4}>
                  Transaction Records
                </Heading>
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Amount Paid (₦)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transactions.map((transaction, index) => (
                      <Tr key={index}>
                        <Td>
                          {new Date(transaction.datePaid).toLocaleDateString()}
                        </Td>
                        <Td>
                          ₦{Number(transaction.amountPaid).toLocaleString()}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Box mt={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    Total Amount Paid: ₦{totalAmount.toLocaleString()}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
