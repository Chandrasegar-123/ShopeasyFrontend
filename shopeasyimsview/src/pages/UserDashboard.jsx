import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../components/Layout";
import api from "../api.js";

const UserDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from backend API
  useEffect(() => {
    const fetchItems = async () => {
        try {
          const response = await api.get("/product"); // Axios automatically adds headers
          setItems(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchItems();
  }, []);

  const handleEdit = (id) => {
    alert(`Edit Product ID: ${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
        });
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-5 text-primary fw-bold">📦 Product Inventory</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive shadow-lg rounded">
            <table className="table table-hover table-bordered text-center align-middle">
              <thead className="table-dark sticky-top">
                <tr>
                  <th style={{ width: "10%" }}>Name</th>
                  <th style={{ width: "20%" }}>Description</th>
                  <th style={{ width: "10%" }}>Quantity In Stock</th>
                  <th style={{ width: "10%" }}>Minimum Stock</th>
                  <th style={{ width: "10%" }}>Price ($)</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="table-light">
                    <td className="fw-semibold">{item.name}</td>
                    <td>{item.description}</td>
                    <td className={`fw-bold ${item.quantityInStock < item.minimumStockLevel ? "text-danger" : "text-success"}`}>
                      {item.quantityInStock}
                    </td>
                    <td className="fw-semibold">{item.minimumStockLevel}</td>
                    <td className="fw-semibold">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages).keys()].map((page) => (
                  <li key={page} className={`page-item ${currentPage === page + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
