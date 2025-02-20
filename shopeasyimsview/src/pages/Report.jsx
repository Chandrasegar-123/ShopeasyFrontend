import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api.js";
import { Bar, Pie } from 'react-chartjs-2';
import Layout from "../components/Layout";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // For pie chart
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/product");
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Bar chart data (Name vs Quantity In Stock)
  const barChartData = {
    labels: items.map(item => item.name), // Product names
    datasets: [
      {
        label: 'Quantity In Stock',
        data: items.map(item => item.quantityInStock), // Product stock quantities
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color for the bar chart
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data (each product's stock quantity)
  const pieChartData = {
    labels: items.map(item => item.name), // Product names
    datasets: [
      {
        data: items.map(item => item.quantityInStock), // Product stock quantities
        backgroundColor: items.map(() => `hsl(${Math.random() * 360}, 100%, 70%)`), // Random color for each slice
        hoverBackgroundColor: items.map(() => `hsl(${Math.random() * 360}, 100%, 50%)`), // Hover color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Product Stock Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
    <div className="d-flex">

      <div style={{ width: "50%", margin: "auto", marginBottom: "40px" }}>
        <h3>Quantity in Stock (Bar Chart)</h3>
        <Bar data={barChartData} options={chartOptions} />
      </div>

      <div style={{ width: "30%", margin: "auto" }}>
        <h3>Stock Quantity per Product (Pie Chart)</h3>
        <Pie data={pieChartData} options={chartOptions} />
      </div>
    </div>
    </Layout>
  );
};

export default Report;
