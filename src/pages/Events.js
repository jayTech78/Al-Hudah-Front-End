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

const GetEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        isOpen: isUpdateModalOpen,
        onOpen: onUpdateModalOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    const router = useRouter();

    // Fetch subjects initially
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const { data: response } = await api.get(
                    "/event/getEvents"
                );
                setEvents(response.events || []);
            } catch (error) {
                console.error("Error fetching subjects:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
          const token = localStorage.getItem("token");
          const role = (localStorage.getItem("role") || "").toLowerCase();

          if (!token || (role !== "manager")) {
            router.push("/StaffLogin");
            return;
          }

          api
            .get("/staff/getDashboard", {
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

    // Add role form handling


    const formik = useFormik({
        initialValues: {
            event: "",
            eventDate: ""
        },
        validationSchema: yup.object({
            event: yup.string().required("This field is required!"),
            eventDate: yup.string().required("This field is required!")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log(values)
            try {
                const { data: response } = await api.post(
                    "/event/addEvent",
                    values
                );
                if (response.status) {
                    Swal.fire("Success", response.message, "success");
                    router.reload();
                } else {
                    Swal.fire("Error", response.message, "error");
                }
            } catch (error) {
                console.error("Error adding event:", error);
                Swal.fire("Error", "There was a problem adding the event", "error");
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Handle edit event
    const handleEdit = (event) => {
        setSelectedEvent(event);
        onUpdateModalOpen();
    };

    const updateFormik = useFormik({
        initialValues: {
            event: selectedEvent ? selectedEvent.event : "",
            eventDate: selectedEvent ? selectedEvent.eventDate : ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            event: yup.string().required("This field is required!"),
            eventDate: yup.string().required("This field is required!")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const { data: response } = await api.post(
                    `/event/updateEvent/`,
                    { ...values, eventId: selectedEvent.eventId }
                );
                if (response.status) {
                    Swal.fire("Success", response.message, "success");
                    setEvents((prevEvents) =>
                        prevEvents.map((mapEvent) =>
                            mapEvent.eventId === selectedEvent.eventId
                                ? { ...mapEvent, event: values.event }
                                : mapEvent
                        )
                    );
                    onUpdateClose();
                } else {
                    Swal.fire("Error", response.message, "error");
                }
            } catch (error) {
                console.error("Error updating subject:", error);
                Swal.fire("Error", "There was a problem updating the event", "error");
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Handle delete Event
    const handleDelete = async (eventId) => {
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
                        "/event/deleteEvent",
                        { eventId }
                    );
                    if (response.status) {
                        Swal.fire("Deleted!", response.message, "success");
                        setEvents((prevEvents) =>
                            prevEvents.filter((event) => event.eventId !== eventId)
                        );
                    } else {
                        Swal.fire("Error", response.message, "error");
                    }
                } catch (error) {
                    console.error("Error deleting event:", error);
                    Swal.fire("Error", "Unable to delete event.", "error");
                }
            }
        });
    };

    return (
        <div className={style.unscroll}>
            <Layout>
                <Box>
                    <h2 className="text-center">EVENTS</h2>
                    <Button colorScheme="green" onClick={onOpen} className="my-4">
                        Add Event
                    </Button>
                    {/* Add Subject Modal */}
                    <Modal isCentered onClose={onClose} isOpen={isOpen}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add Event</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label" for="event">
                                            Event
                                        </label>
                                        <Input
                                            id="event"
                                            name="event"
                                            placeholder="Enter Event"
                                            value={formik.values.event}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.errors.event && (
                                            <div className="text-danger">{formik.errors.event}</div>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label" for='eventDate'>
                                            Event Date
                                        </label>
                                        <Input
                                            id="eventDate"
                                            name="eventDate"
                                            placeholder="Enter Event Date"
                                            value={formik.values.eventDate}
                                            onChange={formik.handleChange}
                                            type="Date"
                                        />
                                        {formik.errors.eventDate && (
                                            <div className="text-danger">{formik.errors.eventDate}</div>
                                        )}
                                    </div>

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
                    {/* Events Table */}
                    {loading ? (
                        <Spinner size="xl" />
                    ) : (
                        <TableContainer>
                            <Table variant="striped" colorScheme="teal">
                                <Thead>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Event</Th>
                                        <Th>Event Date</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {events.map((item) => (
                                        <Tr key={item._id}>
                                            <Td>{item.eventId}</Td>
                                            <Td>{item.event}</Td>
                                            <Td>{item.eventDate}</Td>
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
                                                    onClick={() => handleDelete(item.eventId)}
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
                            <ModalHeader>Edit Event</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <form onSubmit={updateFormik.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor='event'>Event</label>
                                            <Input
                                                id="event"
                                                name="event"
                                                onChange={updateFormik.handleChange}
                                                value={updateFormik.values.event}
                                                placeholder="Enter Event Date"
                                            />
                                        </div>

                                        {updateFormik.errors.event && (
                                            <div className="text-danger">
                                                {updateFormik.errors.event}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="event">Event Date</label>
                                        <div className="mb-3">
                                            <label className="form-label" for='eventDate'></label>
                                            <Input
                                                id="eventDate"
                                                name="eventDate"
                                                onChange={updateFormik.handleChange}
                                                value={updateFormik.values.eventDate}
                                                placeholder="Enter Event Date"
                                                type="Date"
                                            />
                                        </div>

                                        {updateFormik.errors.eventDate && (
                                            <div className="text-danger">
                                                {updateFormik.errors.eventDate}
                                            </div>
                                        )}
                                    </div>
                                    <ModalFooter>
                                        <Button colorScheme="green" type="submit">
                                            Edit Event
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

export default GetEvents;
