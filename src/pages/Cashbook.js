import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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

const Cashbook = () => {
    const [cashbooks, setCashbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    useEffect(() => {
        const fetchCashbook = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:9500/cashbook/getCashbook"
                );
                if (data.status) {
                    console.log(data.entries);
                    setCashbooks(data.entries);
                } else {
                    console.error("No entry found");
                }
            } catch (error) {
                console.error("Error fetching cashbook", error);
            }
            setLoading(false);
        };

        fetchCashbook();
    }, []);

    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   const role = (localStorage.getItem("role") || "").toLowerCase();

    //   if (!token || role !== "manager") {
    //     router.push("/StaffLogin");
    //     return;
    //   }

    //   axios
    //     .get("http://localhost:9500/staff/getDashboard", {
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

    return (
        <Layout>
            <h2 className="text-center">CASHBOOK</h2>
            <Box>
                <Box>
                    <div className="mx-auto col-12 rounded-3">
                        <div>
                            <div className="d-flex justify-content-between mb-1">
                                <div className="d-flex">
                                    <div>
                                        <Link
                                            href={"/Incomes"}
                                            className=" btn-success btn mb-1"
                                        >
                                            Income
                                        </Link>
                                    </div>
                                    <div className="ms-2">
                                        <Link
                                            href={"/Expenses"}
                                            className="btn-danger btn"
                                        >
                                            Expenses
                                        </Link>
                                    </div>
                                    <div className="ms-2 me-5">
                                        <Link
                                            href={"/Payments"}
                                            className="btn-primary btn"
                                        >
                                            Payments
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            <TableContainer className="border-4 rounded-3">
                                <Table variant="striped" colorScheme="teal">
                                    <Thead>
                                        <Tr>
                                            <Th>Date</Th>
                                            <Th>Description</Th>
                                            <Th>Debit</Th>
                                            <Th>Credit</Th>
                                            <Th>Balance</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {cashbooks?.length === 0 ? (
                                            <Tr>
                                                <Td colSpan="6" className="text-center">
                                                    This Field Is Empty
                                                </Td>
                                            </Tr>
                                        ) : (
                                            cashbooks?.map((cashbook) => (
                                                <Tr key={cashbook._id}>
                                                    <Td>
                                                        {new Date(cashbook.date).toLocaleDateString()}
                                                    </Td>
                                                    <Td>{cashbook.description}</Td>
                                                    <Td>{cashbook.debit? cashbook.debit:'---'}</Td>
                                                    <Td>{cashbook.credit? cashbook.credit:'---'}</Td>
                                                    <Td>{cashbook.balance}</Td>
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
        </Layout>
    );
};

export default Cashbook;