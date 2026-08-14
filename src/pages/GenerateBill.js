import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/Components/BursarLayout";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const GenerateBill = () => {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [fees, setFees] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [displayFees, setDisplayFees] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token || (role !== "bursar")) {
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

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [classesRes, studentsRes, booksRes, feesRes] = await Promise.all([
          axios.get("http://localhost:9500/class/getClasses"),
          axios.get("http://localhost:9500/student/getStudents"),
          axios.get("http://localhost:9500/book/getBooks"),
          axios.get("http://localhost:9500/fees/getFees"),
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
  const getStudentClassInfo = (e) => {
    const inputId = e.target.value.trim();
    setStudentId(inputId);

    const found = students.find((s) => s.studentId === inputId);
    setSelectedStudent(found || null);

    if (!found) {
      setDisplayBooks([]);
      setDisplayFees([]);
      return;
    }

    const foundClass = classes.find((c) => c.className === found.classTo);
    if (!foundClass) {
      setDisplayBooks([]);
      setDisplayFees([]);
      return;
    }

    // Get books
    const matchedBooks =
      foundClass.classBooks
        ?.map((name) => books.find((b) => b.name === name))
        .filter(Boolean) || [];
    setDisplayBooks(matchedBooks);

    // Get fees
    const matchedFees =
      foundClass.classFees
        ?.map((feeName) => fees.find((f) => f.fee === feeName))
        .filter(Boolean) || [];
    setDisplayFees(matchedFees);
  };

  // Handlers for selecting book or fee
  const handleBookChange = (e) => {
    const [name, price] = e.target.value.split("|");
    setSelectedBook({ name, price });
  };

  const handleFeeChange = (e) => {
    const [name, price] = e.target.value.split("|");
    setSelectedFee({ name, price });
  };

  // Proceed to checkout
  const goToCheckout = () => {
    if (!selectedStudent) {
      setDisplayMessage("Empty Student ID");
      return;
    }

    if (!selectedFee && !selectedBook) {
      setDisplayMessage("No Fee or Book Selected");
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

    // Description + Amount
    let description = "";
    let amount = 0;

    if (selectedFee) {
      description += `${selectedFee.name || selectedFee.fee} `;
      amount += Number(selectedFee.price);
    }

    if (selectedBook) {
      description += `${selectedBook.name} `;
      amount += Number(selectedBook.price);
    }

    description = description.trim(); // clean up spacing

    Swal.fire(
      "Proceeding to Checkout",
      `Student: ${studentName}`,
      "success"
    ).then(() => {
      router.push({
        pathname: `/MCheckout/${parentId}`,
        query: {
          id: parentId,
          studentName,
          parentName,
          parentEmail,
          studentId,
          amount,
          description,
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
              <select
                name="fee"
                onChange={handleFeeChange}
                value={selectedFee ? `${selectedFee.name}|${selectedFee.price}` : ""}
                className="form-select mb-2"
              >
                <option value="">Select fee</option>
                {displayFees.length > 0 ? (
                  displayFees.map((fee, index) => (
                    <option key={index} value={`${fee.fee}|${fee.price}`}>
                      {fee.fee} — ₦{fee.price}
                    </option>
                  ))
                ) : (
                  <option disabled>No fee found</option>
                )}
              </select>

              {/* Books dropdown */}
              <select
                name="book"
                onChange={handleBookChange}
                value={selectedBook ? `${selectedBook.name}|${selectedBook.price}` : ""}
                className="form-select"
              >
                <option value="">Select book</option>
                {displayBooks.length > 0 ? (
                  displayBooks.map((book, index) => (
                    <option key={index} value={`${book.name}|${book.price}`}>
                      {book.name} — ₦{book.price}
                    </option>
                  ))
                ) : (
                  <option disabled>No books found</option>
                )}
              </select>
            </div>

            <div className="mb-3 p-1">
              <button
                onClick={goToCheckout}
                className="btn btn-success form-control"
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
