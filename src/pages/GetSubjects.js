import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Layout from "@/Components/PrincipalLayout";
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

const GetBooks = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   if (!token || role !== "Principal") {
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
  //       console.log(response.data);
  //       if (!response.data.status) {
  //         router.push("/StaffLogin");
  //       }
  //     })
  //     .catch(() => router.push("/StaffLogin"));
  // }, [router]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/subject/getSubjects"
        );
        setSubjects(response.subjects);
        // console.log(response.subjects);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  const formik = useFormik({
    initialValues: {
      subject: "",
    },
    validationSchema: yup.object({
      subject: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/subject/addSubject",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          // Update the subjects state with the new subject
          setSubjects((prevSubjects) => [
            ...prevSubjects,
            response.data.newSubject, // Assuming the response returns the newly added subject
          ]);
          resetForm(); // Reset form fields
          onClose(); // Close the modal
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error adding subject:", error);
        Swal.fire("Error", "There was a problem adding the subject", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateClose,
  } = useDisclosure();
  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    onUpdateModalOpen(); // Open the modal only after updating the selected Subject
  };

  const updateFormik = useFormik({
    initialValues: {
      subject: selectedSubject ? selectedSubject.subject : "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      subject: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `http://localhost:9500/subject/updateSubject/`,
          { ...values, subjectId: selectedSubject.subjectId }
        );

        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          setSubjects((prevSubjects) =>
            prevSubjects.map((subject) =>
              subject.subjectId === selectedSubject.subjectId
                ? { ...subject, ...values }
                : subject
            )
          );
          onUpdateClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error updating fee:", error);
        Swal.fire("Error", "There was a problem updating the fee", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async (subjectId) => {
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
          const response = await axios.post(
            "http://localhost:9500/subject/deleteSubject",
            { subjectId }
          );
          if (response.data.status) {
            Swal.fire("Deleted!", response.data.message, "success");
            setSubjects(
              subjects.filter((subject) => subject.subjectId !== subjectId)
            );
          } else {
            Swal.fire("Error", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting book:", error);
          Swal.fire("Error", "Unable to delete book.", "error");
        }
      }
    });
  };
  return (
    <div className={style.unscroll}>
      <Layout>
        <div className="row">
          <div className="container">
            <div className="row flex-nowrap">
              <Box size="lg" maxW="2000px" ratio={15 / 5} >
                <Box p={2}>
                  <div className="col-12 mx-auto rounded-3">
                    <h2 className="text-center border-bottom">SUBJECTS</h2>
                    <div className="d-flex justify-content-center p-1 border-bottom">
                      <Button
                        colorScheme="green"
                        onClick={onOpen}
                        className="w-100"
                      >
                        Add Subjects
                      </Button>
                    </div>
                    <Modal
                      isCentered
                      onClose={onClose}
                      isOpen={isOpen}
                      motionPreset="slideInBottom"
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Add Subject</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <form onSubmit={formik.handleSubmit}>
                            <div className="form-group mb-3">
                              <label htmlFor="subject">Subject</label>
                              <input
                                id="subject"
                                name="subject"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.subject}
                                className="form-control"
                              />
                              {formik.errors.subject ? (
                                <div className="text-danger">
                                  {formik.errors.subject}
                                </div>
                              ) : null}
                            </div>
                            <ModalFooter>
                              <Button
                                colorScheme="green"
                                type="submit"
                                mr={3}
                                isLoading={formik.isSubmitting}
                              >
                                Save Subject
                              </Button>
                              <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                          </form>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                    <div className="row my-2 mx-auto d-flex justify-content-center">
                      <div className="col-8">
                        <input
                          className="form-control"
                          placeholder="Search "
                        ></input>
                      </div>
                      <div className="col-2 ms-1">
                        {" "}
                        <button type="button" className="btn btn-dark btn-sm">
                          Search
                        </button>
                      </div>
                    </div>
                    {loading ? (
                      <div className="text-center my-4">
                        <Spinner size="xl" />
                        <p>Loading subjects...</p>
                      </div>
                    ) : (
                      <TableContainer>
                        <Table variant="striped" colorScheme="teal">
                          <Thead>
                            <Tr>
                              <Th>Id</Th>
                              <Th>Subject</Th>
                              <Th>Action</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {subjects.length === 0 ? (
                              <Tr>
                                <Td colSpan="1" className="text-center">
                                  This Field Is Empty
                                </Td>
                              </Tr>
                            ) : (
                              subjects.map((item) => (
                                <Tr key={item._id}>
                                  <Td>{item.subjectId}</Td>
                                  <Td>{item.subject}</Td>
                                  <Td>
                                    <div>
                                      <Button
                                        colorScheme=""
                                        size="sm"
                                        className="text-warning"
                                        onClick={() => handleEdit(item)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        colorScheme=""
                                        size="sm"
                                        className="ms-2 text-danger"
                                        onClick={() =>
                                          handleDelete(item.subjectId)
                                        }
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </Td>
                                </Tr>
                              ))
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                  <Modal
                    isCentered
                    onClose={onUpdateClose}
                    isOpen={isUpdateModalOpen}
                    motionPreset="slideInBottom"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Subject</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form onSubmit={updateFormik.handleSubmit}>
                          <div className="form-group mb-3">
                            <label htmlFor="subject">Subject</label>
                            <Input
                              id="subject"
                              name="subject"
                              onChange={updateFormik.handleChange}
                              value={updateFormik.values.subject}
                            />
                            {updateFormik.errors.subject && (
                              <div className="text-danger">
                                {updateFormik.errors.subject}
                              </div>
                            )}
                          </div>
                          <ModalFooter>
                            <Button colorScheme="green" type="submit">
                              Edit Subject
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
              </Box>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default GetBooks;
