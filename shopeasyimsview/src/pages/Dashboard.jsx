import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../components/Layout";
import { Modal, Button } from "react-bootstrap";
import api from "../api.js";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: "",
  description: "",
  quantityInStock: "",
  minimumStockLevel: "",
  price: "",
});

const handleShowAddModal = () => setShowAddModal(true);
const handleCloseAddModal = () => setShowAddModal(false);

const handleAddProduct = async () => {
  try {
    const response = await api.post("/product", newProduct);
    if (response.status === 201) {
      setItems([...items, response.data]); // Update UI with new product
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
  setShowAddModal(false);
};


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

  const handleEdit = (item) => {
    setSelectedItem(item); // Set selected product
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal
    setSelectedItem(null); // Clear selected product
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        const response = await api.delete(`/product/${id}`);
        if (response.status === 204) {
          // Remove the deleted item from the list
          setItems(items.filter((item) => item.productId !== id));
        }
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
  console.log(selectedItem);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/product/${selectedItem.productId}`, selectedItem);
      if (response.status === 204) {
        // Update the list with the modified product
        setItems(items.map((item) => (item.productId === selectedItem.productId ? selectedItem : item)));
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
    setShowModal(false);
  };
  
  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-5 text-primary fw-bold">
          📦 Product Inventory
        </h2>
        <div className="text-center mb-4">
          <button className="btn btn-success fw-bold" onClick={handleShowAddModal}>
           ➕ Add Product
          </button>
          </div>

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
                  <th style={{ width: "10%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="table-light">
                    <td className="fw-semibold">{item.name}</td>
                    <td>{item.description}</td>
                    <td
                      className={`fw-bold ${
                        item.quantityInStock < item.minimumStockLevel
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {item.quantityInStock}
                    </td>
                    <td className="fw-semibold">{item.minimumStockLevel}</td>
                    <td className="fw-semibold">${item.price.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.productId)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
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
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Modal for Editing Product */}
        {/* Modal for Editing Product */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={selectedItem.name}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={selectedItem.description}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Quantity in Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantityInStock"
                    value={selectedItem.quantityInStock}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        quantityInStock: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Minimum Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="minimumStockLevel"
                    value={selectedItem.minimumStockLevel}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        minimumStockLevel: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    step="0.01"
                    value={selectedItem.price}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add Product</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Quantity in Stock</label>
        <input
          type="number"
          className="form-control"
          name="quantityInStock"
          value={newProduct.quantityInStock}
          onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Minimum Stock</label>
        <input
          type="number"
          className="form-control"
          name="minimumStockLevel"
          value={newProduct.minimumStockLevel}
          onChange={(e) => setNewProduct({ ...newProduct, minimumStockLevel: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price ($)</label>
        <input
          type="number"
          className="form-control"
          name="price"
          step="0.01"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
      </div>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseAddModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleAddProduct}>
      Add Product
    </Button>
  </Modal.Footer>
</Modal>

      </div>
    </Layout>
  );
};

export default Dashboard;
