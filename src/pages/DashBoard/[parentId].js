import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Text,
  Thead,
  Tr,
  TableContainer,
  Flex, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  VStack,
  Card,
  CardBody,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import EventCalendar from "@/Components/Calendar";
import ParentLayout from "@/Components/ParentLayout";
import api from '@/utils/api'

export default function ParentDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const router = useRouter();
  let { parentId } = router.query // Extract parent_Id from URL
  const [parent_Id, setParent_Id] = useState(null);

  // ✅ Route guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    let localParentId = localStorage.getItem('parentId')
    if (!token || role !== "parent") {
      router.push("/Login");
      return;
    }

    api
      .get("/parent/getDashboard", {
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

  useEffect(() => {
    if (!parentId) return;
    // console.log("Fetching students for Parent ID:", parentId);

    const fetchStudents = async () => {
      try {
        const response = await api.post(
          `/student/getStudentsByParentId/${parentId}`
        );
        // console.log(response.data);
        setStudents(response.data.students || []);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [parentId]);
  // console.log("Parent ID:", parentId); // Check if parent_Id is received

  //getting events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get("/event/getEvents"
        );
        setEvents(response.events || []);
        // console.log(response.events)
      } catch (error) {
        console.error("Error fetching events:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (studentId) => {
    router.push(`/EditStudent/${studentId}`);
  };

  const handleAddStudent = (parentId) => {
    router.push(`/AddStudent/${parentId}`);
  };

  const handleDetails = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const handleSendMessage = () => {
    alert(`Message Sent: ${message}`);
    setMessage("");
  };

  return (
    <>
      <ParentLayout parentId={parentId}>

        <Flex minH="100vh" bg="gray.50">


          {/* Main Content */}
          <Box
            flex="1"
            overflowY="auto"
            p={{ base: 4, md: 6, lg: 8 }}
          >
            {loading ? (
              <Flex justify="center" mt={20}>
                <Spinner size="xl" />
              </Flex>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <>
                {/* Page Header */}

                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  mb={8}
                  gap={4}
                >
                  <Heading size={{ base: "md", md: "lg" }}>
                    Parent Dashboard
                  </Heading>

                  <Button
                    colorScheme="green"
                    onClick={() => handleAddStudent(parentId)}
                  >
                    Register Student
                  </Button>
                </Flex>

                {/* Students */}

                <Card mb={8}>
                  <CardBody>

                    <Heading size="md" mb={5}>
                      Registered Students
                    </Heading>

                    <TableContainer overflowX="auto">

                      <Table variant="striped">

                        <Thead>

                          <Tr>

                            <Th>ID</Th>

                            <Th>Name</Th>

                            <Th>Status</Th>

                            <Th>Actions</Th>

                          </Tr>

                        </Thead>

                        <Tbody>

                          {students.length > 0 ? (

                            students.map((student) => (

                              <Tr key={student.studentId}>

                                <Td>{student.studentId}</Td>

                                <Td>

                                  {student.surName} {student.otherNames}

                                </Td>

                                <Td>

                                  <Text
                                    color={
                                      student.status === "Admitted"
                                        ? "green.500"
                                        : "red.500"
                                    }
                                    fontWeight="bold"
                                  >
                                    {student.status}
                                  </Text>

                                </Td>

                                <Td>

                                  <Flex
                                    gap={2}
                                    direction={{
                                      base: "column",
                                      sm: "row",
                                    }}
                                  >

                                    <Button
                                      size="sm"
                                      colorScheme="yellow"
                                      onClick={() =>
                                        handleEdit(student.studentId)
                                      }
                                    >
                                      Edit
                                    </Button>

                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      onClick={() =>
                                        handleDetails(student)
                                      }
                                    >
                                      Details
                                    </Button>

                                  </Flex>

                                </Td>

                              </Tr>

                            ))

                          ) : (

                            <Tr>

                              <Td colSpan={4} textAlign="center">

                                No Students Registered

                              </Td>

                            </Tr>

                          )}

                        </Tbody>

                      </Table>

                    </TableContainer>

                  </CardBody>
                </Card>

                {/* Calendar + Events */}

                <Grid
                  templateColumns={{
                    base: "1fr",
                    lg: "2fr 1fr",
                  }}
                  gap={6}
                >

                  <Card>

                    <CardBody>

                      <Heading size="md" mb={5}>
                        School Calendar
                      </Heading>

                      <EventCalendar />

                    </CardBody>

                  </Card>

                  <Card>

                    <CardBody>

                      <Heading size="md" mb={5}>
                        Upcoming Events
                      </Heading>

                      <VStack
                        align="stretch"
                        spacing={3}
                      >

                        {events.length > 0 ? (

                          events.map((event) => (

                            <Box
                              key={event.eventId}
                              p={3}
                              borderWidth="1px"
                              rounded="md"
                            >
                              <Text fontWeight="bold">
                                {event.event}
                              </Text>

                              <Text
                                fontSize="sm"
                                color="gray.500"
                              >
                                {event.eventDate}
                              </Text>

                            </Box>

                          ))

                        ) : (

                          <Text>No Upcoming Events</Text>

                        )}

                      </VStack>

                    </CardBody>

                  </Card>

                </Grid>
              </>
            )}
          </Box>
        </Flex>

        {/* Modal */}

        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />

          <ModalContent>

            <ModalHeader>
              Student Details
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody>

              {selectedStudent && (

                <Box textAlign="center">

                  <Image
                    src={
                      selectedStudent.profilePicture ||
                      "/default-avatar.png"
                    }
                    borderRadius="full"
                    boxSize="120px"
                    mx="auto"
                  />

                  <VStack
                    mt={4}
                    align="stretch"
                  >

                    <Text>
                      <b>Name:</b> {selectedStudent.surName}{" "}
                      {selectedStudent.otherNames}
                    </Text>

                    <Text>
                      <b>ID:</b> {selectedStudent.studentId}
                    </Text>

                    <Text>
                      <b>Gender:</b> {selectedStudent.gender}
                    </Text>

                    <Text>
                      <b>Date of Birth:</b>{" "}
                      {selectedStudent.dateOfBirth}
                    </Text>

                    <Text>
                      <b>Class:</b> {selectedStudent.classTo}
                    </Text>

                  </VStack>

                </Box>

              )}

            </ModalBody>

            <ModalFooter>

              <Button
                colorScheme="blue"
                onClick={onClose}
              >
                Close
              </Button>

            </ModalFooter>

          </ModalContent>

        </Modal>
      </ParentLayout>
    </>
  );
}
