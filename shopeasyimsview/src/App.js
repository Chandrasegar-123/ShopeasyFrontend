import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserTable from "./pages/UserTable";
import UserDashboard from "./pages/UserDashboard";
import Report from "./pages/Report";
import ProtectedRoute from "./ProtectedRoute"; // Import the protected route component
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/users" 
          element={<ProtectedRoute><UserTable /></ProtectedRoute>} 
        />
        <Route 
          path="/user-dashboard" 
          element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/report" 
          element={<ProtectedRoute><Report /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
