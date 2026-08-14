import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Checkbox, Stack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import NavBar from "@/Components/NavBar";
import ParentSideNav from "@/Components/ParentSideNav";
import style from "../../styles/Home.module.css";
import axios from "axios";
import Swal from "sweetalert2";

function IndeterminateExample() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fees, setFees] = useState([]);
    const [routedStudents, setRoutedStudents] = useState([]);
    const [selectedFees, setSelectedFees] = useState({});
    const [parentId, setParentId] = useState();

    useEffect(() => {
        const fetchFees = async () => {
            const { students, id } = router.query;
            const parsedStudents = JSON.parse(students);
            setRoutedStudents(parsedStudents);
            setParentId(id);
            try {
                const { data: response } = await axios.get(
                    "http://localhost:9500/fees/getFees"
                );
                setFees(response.fees);

                // Initialize selectedFees state for each student
                const initialSelectedFees = {};
                parsedStudents.forEach((student) => {
                    initialSelectedFees[student.studentId] = new Array(response.fees.length).fill(false);
                });
                setSelectedFees(initialSelectedFees);

                setLoading(false);
            } catch (error) {
                console.error(error.message);
                setLoading(false);
            }
        };

        fetchFees();
    }, [router.query]);

    const handleCheckboxChange = (studentId, feeIndex) => {
        setSelectedFees((prev) => {
            const updatedSelectedFees = { ...prev };
            updatedSelectedFees[studentId][feeIndex] = !updatedSelectedFees[studentId][feeIndex];
            return updatedSelectedFees;
        });
    };

    const submitFees = async () => {
        // Ensure that School Fees is selected for each student
        const isSchoolFeesSelected = routedStudents.every((student) => {
            const schoolFeeIndex = fees.findIndex(fee => fee.fee === "School Fees");
            return selectedFees[student.studentId][schoolFeeIndex];
        });
    
        if (!isSchoolFeesSelected) {
            Swal.fire('Error!', 'School Fees is required for all students.', 'error');
            return;
        }
    
        try {
            const feeSelections = routedStudents.map((student) => {
                return {
                    studentId: student.studentId,  // Send studentId to the backend
                    selectedFees: fees.filter((_, index) => selectedFees[student.studentId][index])
                };
            });
    
            const { data: response } = await axios.post(
                "http://localhost:9500/student/saveSelectedFees",
                { feeSelections }  // Send fee selections including studentId
            );
    
            if (response.status) {
                Swal.fire('Success!', response.message, 'success');
                router.push(`/DashBoard/${parentId}`); // Redirect after success
            } else {
                Swal.fire('Error!', response.message, 'error');
            }
        } catch (error) {
            console.error(error.message);
            Swal.fire('Error!', 'An error occurred while submitting fees.', 'error');
        }
    };
    

    if (loading) return <Spinner />;

    return (
        <div className={style.unscroll}>
            <NavBar />
            <div className="row">
                <div className="container">
                    <div className="row flex-nowrap">
                        <ParentSideNav />
                        <div className="col-8 mx-auto my-5">
                            <div className="d-flex align-items-center justify-content-center my-3">
                                <h2>Choose Fees Of your Choice</h2>
                            </div>
                            <div className="col-8 mx-auto">
                                <Alert status="warning">
                                    <AlertIcon />
                                    School Fees Is Required
                                </Alert>
                            </div>
                            {routedStudents.map((student) => (
                                <div key={student.studentId}>
                                    <h3>{`Student: ${student.surName} ${student.otherNames}`}</h3>
                                    <div className="col-8 mx-auto my-5 border rounded-3 p-3">
                                        <Stack spacing={4}>
                                            {fees.map((fee, index) => (
                                                <Checkbox
                                                    key={index}
                                                    isChecked={selectedFees[student.studentId]?.[index] || false}
                                                    onChange={() => handleCheckboxChange(student.studentId, index)}
                                                >
                                                    {fee.fee}
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </div>
                                </div>
                            ))}
                            <div className="col-8 mx-auto">
                                <button
                                    className="form-control btn btn-success"
                                    onClick={submitFees}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IndeterminateExample;
