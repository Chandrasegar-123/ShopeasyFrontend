import React from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("role"); // Get role from localStorage
  const logout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    sessionStorage.removeItem("token"); // Remove from session if stored
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">📦 Inventory Dashboard</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-bold ${["/dashboard", "/user-dashboard"].includes(location.pathname) ? "text-black active bg-light rounded px-3" : "text-light"}`} 
                to="/dashboard"
              >
                Products
              </Link>
            </li>

            {/* Show "Users" if admin, "Report" if user */}
            {userRole === "Admin" ? (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-bold ${location.pathname === "/users" ? "text-black active bg-light rounded px-3" : "text-light"}`} 
                  to="/users"
                >
                  Employees
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-bold ${location.pathname === "/report" ? "text-black active bg-light rounded px-3" : "text-light"}`} 
                  to="/report"
                >
                  Report
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Button 
                className={`nav-link fw-bold ${location.pathname === "/" ? "text-black active bg-light rounded px-3" : "text-light"}`}
                onClick={logout}
              >
                Log Out
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
