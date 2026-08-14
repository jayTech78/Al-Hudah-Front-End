import { useEffect, useState } from "react";
import {
  Box, Button, Spinner, Table, Thead, Tbody, Tr, Th, Td, Text,
  useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Input, FormControl, FormLabel, useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "@/Components/PrincipalLayout";
import { useRouter } from "next/router";

const TermAndSessionPage = () => {
  const router = useRouter()
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = useState(""); // "session" or "term"
  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "" });

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const { data } = await axios.get("http://localhost:9500/session/getSessions");
      setSessions(data.sessions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions");
    }
  };

  // useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     const role = (localStorage.getItem("role") || "").toLowerCase();

  //     if (!token || (role !== "principal")) {
  //       router.push("/StaffLogin");
  //       return;
  //     }

  //     axios
  //       .get("http://localhost:9500/staff/getDashboard", {
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

  // Fetch terms
  const fetchTerms = async () => {
    try {
      const { data } = await axios.get("http://localhost:9500/term/getTerms");
      setTerms(data.terms || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load terms");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSessions(), fetchTerms()]).finally(() => setLoading(false));
  }, []);

  // Handle activation
  const setActive = async (id, type) => {
    try {
      await axios.post(`http://localhost:9500/${type}/${id}/activate`);
      toast({ title: `${type} activated`, status: "success" });
      type === "session" ? fetchSessions() : fetchTerms();
    } catch (err) {
      toast({ title: `Error activating ${type}`, status: "error" });
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      if (formType === "session") {
        await axios.post("http://localhost:9500/session/createSession", {
          sessionName: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        fetchSessions();
        toast({ title: "Session created", status: "success" });
      } else {
        await axios.post("http://localhost:9500/term/createTerm", {
          termName: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        // console.log(formData.startDate, formData.endDate)
        fetchTerms();
        toast({ title: "Term created", status: "success" });
      }
      onClose();
      setFormData({ name: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error(err);
      toast({ title: `Error creating ${formType}`, status: "error" });
    }
  };

  const handleUpdate = async () => {
  try {
    if (formType === "session") {
      await axios.post(
        `http://localhost:9500/session/updateSession/${selectedItem._id}`,
        {
          sessionName: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }
      );

      fetchSessions();

      toast({
        title: "Session updated successfully",
        status: "success",
      });
    } else {
      await axios.post(
        `http://localhost:9500/term/updateTerm/${selectedItem._id}`,
        {
          termName: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }
      );

      fetchTerms();

      toast({
        title: "Term updated successfully",
        status: "success",
      });
    }

    setSelectedItem(null);

    setFormData({
      name: "",
      startDate: "",
      endDate: "",
    });

    onUpdateClose();
  } catch (err) {
    console.error(err);

    toast({
      title: "Update failed",
      status: "error",
    });
  }
};

const handleEdit = (item, type) => {
  setSelectedItem(item);
  setFormType(type);

  setFormData({
    name: type === "session" ? item.sessionName : item.termName,
    startDate: item.startDate
      ? new Date(item.startDate).toISOString().split("T")[0]
      : "",
    endDate: item.endDate
      ? new Date(item.endDate).toISOString().split("T")[0]
      : "",
  });

  onUpdateModalOpen();
};

  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const renderTable = (items, type) => (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>{type === "session" ? "Session Name" : "Term Name"}</Th>
          <Th>Start Date</Th>
          <Th>End Date</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.length > 0 ? (
          items.map((item) => (
            <Tr key={item._id}>
              <Td>{type === "session" ? item.sessionName : item.termName}</Td>
              <Td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : "-"}</Td>
              <Td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : "-"}</Td>
              <Td>{item.status}</Td>
              <Td>
                <div>
                  {item.status !== "Active" && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setActive(item._id, type)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    colorScheme=""
                    size="sm"
                    className="text-warning"
                    onClick={() => handleEdit(item, type)}
                  >
                    Edit
                  </Button>
                </div>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5} textAlign="center">
              No {type === "session" ? "sessions" : "terms"} found
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );

  return (
    <Layout>
      <Box p={6}>
        <Tabs>
          <TabList>
            <Tab>Sessions</Tab>
            <Tab>Terms</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Button colorScheme="green" mb={4} onClick={() => { setFormType("session"); onOpen(); }}>
                + Add Session
              </Button>
              {loading ? <Spinner /> : renderTable(sessions, "session")}
            </TabPanel>
            <TabPanel>
              <Button colorScheme="green" mb={4} onClick={() => { setFormType("term"); onOpen(); }}>
                + Add Term
              </Button>
              {loading ? <Spinner /> : renderTable(terms, "term")}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Modal for Add */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {formType === "session" ? "Session" : "Term"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>{formType === "session" ? "Session Name" : "Term Name"}</FormLabel>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>End Date</FormLabel>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>Save</Button>
            <Button ml={3} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Updating */}
      <Modal isOpen={isUpdateModalOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update {formType === "session" ? "Session" : "Term"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>
                {formType === "session"
                  ? "Session Name"
                  : "Term Name"}
              </FormLabel>

              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Start Date</FormLabel>

              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>End Date</FormLabel>

              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdate}>
              Update
            </Button>

            <Button ml={3} onClick={onUpdateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default TermAndSessionPage;
