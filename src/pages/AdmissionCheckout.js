import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import api from "@/utils/api";
import Layout from "@/Components/ParentLayout";
import dynamic from "next/dynamic";
import { Box, Spinner } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

// Dynamically import PaystackButton with SSR disabled
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false },
);

const GetStudents = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paidFor, setPaidFor] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState(0); // Initialize to 0
  const [userId, setId] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null); // Set to null initially
  const [studentName, setStudentName] = useState(""); // Default student name to 'N/A' if studentId is not provided
  const [selectedItems, setSelectedItems] = useState([]);
  const paidForItems = [];
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const { id, paidFor, price, studentName } = router.query;
      //   console.log(studentName)
      // console.log(id)
      // console.log(router.query)
      // Ensure `id` is present, and fallback values for optional fields
      if (!id) return;
      setId(id);
      setPaidFor(paidFor || "No description provided");
      setPrice(Number(price) || 0);
      setStudentName(studentName); // Set to null if studentId is not provided

      try {
        setLoading(true);

        // Fetch Parent Details
        const parentResponse = await api.post("/parent/findParentById", { id });

        // Check if parent data exists
        const parent = parentResponse.data.parent?.[0];
        if (parent) {
          const fullName =
            `${parent.surName || ""} ${parent.otherNames || ""}`.trim();
          setEmail(parent.email || "N/A");
          setFullName(fullName.toUpperCase());
        } else {
          setError("Parent data not found.");
        }

        // Fetch Student Details only if `studentId` is provided
        if (studentId) {
          const studentResponse = await api.post("/student/findStudentById", {
            studentId,
          });

          // Check if student data exists
          const student = studentResponse.data.student?.[0];
          if (student) {
            const studentFullName =
              `${student.surName || ""} ${student.otherNames || ""}`.trim();
            // console.log(studentName)
            setStudentName(studentFullName);
          } else {
            setStudentName(studentName); // Fallback if student data not found
          }
        }
      } catch (error) {
        setError("Failed to fetch the required details.");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [router.query]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
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

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: price * 100, // Convert to lowest currency unit
    publicKey: "pk_test_ea4c9b4f0591ec661174704f63adaadf2b2a2423",
  };

  const handlePaystackSuccessAction = async (reference) => {
    try {
      const verifyRes = await api.post("/payment/verifyPayment", reference);

      if (!verifyRes.data.status) {
        Swal.fire("Error", "Payment could not be verified", "error");
        return;
      }

      // console.log("paidFor:", paidFor);

      const paidForItems = [];
      paidForItems.push({ name: paidFor, price: price });

      console.log("paidForItems:", paidForItems);

      setSelectedItems(paidForItems);

      const paymentObj = {
        Price: price,
        email,
        selectedItems: paidForItems,
        fullName,
        parentId: userId,
        parentName: fullName,
        studentName,
        studentId: studentName || null,
      };

      const studentData = JSON.parse(
        sessionStorage.getItem("studentRegistration"),
      );

      // console.log("studentData:", studentData);

      if (studentData) {
        const addStudentResponse = await api.post(
          "/student/addStudent",
          studentData,
        );

        Swal.fire("Success", addStudentResponse.data.message, "success");
        // console.log("paymentObj:", paymentObj);

        const paymentRes = await api.post("/payment/addPayment", paymentObj);

        if (!paymentRes.data.status) {
          Swal.fire("Error", paymentRes.data.message, "error");
          return;
        }

        Swal.fire("Success", paymentRes.data.message, "success");
      } else {
        console.warn("No student data found in session storage.");
      }

      router.push(`/DashBoard/${userId}`);
    } catch (error) {
      console.error("Payment verification failed", error);

      Swal.fire("Error", "Payment verification failed", "error");
    }
  };

  const handlePaystackCloseAction = () => {
    console.log("Payment dialog closed");
  };

  const componentProps = {
    ...config,
    text: "Continue to Payment",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <Layout parentId={userId}>
      <div className="">
        <Box className="col-12 py-3">
          <h3 className="text-center">CheckOut</h3>
          <Box p={4}>
            {loading ? (
              <Spinner size="xl" />
            ) : error ? (
              <div>{error}</div>
            ) : (
              <div className="mb-3 border-3 mx-auto border-success border rounded-3">
                <div className="d-flex justify-content-between p-3">
                  <div>Name:</div>
                  <div>{fullName}</div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div>Email:</div>
                  <div>{email}</div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div>Paying For/Description:</div>
                  <div>{paidFor}</div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div>Amount:</div>
                  <div>N{price}</div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div>Student Name:</div>
                  <div>{studentName}</div>
                </div>
                <div className="col-5 mx-auto p-2 mb-3 w-100">
                  {isClient && (
                    <PaystackButton
                      {...componentProps}
                      className="w-100 btn-success btn"
                    />
                  )}
                </div>
              </div>
            )}
          </Box>
        </Box>
      </div>
    </Layout>
  );
};

export default GetStudents;
