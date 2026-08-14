import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import SideNav from "@/Components/SideNav";
import ManagerNavBar from "@/Components/ParentNavBar";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Box,
  TableContainer,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "@/Components/PrincipalLayout";

const GetTeachers = () => {
  const router = useRouter();
  const [teachers, SetTeachers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/staff/getTeachers"
        );
        SetTeachers(response.staffs);
        console.log(response.staffs);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchFees();
  }, []);

  const formik = useFormik({
    initialValues: {
      fee: "",
      price: "",
    },
    validationSchema: yup.object({
      fee: yup.string().required("This field is required!"),
      price: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      try {
        const response = await axios.post(
          "http://localhost:9500/s/addTeacher",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        Swal.fire("Error", "There was a problem adding the role", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Layout>
      <Box size="lg" maxW="2000px" ratio={15 / 5} className="col py-3  ">
        <Box p={4}>
          
          <div className="mx-auto col-10 rounded-3">
              <div className="row mx-auto">
                <div className="col-8">
                  <input
                    className="form-control"
                    placeholder="Search Teacher "
                  ></input>
                </div>
                <div className="col-2 ms-1">
                  {" "}
                  <button type="button" className="btn btn-dark btn-sm">
                    Search
                  </button>
                </div>
              </div>
              <h2 className="text-center p-3 border-bottom">TEACHERS</h2>
              <div className="d-flex justify-content-center p-3 border-bottom">
                <Button
                  variant="Buttonsuccess"
                  onClick={onOpen}
                  className="w-100 btn-success btn"
                >
                  Add Teacher
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
                  <ModalHeader>Add Fee</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="className">Fee</label>
                        <input
                          id="fee"
                          name="fee"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.fee}
                          className="form-control"
                        />
                        {formik.errors.fee ? (
                          <div className="text-danger">{formik.errors.fee}</div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="className">Price</label>
                        <input
                          id="price"
                          name="price"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.price}
                          className="form-control"
                        />
                        {formik.errors.price ? (
                          <div className="text-danger">
                            {formik.errors.price}
                          </div>
                        ) : null}
                      </div>
                      <ModalFooter>
                        <Button
                          colorScheme="green"
                          onClick={onClose}
                          type="submit"
                          mr={3}
                        >
                          Save Fee
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <TableContainer>
                <Table variant="striped" colorScheme="teal">
                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Class</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {teachers.map((item) => (
                      <Tr>
                        <Td>{item.staffId}</Td>
                        <Td>{item.surName} {item.otherNames}</Td>
                        <Td>{!item.classId?'Nill':item.classId}</Td>
                        <Td>
                          <div>
                          <Button
                              variant="Buttondanger"
                              size="sm"
                              className=" btn-dark btn-sm btn"
                            >
                              Details
                            </Button>
                            <Button
                              variant="Buttondanger"
                              size="sm"
                              className=" btn-danger ms-2 btn-sm btn"
                            >
                              Delete
                            </Button>
                            <Button
                              variant="Buttonwarning"
                              size="sm"
                              className=" btn-warning ms-2 btn-sm btn"
                            >
                              Edit
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                  ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
        </Box>
      </Box>
    </Layout>
  );
};

export default GetTeachers;
