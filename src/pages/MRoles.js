import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "@/utils/api";
import Layout from "@/Components/ManagerLayout";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Spinner,
  Input,
} from "@chakra-ui/react";

const GetRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const router = useRouter();

  // Fetch subjects initially
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/role/getRoles"
        );
        setRoles(response.roles || []);
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || (role !== "manager")) {
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

  // Add role form handling
  const formik = useFormik({
    initialValues: {
      theRole: "",
    },
    validationSchema: yup.object({
      theRole: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values)
      try {
        const { data: response } = await api.post(
          "/role/addRole",
          values
        );
        if (response.status) {
          Swal.fire("Success", response.message, "success");
          router.reload();
        } else {
          Swal.fire("Error", response.message, "error");
        }
      } catch (error) {
        console.error("Error adding subject:", error);
        Swal.fire("Error", "There was a problem adding the role", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle edit subject
  const handleEdit = (role) => {
    setSelectedRole(role);
    onUpdateModalOpen();
  };

  const updateFormik = useFormik({
    initialValues: {
      theRole: selectedRole ? selectedRole.theRole : "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      theRole: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data: response } = await api.post(
          `/role/updateRole/`,
          { ...values, roleId: selectedRole.roleId }
        );
        if (response.status) {
          console.log(response.message)
          Swal.fire("Success", response.message, "success");
          setRoles((prevRoles) =>
            prevRoles.map((role) =>
              role.roleId === selectedRole.roleId
                ? { ...role, theRole: values.theRole }
                : role
            )
          );
          onUpdateClose();
        } else {
          Swal.fire("Error", response.message, "error");
        }
      } catch (error) {
        console.error("Error updating subject:", error);
        Swal.fire("Error", "There was a problem updating the role", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle delete role
  const handleDelete = async (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data: response } = await api.post(
            "/role/deleteRole",
            { roleId }
          );
          if (response.status) {
            Swal.fire("Deleted!", response.message, "success");
            setRoles((prevRoles) =>
              prevRoles.filter((role) => role.roleId !== roleId)
            );
          } else {
            Swal.fire("Error", response.message, "error");
          }
        } catch (error) {
          console.error("Error deleting role:", error);
          Swal.fire("Error", "Unable to delete role.", "error");
        }
      }
    });
  };

  return (
    <div className={style.unscroll}>
      <Layout>
        <Box>
          <h2 className="text-center">ROLES</h2>
          <Button colorScheme="green" onClick={onOpen} className="my-4">
            Add Role
          </Button>
          {/* Add Subject Modal */}
          <Modal isCentered onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Role</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                  <Input
                    id="theRole"
                    name="theRole"
                    placeholder="Enter Role"
                    value={formik.values.theRole}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.theRole && (
                    <div className="text-danger">{formik.errors.theRole}</div>
                  )}
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      type="submit"
                      isLoading={formik.isSubmitting}
                    >
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
          {/* Subjects Table */}
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Role</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {roles.map((item) => (
                    <Tr key={item._id}>
                      <Td>{item.roleId}</Td>
                      <Td>{item.theRole}</Td>
                      <Td>
                        <Button
                          colorScheme=""
                          onClick={() => handleEdit(item)}
                          size="sm"
                          className="text-primary"
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme=""
                          onClick={() => handleDelete(item.roleId)}
                          size="sm"
                          ml={2}
                          className="text-danger"
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <Modal
            isCentered
            onClose={onUpdateClose}
            isOpen={isUpdateModalOpen}
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Role</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={updateFormik.handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="theRole">Role</label>
                    <Input
                      id="theRole"
                      name="theRole"
                      onChange={updateFormik.handleChange}
                      value={updateFormik.values.theRole}
                    />
                    {updateFormik.errors.theRole && (
                      <div className="text-danger">
                        {updateFormik.errors.theRole}
                      </div>
                    )}
                  </div>
                  <ModalFooter>
                    <Button colorScheme="green" type="submit">
                      Edit Role
                    </Button>
                    <Button onClick={onUpdateClose} className="ms-2">
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Layout>
    </div>
  );
};

export default GetRoles;
