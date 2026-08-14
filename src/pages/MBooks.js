import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
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
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "@/Components/ManagerLayout";

const GetBooks = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFee, setSelectedFee] = useState(null);
  const [fees, SetFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookId, setBookId] = useState('')
  const [searchedBook, setSearchedBook] = useState([])
  const [searchedFee, setSearchedFee] = useState([])
  const [feeId, setFeeId] = useState('')
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token || role !== "manager") {
      router.push("/StaffLogin");
      return;
    }

    axios
      .get("http://localhost:9500/staff/getDashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (!response.data.status) {
          router.push("/StaffLogin");
        }
      })
      .catch(() => router.push("/StaffLogin"));
  }, [router]);

  // searching for books
  const searchBook = (e) => {
    const inputId = e.target.value.trim();
    setBookId(inputId);
    // console.log(inputId)
    // console.log(books)
    const foundBook = books.find((s) => s.name === inputId);
    setSelectedBook(foundBook || null);
    // console.log(foundBook)
    if (!foundBook) {
      setDisplayMessage('Book does not exist')
      return;
    }
    console.log(foundBook)
    const foundBookArray = [foundBook]
    // console.log(foundBookArray)
    // console.log(searchedBook)
    setSearchedBook(foundBookArray)
  }

  //searching for fees
  const searchFees = (e) => {
    const inputId = e.target.value.trim();
    setFeeId(inputId);
    // console.log(inputId)
    // console.log(fees)
    const foundFees = fees.find((s) => s.fee === inputId);
    setSelectedFee(foundFees || null);
    // console.log(foundFees)
    if (!foundFees) {
      setDisplayMessage('Fee does not exist')
      return;
    }
    // console.log(foundFees)
    const foundFeeArray = [foundFees]
    console.log(foundFeeArray)
    setSearchedFee(foundFeeArray)
    // console.log(searchedFee)
  }

  //Getting fees
  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/fees/getFees"
        );
        SetFees(response.fees);
        // console.log(response.fees);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchFees();
  }, []);
  //Adding Fee modal
  const {
    isOpen: isAddFeeOpen,
    onOpen: onAddFeeOpen,
    onClose: onAddFeeClose,
  } = useDisclosure();
  // Formik for Adding Fee
  const addFeeformik = useFormik({
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
          "http://localhost:9500/fees/addFee",
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
        Swal.fire("Error", "There was a problem adding the fee", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  //Updating Fee Modal
  const {
    isOpen: isUpdateFeeModalOpen,
    onOpen: onUpdateFeeModalOpen,
    onClose: onUpdateFeeClose,
  } = useDisclosure();
  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    onUpdateFeeModalOpen(); // Open the modal only after updating the selected fee
  };

  const updateFeeFormik = useFormik({
    initialValues: {
      fee: selectedFee ? selectedFee.fee : "",
      price: selectedFee ? selectedFee.price : "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      fee: yup.string().required("This field is required!"),
      price: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `http://localhost:9500/fees/updateFee/`,
          { ...values, feeId: selectedFee.feeId }
        );

        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          SetFees((prevFees) =>
            prevFees.map((fee) =>
              fee.feeId === selectedFee.feeId ? { ...fee, ...values } : fee
            )
          );
          onUpdateFeeClose();
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
  const handleDeleteFee = async (feeId) => {
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
            "http://localhost:9500/fees/deleteFee",
            { feeId }
          );
          if (response.data.status) {
            Swal.fire("Deleted!", response.data.message, "success");
            SetFees(fees.filter((fee) => fee.feeId !== feeId));
            router.reload();
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
  //-----------------------------------------------------
  // Updating Book Modal
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateBookClose,
  } = useDisclosure();
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/book/getBooks"
        );
        setBooks(response.books);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);
  // Formik for adding a new book
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("This field is required!"),
      price: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/book/addBook",
          values
        );

        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          setBooks([...books, response.data.newBook]);
          resetForm();
          onClose();
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error adding book:", error);
        Swal.fire("Error", "There was a problem adding the book", "error");
      }
    },
  });
  // Formik for updating a book
  const updateFormik = useFormik({
    initialValues: {
      name: selectedBook?.name || "",
      price: selectedBook?.price || "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().required("This field is required!"),
      price: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `http://localhost:9500/book/updateBook/`,
          { ...values, bookId: selectedBook.bookId }
        );

        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.bookId === selectedBook.bookId
                ? { ...book, ...values }
                : book
            )
          );
          onUpdateBookClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error updating book:", error);
        Swal.fire("Error", "There was a problem updating the book", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const handleEdit = (book) => {
    setSelectedBook(book);
    // console.log(selectedBook);
    onUpdateModalOpen();
  };
  //------------------------------
  const handleDelete = async (bookId) => {
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
            "http://localhost:9500/book/deleteBook",
            { bookId }
          );
          if (response.data.status) {
            Swal.fire("Deleted!", response.data.message, "success");
            setBooks(books.filter((book) => book.bookId !== bookId));
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
  //----------------------------
  return (
    <Layout>
      <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
        <TabList>
          <Tab>Books</Tab>
          <Tab>Fees</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box size="lg" maxW="2000px" className="">
              <Box p={4}>
                <h2 className="text-center border-bottom">BOOKS</h2>
                <div className="d-flex justify-content-between align-items-center border-bottom">
                  <div className="col-4 p-3">
                    <Button
                      variant="Buttonsuccess"
                      onClick={onOpen}
                      className="col-6 btn-success btn form-control"
                    >
                      Add Book
                    </Button>
                  </div>
                  <div className="row col-6">
                    <div className="col-10">
                      <input
                        className="form-control"
                        placeholder="Search"
                        onChange={searchBook} value={bookId}
                      ></input>
                    </div>
                  </div>
                </div>
                {searchedBook.map((book) => (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Price</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr key={book._id}>
                        <Td>{book.bookId}</Td>
                        <Td>
                          {book.name}
                        </Td>
                        <Td>{book.price}</Td>
                        <Td>
                          <Button
                            colorScheme=""
                            onClick={() => handleEdit(book)}
                            size="sm"
                            className="text-warning"
                          >
                            Edit
                          </Button>
                          <Button
                            className="text-danger"
                            colorScheme=""
                            onClick={() =>
                              handleDelete(book.bookId)
                            }
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>

                    </Tbody>
                  </Table>
                ))}


                {/* Add Book Modal */}
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add a New Book</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-3">
                          <label htmlFor="name">Book Name</label>
                          <Input
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                          />
                          {formik.errors.name && (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="price">Price</label>
                          <Input
                            id="price"
                            name="price"
                            onChange={formik.handleChange}
                            value={formik.values.price}
                          />
                          {formik.errors.price && (
                            <div className="text-danger">
                              {formik.errors.price}
                            </div>
                          )}
                        </div>
                        <ModalFooter>
                          <Button colorScheme="green" type="submit">
                            Save Book
                          </Button>
                        </ModalFooter>
                      </form>
                    </ModalBody>
                  </ModalContent>
                </Modal>

                {/* Edit Book Modal */}
                <Modal isOpen={isUpdateModalOpen} onClose={onUpdateBookClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit Book</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <form onSubmit={updateFormik.handleSubmit}>
                        <div className="form-group mb-3">
                          <label htmlFor="name">Book Name</label>
                          <Input
                            id="name"
                            name="name"
                            onChange={updateFormik.handleChange}
                            value={updateFormik.values.name}
                          />
                          {updateFormik.errors.name && (
                            <div className="text-danger">
                              {updateFormik.errors.name}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="price">Price</label>
                          <Input
                            id="price"
                            name="price"
                            onChange={updateFormik.handleChange}
                            value={updateFormik.values.price}
                          />
                          {updateFormik.errors.price && (
                            <div className="text-danger">
                              {updateFormik.errors.price}
                            </div>
                          )}
                        </div>
                        <ModalFooter>
                          <Button colorScheme="green" type="submit">
                            Update Book
                          </Button>
                          <Button onClick={onUpdateBookClose}>Cancel</Button>
                        </ModalFooter>
                      </form>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {/* Books Table */}
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <Thead>
                      <Tr>
                        <Th>Book Id</Th>
                        <Th>Name</Th>
                        <Th>Price</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {books.map((book) => (
                        <Tr key={book.bookId}>
                          <Td>{book.bookId}</Td>
                          <Td>{book.name}</Td>
                          <Td>{book.price}</Td>
                          <Td>
                            <Button
                              colorScheme=""
                              size="sm"
                              ml={2}
                              className="text-warning"
                              onClick={() => handleEdit(book)}
                            >
                              Edit
                            </Button>
                            <Button
                              colorScheme=""
                              size="sm"
                              className="text-danger ms-2"
                              onClick={() => handleDelete(book.bookId)}
                            >
                              Delete
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box size="lg" maxW="2000px" ratio={15 / 5} className="col">
              <Box p={4}>
                <div className="mx-auto col-12 rounded-3">
                  <h2 className="text-center border-bottom">FEES</h2>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="col-4 p-3">
                      <Button
                        variant="Buttonsuccess"
                        onClick={onAddFeeOpen}
                        className="col-6 btn-success btn form-control"
                      >
                        Add Fee
                      </Button>
                    </div>
                    <div className="row col-6">
                      <div className="col-8">
                        <input
                          className="form-control"
                          placeholder="Search"
                          onChange={searchFees} value={feeId}
                        ></input>
                      </div>
                    </div>
                  </div>
                    {searchedFee.map((fee) => (
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Fee</Th>
                            <Th>Price</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr key={fee._id}>
                            <Td>{fee.feeId}</Td>
                            <Td>
                              {fee.fee} 
                            </Td>
                            <Td>{fee.price}</Td>
                            <Td>
                              <Button
                                colorScheme=""
                                onClick={() => handleEditFee(fee)}
                                size="sm"
                                className="text-warning"
                              >
                                Edit
                              </Button>
                              <Button
                                className="text-danger"
                                colorScheme=""
                                onClick={() =>
                                  handleDeleteFee(fee.feeId)
                                } 
                              >
                                Delete
                              </Button>
                            </Td>
                          </Tr>

                        </Tbody>
                      </Table>
                    ))}
                  <Modal
                    isCentered
                    onClose={onAddFeeClose}
                    isOpen={isAddFeeOpen}
                    motionPreset="slideInBottom"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Add Fee</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form onSubmit={addFeeformik.handleSubmit}>
                          <div className="form-group mb-3">
                            <label htmlFor="className">Fee</label>
                            <input
                              id="fee"
                              name="fee"
                              type="text"
                              onChange={addFeeformik.handleChange}
                              value={addFeeformik.values.fee}
                              className="form-control"
                            />
                            {addFeeformik.errors.fee ? (
                              <div className="text-danger">
                                {addFeeformik.errors.fee}
                              </div>
                            ) : null}
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="className">Price</label>
                            <input
                              id="price"
                              name="price"
                              type="text"
                              onChange={addFeeformik.handleChange}
                              value={addFeeformik.values.price}
                              className="form-control"
                            />
                            {addFeeformik.errors.price ? (
                              <div className="text-danger">
                                {addFeeformik.errors.price}
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
                  {/*Updating Fee Modal*/}
                  <Modal
                    isCentered
                    onClose={onUpdateFeeClose}
                    isOpen={isUpdateFeeModalOpen}
                    motionPreset="slideInBottom"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Fee</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form onSubmit={updateFeeFormik.handleSubmit}>
                          <div className="form-group mb-3">
                            <label htmlFor="fee">Fee</label>
                            <Input
                              id="fee"
                              name="fee"
                              onChange={updateFeeFormik.handleChange}
                              value={updateFeeFormik.values.fee}
                            />
                            {updateFeeFormik.errors.fee && (
                              <div className="text-danger">
                                {updateFeeFormik.errors.fee}
                              </div>
                            )}
                          </div>
                          <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <Input
                              id="price"
                              name="price"
                              onChange={updateFeeFormik.handleChange}
                              value={updateFeeFormik.values.price}
                            />
                            {updateFeeFormik.errors.price && (
                              <div className="text-danger">
                                {updateFeeFormik.errors.price}
                              </div>
                            )}
                          </div>
                          <ModalFooter>
                            <Button colorScheme="green" type="submit">
                              Edit Fee
                            </Button>
                            <Button onClick={onUpdateFeeClose} className="ms-2">
                              Cancel
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
                          <Th>Fee Id</Th>
                          <Th>Fee</Th>
                          <Th>Price</Th>
                          <Th> Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {fees.map((item) => (
                          <Tr key={item.feeId}>
                            <Td>{item.feeId}</Td>
                            <Td>{item.fee}</Td>
                            <Td>{item.price}</Td>
                            <Td>
                              <div>
                                <Button
                                  variant=""
                                  size="sm"
                                  className=" text-warning"
                                  onClick={() => handleEditFee(item)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="Buttondanger"
                                  size="sm"
                                  className=" text-danger ms-2"
                                  onClick={() => handleDeleteFee(item.feeId)}
                                >
                                  Delete
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};
export default GetBooks;
