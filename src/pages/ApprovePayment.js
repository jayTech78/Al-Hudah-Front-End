import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import Layout from "@/Components/PrincipalLayout";

const ApprovePayment = () => {
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);
  const toast = useToast();

  const searchPaymentRef = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:9500/payment/getPaymentById", {
        paymentRef,
      });

      if (response.data.status) {
        setPayment(response.data.payment);
        toast({
          title: "Payment found",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setPayment(null);
        toast({
          title: response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      setError("An error occurred while fetching the payment.");
      toast({
        title: "Error",
        description: "Something went wrong while fetching payment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    try {
      const response = await axios.post("http://localhost:9500/payment/approvePayment", {
        paymentRef,
      });

      if (response.data.status) {
        toast({
          title: "Payment Approved",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setPayment(response.data.payment); // Updated payment info
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while approving payment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box p={6} maxW="md" mx="auto">
        <Text fontSize="2xl" mb={4} fontWeight="bold">
          Approve Payment
        </Text>

        <FormControl id="paymentRef" mb={4}>
          <FormLabel>Payment Reference</FormLabel>
          <Input
            type="text"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            placeholder="Enter payment reference"
          />
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={searchPaymentRef}
          isLoading={loading}
          loadingText="Searching..."
        >
          Search
        </Button>

        {error && (
          <Box color="red.500" mt={2}>
            {error}
          </Box>
        )}

        {payment && (
          <Box
            mt={6}
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            bg="gray.50"
          >
            <Text>
              <strong>Student ID:</strong> {payment.studentId}
            </Text>
            {/* <Text>
              <strong>Student Name:</strong> {payment.fullName || "N/A"}
            </Text> */}
            <Text>
              <strong>Amount Paid:</strong> {payment.amountPaid} Naira
            </Text>
            <Text>
              <strong>Description:</strong> {payment.paidFor}
            </Text>
            <Text>
              <strong>Status:</strong>{" "}
              <span style={{ color: payment.approved ? "green" : "orange" }}>
                {payment.approved ? "Approved" : "Pending"}
              </span>
            </Text>

            {!payment.approved && (
              <Button mt={4} colorScheme="green" onClick={handleApprovePayment}>
                Approve Payment
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default ApprovePayment;
