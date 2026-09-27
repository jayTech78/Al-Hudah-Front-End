import React, { useEffect, useState, useRef } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import api from "@/utils/api";
import ParentSideNav from "@/Components/ParentSideNav";
import ManagerNavBar from "@/Components/ParentNavBar";
import Image from "next/image";
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Box, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, useDisclosure, Spinner, VStack, HStack, Divider,
  Center, Text
} from "@chakra-ui/react";
import logo from "../logo-removebg-preview.png";
import ParentLayout from "@/Components/ParentLayout";

const TransactionHistory = () => {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [parent_Id, setParentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleViewReceipt = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "parent") {
      router.push("/Login");
      return;
    }

    api
      .get("/parent/getDashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data)
        if (!response.data.status) {
          router.push("/Login");
        }
      })
      .catch(() => router.push("/Login"));
  }, [router]);

  useEffect(() => {
    if (router.query.parent_Id) {
      setParentId(router.query.parent_Id);
      const fetchPayments = async () => {
        setLoading(true);
        try {
          const { data: response } = await api.post(
            "/payment/paymentHistory",
            { parent_Id: router.query.parent_Id }
          );
          // console.log(response.payments)
          setPayments(response.payments);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong fetching payments!",
          });
        }
        setLoading(false);
      };
      fetchPayments();
    }
  }, [router.query]);

  return (
    <ParentLayout parentId={parent_Id}>
      <div className={style.unscroll}>
        <div>
          <div >
            <Box>
              <Box p={4}>
                <div className=" col-12 p-1 rounded-3">
                  <h2 className="text-center">
                    PAYMENT HISTORY
                  </h2>

                  {loading ? (
                    <Spinner size="lg" />
                  ) : (
                    <TableContainer maxH="500px"
                      overflowY="auto"
                      overflowX="auto"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md">
                      <Table variant="striped" colorScheme="teal">
                        <Thead>
                          <Tr>
                            <Th>Payment Ref</Th>
                            <Th>Amount</Th>
                            <Th>Description</Th>
                            <Th>Student Paid For</Th>
                            <Th>Date Paid</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {payments.length === 0 ? (
                            <Tr>
                              <Td colSpan="6" className="text-center">
                                This Field Is Empty
                              </Td>
                            </Tr>
                          ) : (
                            payments.map((item) => (
                              <Tr key={item._id}>
                                <Td>{item.paymentRef}</Td>
                                <Td>{item.amountPaid}</Td>
                                <Td>{item.paidFor}</Td>
                                <Td>{item.studentName}</Td>
                                <Td>{new Date(item.datePaid).toLocaleDateString()}</Td>
                                <Td>
                                  <Button colorScheme="teal" onClick={() => handleViewReceipt(item)}>
                                    View Receipt
                                  </Button>
                                </Td>
                              </Tr>
                            ))
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              </Box>
            </Box>
          </div>
        </div>

        {/* Modal for showing receipt */}
        {selectedStudent && (
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Receipt for {selectedStudent.studentName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody ref={printRef}>
                <VStack spacing={4} border="1px solid #e2e8f0" p={4} bg="white" borderRadius="md" boxShadow="md">
                  <HStack justify="space-between" width="100%">
                    <Box>
                      <Image src={logo} alt="school logo" width={80} height={80} />
                      <Text fontWeight="bold">Al-Hudah International Schools</Text>
                      <Text>Plot 2-5 Al-Hudah Street, Itoko Titun.</Text>
                      <Text>Oke-Aregba, Abeokuta, Ogun State.</Text>
                      <Text>Tel: 08033809331, 08033663636</Text>
                    </Box>
                    <Box>
                      <Text textAlign="right">Date: {new Date().toLocaleDateString()}</Text>
                    </Box>
                  </HStack>
                  <Divider />
                  <Box width="100%">
                    <Text><strong>Student ID:</strong> {selectedStudent.studentId}</Text>
                    <Text><strong>Name:</strong> {selectedStudent.studentName}</Text>
                    <Text><strong>Payment Reference:</strong> {selectedStudent.paymentRef}</Text>
                    <Text><strong>Total Amount Paid:</strong> {selectedStudent.amountPaid} Naira</Text>
                    <Text><strong>Description:</strong> {selectedStudent.paidFor}</Text>
                    <Text><strong>Date Paid:</strong> {new Date(selectedStudent.DatePayed).toLocaleDateString()}</Text>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handlePrint}>Print Receipt</Button>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </div>
    </ParentLayout>
  );
};

export default TransactionHistory;
