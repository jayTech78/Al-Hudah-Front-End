import React, { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import Link from "next/link";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Divider,
  Text,
  Center,
} from "@chakra-ui/react";
import Layout from "@/Components/BursarLayout";
import logo from "../logo-removebg-preview.png";
import Image from "next/image";
import { useRouter } from "next/router";

const ClassStudentTabs = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const printRef = useRef();
  const router = useRouter();
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get(
          "/payment/getPayments"
        );
        if (data.status) {
          // console.log(data.payments);
          setPayments(data.payments);
        } else {
          console.error("No classes found");
        }
      } catch (error) {
        console.error("Error fetching classes and students:", error);
      }
      setLoading(false);
    };

    fetchPayments();
  }, []);

  // useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     const role = (localStorage.getItem("role") || "").toLowerCase();
  
  //     if (!token || role !== "bursar") {
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;

    // Replace body content with the modal content for printing
    document.body.innerHTML = printContent.innerHTML;

    // Open print dialog
    window.print();

    // Restore original content and reload to restore event listeners
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  // Function to handle viewing receipt (open modal)
  const handleViewReceipt = (student) => {
    console.log(student)
    setSelectedStudent(student); // Set the student to be viewed in the modal
    onOpen(); // Open the modal
  };

  return (
    <Layout>
      <h2 className="text-center">Payments</h2>
      <Box>
        <Box p={4}>
          <div className="mx-auto col-12 rounded-3">
            <div className="p-1 d-flex border-bottom justify-content-between">
              <div>
              </div>
              <div className="me-5">
              <Link
                href={"/UnCompletePayment"}
                className="col-8 btn-primary btn mb-1"
              >
                UnComplete Payments / Approve Payments
              </Link>
              </div>
            </div>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              <TableContainer>
                <Table variant="striped" colorScheme="teal">
                  <Thead>
                    <Tr>
                      <Th>Payment Ref</Th>
                      <Th>Student Name</Th>
                      <Th>Amount</Th>
                      <Th>Description</Th>
                      <Th>Date Payed</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {payments.length === 0 ? (
                      <Tr>
                        <Td colSpan="5" className="text-center">
                          This Field Is Empty
                        </Td>
                      </Tr>
                  ) : (
                    payments.map((payment) => (
                        <Tr key={payment._id}>
                          <Td>{payment.paymentRef}</Td>
                          <Td>{payment.fullName}</Td>
                          <Td>{payment.amountPaid}</Td>
                          <Td>{payment.description}</Td>
                          <Td>
                            {new Date(payment.datePaid).toLocaleDateString()}
                          </Td>
                          <Td>
                            <Button
                              colorScheme="teal"
                              onClick={() => handleViewReceipt(payment)}
                            >
                              View Receipt
                            </Button>
                          </Td>
                        </Tr>
                    ))
                  )}
                  {/* Modal for showing receipt */}
                  {selectedStudent && (
                    <Modal isOpen={isOpen} onClose={onClose} size="lg">
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>
                          Receipt for {selectedStudent.name}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody ref={printRef}>
                          {/* Custom Receipt Design */}
                          <VStack
                            spacing={4}
                            border="1px solid #e2e8f0"
                            padding="20px"
                            backgroundColor="white"
                            borderRadius="md"
                            boxShadow="md"
                            textAlign="left"
                          >
                            {/* Header: School Logo, Name */}
                            <HStack justify="space-between" width="100%">
                              <Box>
                                <Text fontSize="md" fontWeight="bold">
                                  <Image
                                    src={logo}
                                    alt="school logo"
                                    width={80}
                                    height={80}
                                  />
                                  Al-Hudah International Schools
                                  <Text>
                                    Plot 2-5 Al-Hudah Street, Itoko Titun.
                                  </Text>
                                  <Text>Oke-Aregba, Abeokuta, Ogun State.</Text>
                                  <Text>Tel: 08033809331, 08033663636</Text>
                                </Text>
                                <Text fontSize="sm"></Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" textAlign="right">
                                  Date: {new Date().toLocaleDateString()}
                                </Text>
                              </Box>
                            </HStack>

                            <Divider />

                            {/* Student Information */}
                            <Box width="100%">
                              <Text>
                               
                              </Text>
                              <Text>
                                <strong>Name:</strong>{" "}
                                {selectedStudent.fullName}
                              </Text>
                            </Box>

                            <Divider />

                            {/* Payment Details */}
                            <Box width="100%">
                              <HStack justify="space-between">
                                <Text fontWeight="bold">
                                  Payment Reference:
                                </Text>
                                <Text>{selectedStudent.paymentRef}</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontWeight="bold">
                                  Total Amount Paid:
                                </Text>
                                <Text>{selectedStudent.amountPaid} Naira</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontWeight="bold">Description:</Text>
                                <Text>{selectedStudent.description}</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontWeight="bold">Date Payed:</Text>
                                <Text>{selectedStudent.datePaid}</Text>
                              </HStack>
                            </Box>

                            <Divider />

                            {/* Footer */}
                            <Center>
                              <Text fontSize="sm">
                                Thank you for your payment. Please retain this
                                receipt for your records.
                              </Text>
                            </Center>
                          </VStack>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handlePrint}
                          >
                            Print Receipt
                          </Button>
                          <Button variant="ghost" onClick={onClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  )}
                  </Tbody>

                  
                </Table>
              </TableContainer>
            )}
          </div>
        </Box>
      </Box>
    </Layout>
  );
};

export default ClassStudentTabs;
