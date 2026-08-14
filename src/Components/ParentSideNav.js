import Link from "next/link";

const ParentSideNav = ({ parent_Id }) => {
  return (
    <div
      className="bg-success text-white h-100"
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <ul className="nav flex-column p-3">

        <li className="nav-item mb-2">
          <Link
            href={`/DashBoard/${parent_Id}`}
            className="nav-link text-white"
          >
            <i className="bi bi-house me-2"></i>
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            href={`/ParentPaymentPanel/${parent_Id}`}
            className="nav-link text-white"
          >
            <i className="bi bi-credit-card me-2"></i>
            Payment Panel
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            href={`/TransactionHistory?parent_Id=${parent_Id}`}
            className="nav-link text-white"
          >
            <i className="bi bi-clock-history me-2"></i>
            Transaction History
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href={`/Results?parent_Id=${parent_Id}`}
            className="nav-link text-white"
          >
            <i className="bi bi-file-earmark-text me-2"></i>
            Result
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default ParentSideNav;