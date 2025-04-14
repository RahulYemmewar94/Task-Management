import AppLayout from "./components/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";
import Login from "./Login/index";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddProject from "./components/addProject";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  console.log("render app..");

  return (
    <AppLayout>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/:projectId"
          element={
            <ProtectedRoute>
              <Task />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/addproject"}
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
