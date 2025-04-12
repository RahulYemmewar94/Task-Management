import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Task from "./Task";

const AddProject = () => {
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isUserAddOpen, setUserAddOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <div
        className=" w-screen flex container mx-auto"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <div className="w-[220px]">
          <Sidebar
            setProjectId={setProjectId}
            setUserId={setUserId}
            setUserModalOpen={setUserModalOpen}
            setUserAddOpen={setUserAddOpen}
          />
        </div>
        <Task
          projectId={projectId}
          userId={userId}
          setUserModalOpen={setUserModalOpen}
          setUserAddOpen={setUserAddOpen}
          isUserModalOpen={isUserModalOpen}
          isUserAddOpen={isUserAddOpen}
        />
      </div>
    </div>
  );
};

export default AddProject;
