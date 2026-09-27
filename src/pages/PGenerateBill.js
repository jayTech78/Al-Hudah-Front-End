import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Layout from "@/Components/PrincipalLayout";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const GenerateBill = () => {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [fees, setFees] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [displayFees, setDisplayFees] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || (role !== "principal")) {
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

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [classesRes, studentsRes, booksRes, feesRes] = await Promise.all([
          api.get("/class/getClasses"),
          api.get("/student/getStudents"),
          api.get("/book/getBooks"),
          api.get("/fees/getFees"),
        ]);
        setClasses(classesRes.data?.classes || []);
        setStudents(studentsRes.data?.students || []);
        setBooks(booksRes.data?.books || []);
        setFees(feesRes.data?.fees || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Fetch student class info
  const getStudentClassInfo = async (e) => {
    const inputId = e.target.value.trim();
    setStudentId(inputId);

    const found = students.find((s) => s.studentId === inputId);

    setSelectedStudent(found || null);

    if (!found) {
      Swal.fire("Error", "Student Not Found", "error");
      setDisplayBooks([]);
      setDisplayFees([]);
      return;
    }

    if (found.status === "Applicant") {
      Swal.fire("Error", "Student Not Yet Admitted", "error");
      return;
    }

    try {
      const { data } = await api.get(
        `/student/checkStudentPayment/${found.studentId}`
      );

      setSelectedItems([]);

      if (data.completed) {
        setPaymentCompleted(true);
        setDisplayBooks([]);
        setDisplayFees([]);

        Swal.fire(
          "Completed",
          "Student has paid all required fees.",
          "success"
        );
      } else {
        setPaymentCompleted(false);
        setDisplayBooks(data.unpaidBooks || []);
        setDisplayFees(data.unpaidFees || []);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Unable to check payment status", "error");
    }
  };

  const handleCheck = (item) => {

    setSelectedItems((prev) => {

      const exists = prev.find(
        (i) => i.name === item.name
      );

      if (exists) {

        return prev.filter(
          (i) => i.name !== item.name
        );

      }

      return [...prev, item];

    });

  };

  // Proceed to checkout
  const goToCheckout = () => {
    if (!selectedStudent) {
      setDisplayMessage("Empty Student ID");
      return;
    }

    if (selectedItems.length === 0) {
      setDisplayMessage("Please select at least one fee or book.");
      return;
    }

    setDisplayMessage("");

    // Parent details
    const parentId = selectedStudent.parentId;
    const parentName = selectedStudent.parentName || "";
    const parentEmail = selectedStudent.parentEmail || "";

    // Student details
    const studentName = `${selectedStudent.surName} ${selectedStudent.otherNames}`;
    const studentId = selectedStudent.studentId;

    const amount = selectedItems.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );

    const description = selectedItems
      .map(item => item.name)
      .join(", ");

    Swal.fire(
      "Proceeding to Checkout",
      `Student: ${studentName}`,
      "success"
    ).then(() => {
      router.push({
        pathname: `/PCheckout/${parentId}`,
        query: {
          id: parentId,
          studentName,
          parentName,
          parentEmail,
          studentId,
          amount,
          description,
          items: JSON.stringify(selectedItems)
        },
      });
    });
  };

  return (
    <Layout>
      <div className="my-3 mx-auto p-3 bg-light border-3 rounded-3 col-12">
        <h4 className="display-6 mb-3">Generate Bill</h4>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="p-3">
            {displayMessage && (
              <div className="alert alert-danger" role="alert">
                {displayMessage}
              </div>
            )}

            <div className="form-group mb-2">
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                onChange={getStudentClassInfo}
                value={studentId}
                className="form-control"
                placeholder="Enter Student ID"
              />
            </div>

            {selectedStudent && (
              <div className="mb-3">
                <strong>Student:</strong> {selectedStudent.surName}{" "}
                {selectedStudent.otherNames}
                <br />
                <strong>Class:</strong> {selectedStudent.classAdmittedTo}
              </div>
            )}

            <div className="mb-3 p-1">
              <label className="form-label">Fees / Books</label>

              {/* Fees dropdown */}
              <div className="border rounded p-3 mb-3">

                <h5 className="fw-bold text-success">
                  Fees
                </h5>

                {
                  displayFees.length === 0 ?

                    <p>No outstanding fees.</p>

                    :

                    displayFees.map((fee) => (

                      <div
                        key={fee._id}
                        className="form-check"
                      >

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selectedItems.some(
                              i => i.name === fee.fee
                            )
                          }
                          onChange={() =>
                            handleCheck({
                              name: fee.fee,
                              price: fee.price,
                              type: "Fee"
                            })
                          }
                        />

                        <label className="form-check-label">

                          {fee.fee}

                          (₦{fee.price})

                        </label>

                      </div>

                    ))

                }

              </div>

              {/* Books dropdown */}
              <div className="border rounded p-3">

                <h5 className="fw-bold text-primary">

                  Books

                </h5>

                {

                  displayBooks.length === 0 ?

                    <p>No outstanding books.</p>

                    :

                    displayBooks.map((book) => (

                      <div
                        key={book._id}
                        className="form-check"
                      >

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selectedItems.some(
                              i => i.name === book.name
                            )
                          }
                          onChange={() =>
                            handleCheck({
                              name: book.name,
                              price: book.price,
                              type: "Book"
                            })
                          }
                        />

                        <label className="form-check-label">

                          {book.name}

                          (₦{book.price})

                        </label>

                      </div>

                    ))

                }

              </div>
            </div>

            <div className="mb-3 p-1">
              <button
                className="btn btn-success form-control"
                onClick={goToCheckout}
                disabled={paymentCompleted}
              >
                Continue To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenerateBill;
