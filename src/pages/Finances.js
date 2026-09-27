import React, { useState, useEffect } from "react";
import {useRouter} from "next/router";
import api from "@/utils/api";
import {
  Box,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import Layout from "@/Components/BursarLayout";
import { useFormik } from "formik";
import * as yup from "yup";

const GetFinances = () => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState()
  const [withdrawnAmount, setAmountWithdrawn] = useState()
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [selectedFinance, setSelectedFinance] = useState(null);

  const fetchFinances = async () => {
    try {
      const { data } = await api.get("/finance/getFinances");
      if (data.status) {
        setFinances(data.finances);
        console.log(data.finances)
      }
    } catch (error) {
      console.error("Failed to fetch finances", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get(
          "/finance/getAccounts"
        );
        if (data.status) {
          setCurrentBalance(data.currentBalance);

          setAmountWithdrawn(data.totalWithdrawals)
        } else {
          console.error("No pending payments found");
        }
      } catch (error) {
        console.error("Error fetching pending payments:", error);
      }
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const { data } = await api.get(
          "/finance/getFinances"
        );
        if (data.status) {
          console.log(data.finances);
          
          setFinances(data.finances)
        } else {
          console.error("No pending payments found");
        }
      } catch (error) {
        console.error("Error fetching pending payments:", error);
      }
      setLoading(false);
    };
    fetchFinances();
  }, []);

  const formik = useFormik({
    initialValues: {
      amountWithdrawn: "",
      withdrawnFor: "",
    },
    validationSchema: yup.object({
      amountWithdrawn: yup.string().required("Amount is required"),
      withdrawnFor: yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await api.post("/finance/addFinance", values);
        if (response.data.status) {
          toast({ title: "Finance added", status: "success" });
          fetchFinances();
          resetForm();
          onClose();
        } else {
          toast({ title: "Error", description: response.data.message, status: "error" });
        }
      } catch (err) {
        toast({ title: "Error", description: "Request failed", status: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const editFormik = useFormik({
    initialValues: {
      amountWithdrawn: "",
      withdrawnFor: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      amountWithdrawn: yup.string().required("Amount is required"),
      withdrawnFor: yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post("/finance/updateFinance", {
          ...values,
          _id: selectedFinance._id,
        });

        if (response.data.status) {
          toast({ title: "Updated successfully", status: "success" });
          fetchFinances();
          onEditClose();
        } else {
          toast({ title: "Update failed", description: response.data.message, status: "error" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Update request failed", status: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openEdit = (finance) => {
    setSelectedFinance(finance);
    onEditOpen();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Layout>
      <div className="row p-3 ">
      <div className="col-4 p-4 shadow-lg border rounded-3">Current Balance:N{currentBalance}</div>
      <div className="col-4 p-4 shadow-lg border rounded-3 ms-5">Amount Withdrawn:{withdrawnAmount}</div>
      </div>
      <Box p={4}>
        <h2 className="text-center border-bottom">Finances</h2>
        <Box textAlign="right" mb={4}>
          <Button colorScheme="teal" onClick={onOpen}>
            Add Finance
          </Button>
        </Box>

        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Amount</Th>
              <Th>Description</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {finances.map((item) => (
              <Tr key={item._id}>
                <Td>₦{item.amountWithdrawn}</Td>
                <Td>{item.withdrawnFor}</Td>
                <Td>{new Date(item.dateWithdrawn).toLocaleDateString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Add Finance Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Finance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <label>Amount</label>
              <input
                className="form-control mb-3"
                name="amountWithdrawn"
                onChange={formik.handleChange}
                value={formik.values.amountWithdrawn}
              />
              <label>Description</label>
              <input
                className="form-control mb-3"
                name="withdrawnFor"
                onChange={formik.handleChange}
                value={formik.values.withdrawnFor}
              />
              <ModalFooter>
                <Button colorScheme="green" type="submit" isLoading={formik.isSubmitting}>
                  Save
                </Button>
                <Button onClick={onClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Finance Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Finance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={editFormik.handleSubmit}>
              <label>Amount</label>
              <input
                className="form-control mb-3"
                name="amountWithdrawn"
                onChange={editFormik.handleChange}
                value={editFormik.values.amountWithdrawn}
              />
              <label>Description</label>
              <input
                className="form-control mb-3"
                name="withdrawnFor"
                onChange={editFormik.handleChange}
                value={editFormik.values.withdrawnFor}
              />
              <ModalFooter>
                <Button colorScheme="blue" type="submit" isLoading={editFormik.isSubmitting}>
                  Update
                </Button>
                <Button onClick={onEditClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default GetFinances;
