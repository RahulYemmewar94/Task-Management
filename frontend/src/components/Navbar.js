import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Call the logout API
      await axios.post(
        "http://localhost:6001/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear local storage
      localStorage.clear();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="w-full bg-white shadow h-14 flex items-center justify-between px-4">
      <div className="text-lg font-bold">Task Manager</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
