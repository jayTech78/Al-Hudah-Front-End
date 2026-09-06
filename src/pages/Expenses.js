import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
    Input
} from "@chakra-ui/react";
import Layout from "@/Components/BursarLayout";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import * as yup from 'yup'
import Swal from 'sweetalert2'

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [totalExpenses, setTotalExpenses] = useState()
    const [categories, setCategories] = useState();
    const router = useRouter();
    const [category, setCategory] = useState('')
    const [selectedExpense, setSelectedExpense] = useState('')

    //fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:9500/expense/getExpenses"
                );
                if (data.status) {
                    // console.log(data.payments);
                    setExpenses(data.getExpenses);
                    //calculate expenses
                    const initial = 0;
                    const expenses = data.getExpenses
                    const total = expenses.reduce((sum, expense) => (sum + expense.amount), 0)

                    setTotalExpenses(total)
                } else {
                    console.error("No expense found");
                }
            } catch (error) {
                console.error("Error fetching expenses", error);
            }
            setLoading(false);
        };

        fetchExpenses();
    }, []);

    //Get Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:9500/expense/findCategories"
                );

                // console.log(data.categories)
                if (data.status) {
                    setCategories(data.categories);
                    // console.log(categories)
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const formik = useFormik({
        initialValues: { category: "", description: "", amount: "", paymentMethod: '' },
        validationSchema: yup.object({
            category: yup.string().required("This field is required!"),
            description: yup.string().required("This field is required!"),
            amount: yup.string().required("This field is required!"),
            paymentMethod: yup.string().required("This field is required!"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {

                const response = await axios.post(
                    "http://localhost:9500/expense/addExpense",
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
                Swal.fire("Error", "Problem adding expense", "error");
            }
        },
    });

    //Filter Categories
    const filterCategory = async (category) => {
        // console.log(category)
        const response = await axios.get(
            "http://localhost:9500/expense/findByCategory",
            {
                params: {
                    category: category
                }
            }
        );
        setExpenses(response.data.expenses || [])
    }

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        onEditOpen();
    };
   
    const updateFormik = useFormik({
        initialValues: { 
            category: selectedExpense?.category || "", 
            description: selectedExpense?.description || "", 
            amount: selectedExpense?.amount ||  "", 
            paymentMethod: selectedExpense?.paymentMethod || '' },
            enableReinitialize: true,
        validationSchema: yup.object({
            category: yup.string().required("This field is required!"),
            description: yup.string().required("This field is required!"),
            amount: yup.string().required("This field is required!"),
            paymentMethod: yup.string().required("This field is required!"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {

                const response = await axios.post(
                    "http://localhost:9500/expense/updateExpense",
                    { ...values, expenseRef: selectedExpense.expenseRef }
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
            <h2 className="text-center">EXPENSES</h2>
            <Box p={2}>
                <Box>
                    <div className="mx-auto col-12 rounded-3">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">

                            {/* TOTAL */}
                            <div className="col-12 col-md-auto">
                                <div className="bg-light border rounded-3 p-3">
                                    <span className="fw-bold">
                                        Total Expenses: {totalExpenses}
                                    </span>
                                </div>
                            </div>

                            {/* CONTROLS */}
                            <div className="d-flex flex-column flex-md-row gap-2 col-12 col-md-auto">

                                <select
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-select"
                                    style={{ minWidth: "180px" }}
                                >
                                    <option value="">All Categories</option>

                                    {categories?.map((item) => (
                                        <option value={item.category} key={item._id}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="btn btn-success"
                                    style={{ minWidth: "120px" }}
                                    onClick={() => filterCategory(category)}
                                >
                                    Filter
                                </button>

                                <button
                                    className="btn btn-success"
                                    style={{ minWidth: "140px" }}
                                    onClick={onOpen}
                                >
                                    Add Expense
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
                                            <Th>Category</Th>
                                            <Th>Description</Th>
                                            <Th>Amount</Th>
                                            <Th>Payment Method</Th>
                                            <Th>Date</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {expenses.length === 0 ? (
                                            <Tr>
                                                <Td colSpan="6" className="text-center">
                                                    This Field Is Empty
                                                </Td>
                                            </Tr>
                                        ) : (
                                            expenses?.map((expense) => (
                                                <Tr key={expense._id}>
                                                    <Td>{expense.expenseRef}</Td>
                                                    <Td>{expense.category}</Td>
                                                    <Td>{expense.description}</Td>
                                                    <Td>{expense.amount}</Td>
                                                    <Td>{expense.paymentMethod}</Td>
                                                    <Td>
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </Td>
                                                    <Td><Button
                                                        onClick={() => handleEdit(expense)}
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
                    <ModalHeader>Add Expense</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={formik.handleSubmit}>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Category</label>
                                    <Input
                                        placeholder="Enter Category"
                                        id="category"
                                        name="category"
                                        onChange={formik.handleChange}
                                        value={formik.values.category}
                                    />
                                    {formik.errors.category && (
                                        <div className="text-danger">{formik.errors.category}</div>
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
                                    Add Expense
                                </Button>
                                <Button className="ms-2" onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/*Modal for editing  Expense */}
            <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Expense</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={updateFormik.handleSubmit}>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label htmlFor="">Category</label>
                                    <Input
                                        placeholder="Enter Category"
                                        id="category"
                                        name="category"
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.category}
                                    />
                                    {updateFormik.errors.category && (
                                        <div className="text-danger">{updateFormik.errors.category}</div>
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

export default Expense;