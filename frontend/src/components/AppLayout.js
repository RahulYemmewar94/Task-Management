import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="bg-white">
      <div className="flex-1">
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
