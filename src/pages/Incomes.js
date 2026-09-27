import React, { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
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
    Input
} from "@chakra-ui/react";
import Layout from "@/Components/BursarLayout";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import * as yup from 'yup'
import Swal from 'sweetalert2'

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [totalIncome, setTotalIncome] = useState('')
    const router = useRouter();
    const [source, setSource] = useState('');
    const [sources, setSources] = useState([])

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const { data } = await api.get(
                    "/income/getIncomes"
                );
                if (data.status) {
                    // console.log(data.payments);
                    setIncomes(data.getIncomes);
                    const initial = 0;
                    const incomes = data.getIncomes;
                    const total = incomes.reduce((sum, income) =>
                        (sum + income.amount), 0)
                    setTotalIncome(total)
                } else {
                    console.error("No income found");
                }
            } catch (error) {
                console.error("Error fetching incomes", error);
            }
            setLoading(false);
        };

        fetchIncomes();
    }, []);

    // fetch Sources
    useEffect(() => {
        const fetchSources = async () => {
            try {
                const { data } = await api.get(
                    '/income/findSources'
                )

                if (data.status) {
                    setSources(data.sources);
                    // console.log(data.sources)
                }
            } catch (error) {
                console.error("Error fetching sources:", error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchSources();
    }, [])

    const formik = useFormik({
        initialValues: { source: "", description: "", amount: "", paymentMethod: '' },
        validationSchema: yup.object({
            source: yup.string().required("This field is required!"),
            description: yup.string().required("This field is required!"),
            amount: yup.string().required("This field is required!"),
            paymentMethod: yup.string().required("This field is required!"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {

                const response = await api.post(
                    "/income/addIncome",
                    values
                );

                if (response.data.status) {
                    Swal.fire("Success", response.data.message, "success");
                    resetForm();
                    onClose();
                    router.reload();
                } else {
                    Swal.fire("Error", response.data.message, "error");
                }
            } catch (error) {
                Swal.fire("Error", "Problem adding income", "error");
            }
        },
    });

    const filterSources = async (source) => {
        const response = await api.get(
            '/income/findBySource',
            {
                params: {
                    source: source
                }
            }
        );
        setIncomes(response.data.incomes || [])
    }

    const handleEdit = (income) => {
        setSelectedIncome(income);
        onEditOpen();
    };

    const updateFormik = useFormik({
        initialValues: {
            source: selectedIncome?.source || "",
            description: selectedIncome?.description || "",
            amount: selectedIncome?.amount || "",
            paymentMethod: selectedIncome?.paymentMethod || ''
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            source: yup.string().required("This field is required!"),
            description: yup.string().required("This field is required!"),
            amount: yup.string().required("This field is required!"),
            paymentMethod: yup.string().required("This field is required!"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {

                const response = await api.post(
                    "/income/updateIncome",
                    { ...values, incomeRef: selectedIncome.incomeRef }
                );

                if (response.data.status) {
                    Swal.fire("Success", response.data.message, "success");
                    resetForm();
                    onClose();
                    router.reload();
                } else {
                    Swal.fire("Error", response.data.message, "error");
                }
            } catch (error) {
                Swal.fire("Error", "Problem adding expense", "error");
            }
        },
    });

    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   const role = (localStorage.getItem("role") || "").toLowerCase();

    //   if (!token || role !== "manager") {
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
            <h2 className="text-center">INCOMES</h2>
            <Box p={2}>
                <Box>
                    <div className="mx-auto col-12 rounded-3">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">

                            {/* TOTAL */}
                            <div className="col-12 col-md-auto">
                                <div className="bg-light border rounded-3 p-3">
                                    <span className="fw-bold">
                                        Total Income: {totalIncome}
                                    </span>
                                </div>
                            </div>

                            {/* CONTROLS */}
                            <div className="d-flex flex-column flex-md-row gap-2 col-12 col-md-auto">
                                <select
                                    id="source"
                                    name="source"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="form-select"
                                    style={{ minWidth: "180px" }}
                                >
                                    <option value="">All Sources</option>

                                    {sources?.map((item) => (
                                        <option value={item.source} key={item._id}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="btn btn-success"
                                    style={{ minWidth: "120px" }}
                                    onClick={() => filterSources(source)}
                                >
                                    Filter
                                </button>

                                <button
                                    className="btn btn-success"
                                    style={{ minWidth: "140px" }}
                                    onClick={onOpen}
                                >
                                    Add Income
                                </button>

                            </div>

                        </div>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            <TableContainer
                                overflowX="auto"
                                width="100%"
                            >
                                <Table
                                    variant="striped"
                                    colorScheme="teal"
                                    minWidth="900px"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Reference</Th>
                                            <Th>Sources</Th>
                                            <Th>Description</Th>
                                            <Th>Amount</Th>
                                            <Th>Payment Method</Th>
                                            <Th>Date</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {incomes.length === 0 ? (
                                            <Tr>
                                                <Td colSpan="6" className="text-center">
                                                    This Field Is Empty
                                                </Td>
                                            </Tr>
                                        ) : (
                                            incomes?.map((income) => (
                                                <Tr key={income._id}>
                                                    <Td>{income.incomeRef}</Td>
                                                    <Td>{income.source}</Td>
                                                    <Td>{income.description}</Td>
                                                    <Td>{income.amount}</Td>
                                                    <Td>{income.paymentMethod}</Td>
                                                    <Td>
                                                        {new Date(income.dateReceived).toLocaleDateString()}
                                                    </Td>
                                                    <Td><Button
                                                        onClick={() => handleEdit(income)}
                                                        size="sm"
                                                        className="text-primary"
                                                    >
                                                        Edit
                                                    </Button></Td>
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

            {/* Modal for adding Expense */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Income</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={formik.handleSubmit}>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Source</label>
                                    <Input
                                        placeholder="Enter Source"
                                        id="source"
                                        name="source"
                                        onChange={formik.handleChange}
                                        value={formik.values.source}
                                    />
                                    {formik.errors.source && (
                                        <div className="text-danger">{formik.errors.source}</div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label htmlFor="">Description</label>
                                    <Input
                                        placeholder="Enter Description"
                                        id="description"
                                        name="description"
                                        onChange={formik.handleChange}
                                        value={formik.values.description}
                                    />
                                    {formik.errors.description && (
                                        <div className="text-danger">{formik.errors.description}</div>
                                    )}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Amount</label>
                                    <Input
                                        placeholder="Enter Amount"
                                        id="amount"
                                        name="amount"
                                        onChange={formik.handleChange}
                                        value={formik.values.amount}
                                    />
                                    {formik.errors.amount && (
                                        <div className="text-danger">{formik.errors.amount}</div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label htmlFor="paymentMethod">Payment Method</label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        onChange={formik.handleChange}
                                        value={formik.values.paymentMethod}
                                        className="form-select"
                                    >
                                        <option value="" className="form-control">
                                            ---
                                        </option>
                                        <option value="Cash" className="form-control">
                                            Cash
                                        </option>
                                        <option value="Bank" className="form-control">
                                            Bank
                                        </option>
                                        <option value="Transfer" className="form-control">
                                            Transfer
                                        </option>
                                        <option value="POS" className="form-control">
                                            Card
                                        </option>
                                    </select>
                                    {formik.errors.paymentMethod && (
                                        <div className="text-danger">
                                            {formik.errors.paymentMethod}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                >
                                    Add Income
                                </Button>
                                <Button className="ms-2" onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/*Modal for editing  Income */}
            <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Income</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={updateFormik.handleSubmit}>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Sources</label>
                                    <Input
                                        placeholder="Enter Source"
                                        id="source"
                                        name="source"
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.source}
                                    />
                                    {updateFormik.errors.source && (
                                        <div className="text-danger">{updateFormik.errors.source}</div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label htmlFor="">Description</label>
                                    <Input
                                        placeholder="Enter Description"
                                        id="description"
                                        name="description"
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.description}
                                    />
                                    {updateFormik.errors.description && (
                                        <div className="text-danger">{updateFormik.errors.description}</div>
                                    )}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Amount</label>
                                    <Input
                                        placeholder="Enter Amount"
                                        id="amount"
                                        name="amount"
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.amount}
                                    />
                                    {updateFormik.errors.amount && (
                                        <div className="text-danger">{updateFormik.errors.amount}</div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label htmlFor="paymentMethod">Payment Method</label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.paymentMethod}
                                        className="form-select"
                                    >
                                        <option value="" className="form-control">
                                            ---
                                        </option>
                                        <option value="Cash" className="form-control">
                                            Cash
                                        </option>
                                        <option value="Bank" className="form-control">
                                            Bank
                                        </option>
                                        <option value="Transfer" className="form-control">
                                            Transfer
                                        </option>
                                        <option value="POS" className="form-control">
                                            Card
                                        </option>
                                    </select>
                                    {updateFormik.errors.paymentMethod && (
                                        <div className="text-danger">
                                            {updateFormik.errors.paymentMethod}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                >
                                    Edit Expense
                                </Button>
                                <Button className="ms-2" onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Layout>
    );
};

export default Income;