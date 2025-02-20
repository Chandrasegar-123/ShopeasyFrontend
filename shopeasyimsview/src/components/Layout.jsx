import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        {children} {/* This will render the content of each page */}
      </div>
    </>
  );
};

export default Layout;
