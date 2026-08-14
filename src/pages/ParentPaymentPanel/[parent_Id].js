import React, { useEffect, useState } from "react";
import style from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import ParentSideNav from "@/Components/ParentSideNav";
import NavBar from "@/Components/NavBar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  TableContainer,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import ParentLayout from "@/Components/ParentLayout";

const GetParentFees = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { parentId } = router.query;

  const [id, setId] = useState("");
  const [students, setStudents] = useState([]);
  const [admissionFee, setAdmissionFee] = useState(null);

  const [partPaymentAmount, setPartPaymentAmount] = useState("");
  const [bookPartPaymentAmount, setBookPartPaymentAmount] = useState("");

  useEffect(() => {
    const fetchFees = async () => {
      // console.log(router.query);
      const { parent_Id } = router.query;

      if (!parent_Id) return;

      setId(parent_Id);
      console.log(parent_Id);
      setLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:9500/student/getParentPayments",
          { parent_Id }
        );

        if (response.data.status) {
          const admitted = response.data.students.filter(
            (s) => s.type === "admitted"
          );
          const notAdmitted = response.data.students.filter(
            (s) => s.type === "notAdmitted"
          );

          // console.log(student[0].studentId)
          setStudents(admitted);

          if (notAdmitted.length > 0 && notAdmitted[0].fees.length > 0) {
            setAdmissionFee(notAdmitted[0].fees[0]);
          }
        } else {
          setError("No students found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch fees.");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [router.query]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "parent") {
      router.push("/Login");
      return;
    }

    axios
      .get("http://localhost:9500/parent/getDashboard", {
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

  // Checkout handlers
  const goToCheckout = (fee, studentId) => {
    console.log(studentId)
    if (id && fee && studentId) {
      router.push(
        `/CheckOut/${id}?paidFor=${fee.fee}&price=${fee.price}&studentId=${studentId}`
      );
    }
  };

  const bookPaymentCheckout = (book, studentId) => {
    if (id && book.name && studentId) {
      router.push(
        `/CheckOut/${id}?paidFor=${book.name}&price=${book.price}&studentId=${studentId}`
      );
    }
  };

  const handlePartPayment = (studentId) => {
    // console.log("Student ID:", studentId);
    // console.log("Amount:", partPaymentAmount);

    const description = "Part Payment For Fees";

    if (id && partPaymentAmount && studentId) {
      router.push(
        `/CheckOut/${id}?paidFor=${description}&price=${partPaymentAmount}&studentId=${studentId}`
      );
    }
  };

  const handleBookPartPayment = (studentId) => {
    const description = "Part Payment For Books";
    if (id && bookPartPaymentAmount && studentId) {
      router.push(
        `/CheckOut/${id}?paidFor=${description}&price=${bookPartPaymentAmount}&studentId=${studentId}`
      );
    }
  };

  return (

    <ParentLayout parentId={id}>

      <div style={{ height: "100vh", overflow: "hidden" }}>
        <div>
          <div >
            <div className="flex-nowrap h-100">
              <Box
                className=""
                h="calc(100vh - 70px)" // subtract your navbar height
                overflowY="auto"
                p={4}
              >              <Box p={4}>
                  {loading ? (
                    <Spinner size="xl" />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="mx-auto col-12 rounded-3">
                      <div className=" mx-auto rounded-3">
                        <div className="border-bottom text-center mb-2">
                          PAYMENTS
                        </div>

                        {/* Case 1: Admission fee */}
                        {admissionFee ? (
                          <div>
                            <div className="border-bottom text-center mb-2">
                              Admission Form Fees
                            </div>
                            <TableContainer>
                              <Table variant="striped" colorScheme="teal">
                                <Thead>
                                  <Tr>
                                    <Th>Fee Type</Th>
                                    <Th>Amount</Th>
                                    <Th>Action</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td>{admissionFee.fee}</Td>
                                    <Td>{admissionFee.price}</Td>
                                    <Td>
                                      <Button
                                        onClick={() =>
                                          goToCheckout(admissionFee, id)
                                        }
                                        className="btn btn-sm btn-success"
                                      >
                                        Pay
                                      </Button>
                                    </Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </div>
                        ) : students.length > 0 ? (
                          /* Case 2: Admitted students */
                          students.map((student) => (
                            <Accordion className="border" key={student.studentId} allowToggle >
                              <AccordionItem>
                                <h2>
                                  <AccordionButton>
                                    <Box
                                      as="span"
                                      flex="1"
                                      textAlign="left"
                                      className="text-primary border-bottom"
                                    >
                                      {student.surName} {student.otherNames}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <div className="mb-3 p-3 text-center border-bottom">
                                    {student.outstanding > 0
                                      ? `Outstanding Payment: ${student.outstanding}`
                                      : student.outstanding === 0
                                        ? "All payments cleared 🎉"
                                        : `Overpaid: ${Math.abs(
                                          student.outstanding
                                        )}`}
                                  </div>

                                  <Tabs variant="soft-rounded" colorScheme="green">
                                    <TabList>
                                      <Tab>Fees</Tab>
                                      <Tab>Books</Tab>
                                    </TabList>
                                    <TabPanels>
                                      {/* Fees Tab */}
                                      <TabPanel>
                                        {student.fees?.length > 0 ? (
                                          <TableContainer>
                                            <Table
                                              variant="striped"
                                              colorScheme="teal"
                                            >
                                              <Thead>
                                                <Tr>
                                                  <Th>Fee</Th>
                                                  <Th>Amount</Th>
                                                  <Th>Action</Th>
                                                </Tr>
                                              </Thead>
                                              <Tbody>
                                                {student.fees.map((fee, i) => (
                                                  <Tr key={i}>
                                                    <Td>{fee.fee}</Td>
                                                    <Td>{fee.price}</Td>
                                                    <Td>
                                                      <Button
                                                        onClick={() =>
                                                          goToCheckout(
                                                            fee,
                                                            student.studentId
                                                          )
                                                        }
                                                        className="btn btn-sm btn-success"
                                                      >
                                                        Pay
                                                      </Button>
                                                    </Td>
                                                  </Tr>
                                                ))}
                                              </Tbody>
                                            </Table>
                                          </TableContainer>
                                        ) : (
                                          <p>No fees available.</p>
                                        )}

                                        {/* Part payment input */}
                                        <div className="col-10 d-block p-2 mx-auto">
                                          <label>Part Payment:</label>
                                          <div className="">
                                            <div className="d-flex flex-column flex-lg-row gap-3">
                                              <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter amount"
                                                onChange={(e) =>
                                                  setPartPaymentAmount(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <div className="col-4">
                                                <Button
                                                  className="btn btn-success"
                                                  onClick={() =>
                                                    handlePartPayment(
                                                      student.studentId
                                                    )
                                                  }
                                                >
                                                  Pay Part Amount
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </TabPanel>

                                      {/* Books Tab */}
                                      <TabPanel>
                                        {student.books?.length > 0 ? (
                                          <TableContainer>
                                            <Table
                                              variant="striped"
                                              colorScheme="teal"
                                            >
                                              <Thead>
                                                <Tr>
                                                  <Th>Book</Th>
                                                  <Th>Price</Th>
                                                  <Th>Action</Th>
                                                </Tr>
                                              </Thead>
                                              <Tbody>
                                                {student.books.map((book, i) => (
                                                  <Tr key={i}>
                                                    <Td>{book.name}</Td>
                                                    <Td>{book.price}</Td>
                                                    <Td>
                                                      <Button
                                                        onClick={() =>
                                                          bookPaymentCheckout(
                                                            book,
                                                            student.studentId
                                                          )
                                                        }
                                                        className="btn btn-sm btn-success"
                                                      >
                                                        Pay
                                                      </Button>
                                                    </Td>
                                                  </Tr>
                                                ))}
                                              </Tbody>
                                            </Table>
                                          </TableContainer>
                                        ) : (
                                          <p>No books available.</p>
                                        )}

                                        {/* Part payment input */}
                                        <div className="col-10 p-2 mx-auto">
                                          <label>Part Payment for Book:</label>
                                          <div className="row">
                                            <div className="col-8">
                                              <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter amount"
                                                onChange={(e) =>
                                                  setBookPartPaymentAmount(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="col-4">
                                              <Button
                                                className="btn btn-success"
                                                onClick={() =>
                                                  handleBookPartPayment(
                                                    student.studentId
                                                  )
                                                }
                                              >
                                                Pay Part Amount
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </TabPanel>
                                    </TabPanels>
                                  </Tabs>
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                          ))
                        ) : (
                          <p>No students found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default GetParentFees;
