import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from "./BtnPrimary";
import DropdownMenu from "./DropdownMenu";
// import TaskModal from "./TaskModal";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown";
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";

function Task(props) {
  const {
    projectId,
    userId,
    isUserModalOpen,
    setUserModalOpen,
    isUserAddOpen,
    setUserAddOpen,
  } = props;
  console.log("props", props);

  const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
  const [columns, setColumns] = useState({});
  const [isRenderChange, setRenderChange] = useState(false);
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [taskId, setTaskId] = useState(false);
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState(null); // State to store users details
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [keyForActiveTab, setKeyForActiveTab] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAddOpen) return;
    setSelectedUser(null);
  }, [isUserAddOpen]);

  useEffect(() => {
    if (projectId) {
      setKeyForActiveTab("task");
    }
  }, [projectId]);

  useEffect(() => {
    if (userId) {
      setKeyForActiveTab("user");
    }
  }, [userId]);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    let data = {};
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      data = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
      data = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
    }

    updateTodo(data);
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:6001/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load users");
      });
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:6001/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then(() => {
        toast.success("User deleted");
        fetchUsers();
      })
      .catch(() => {
        toast.error("Delete failed");
      });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (isUserAddOpen) {
      // Call POST API to add a new user
      axios
        .post("http://localhost:6001/api/users/register", selectedUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => {
          toast.success("User added successfully");
          setUserModalOpen(false);
          fetchUsers(); // Refresh the user list
        })
        .catch(() => {
          toast.error("Failed to add user");
        });
    } else {
      // Call PUT API to update an existing user
      axios
        .put(
          `http://localhost:6001/api/users/${selectedUser._id}`,
          selectedUser,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        )
        .then(() => {
          toast.success("User updated successfully");
          setUserModalOpen(false);
          fetchUsers(); // Refresh the user list
        })
        .catch(() => {
          toast.error("Failed to update user");
        });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isAddTaskModalOpen || isRenderChange) {
      if (!projectId) return;
      axios
        .get(`http://localhost:9000/project/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          const project = res.data.data;
          setTitle(project.title);
          setColumns({
            [uuid()]: {
              name: "Requested",
              items: project.task
                .filter((task) => task.stage === "Requested")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "To do",
              items: project.task
                .filter((task) => task.stage === "To do")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "In Progress",
              items: project.task
                .filter((task) => task.stage === "In Progress")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "Done",
              items: project.task
                .filter((task) => task.stage === "Done")
                .sort((a, b) => a.order - b.order),
            },
          });
          setRenderChange(false);
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    }
  }, [projectId, isAddTaskModalOpen, isRenderChange]);

  const updateTodo = (data) => {
    axios
      .put(`http://localhost:9000/project/${projectId}/todo`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {})
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const handleDelete = (e, taskId) => {
    e.stopPropagation();
    axios
      .delete(`http://localhost:9000/project/${projectId}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        toast.success("Task is deleted");
        setRenderChange(true);
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const handleTaskDetails = (id) => {
    setTaskId({ projectId, id });
    setTaskOpen(true);
  };

  return (
    <>
      <div className="px-12 py-6 w-full">
        {keyForActiveTab == "task" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl text-gray-800 flex justify-start items-center space-x-2.5">
                <span>
                  {title.slice(0, 25)}
                  {title.length > 25 && "..."}
                </span>
                <ProjectDropdown id={projectId} navigate={navigate} />
              </h1>
              <BtnPrimary onClick={() => setAddTaskModal(true)}>
                Add todo
              </BtnPrimary>
            </div>
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              <div className="flex gap-5 mb-4">
                {Object.entries(columns).map(([columnId, column], index) => {
                  return (
                    <div className="w-3/12 h-[580px]" key={columnId}>
                      <div className="pb-2.5 w-full flex justify-between">
                        <div className="inline-flex items-center space-x-2">
                          <h2 className=" text-[#1e293b] font-medium text-sm uppercase leading-3">
                            {column.name}
                          </h2>
                          <span
                            className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold text-gray-500 border border-gray-300 ${
                              column.items.length < 1 && "invisible"
                            }`}
                          >
                            {column.items?.length}
                          </span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          width={15}
                          className="text-[#9ba8bc]"
                          viewBox="0 0 448 512"
                        >
                          <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                        </svg>
                      </div>
                      <div>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 ${
                                  snapshot.isDraggingOver && "border-indigo-600"
                                }`}
                              >
                                {column.items.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item._id}
                                      draggableId={item._id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              ...provided.draggableProps.style,
                                            }}
                                            onClick={() =>
                                              handleTaskDetails(item._id)
                                            }
                                            className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 rounded-lg shadow-sm bg-white relative ${
                                              snapshot.isDragging && "shadow-md"
                                            }`}
                                          >
                                            <div className="pb-2">
                                              <div className="flex item-center justify-between">
                                                <h3 className="text-[#1e293b] font-medium text-sm capitalize">
                                                  {item.title.slice(0, 22)}
                                                  {item.title.length > 22 &&
                                                    "..."}
                                                </h3>
                                                <DropdownMenu
                                                  taskId={item._id}
                                                  handleDelete={handleDelete}
                                                  projectId={projectId}
                                                  setRenderChange={
                                                    setRenderChange
                                                  }
                                                />
                                              </div>
                                              <p className="text-xs text-slate-500 leading-4 -tracking-tight">
                                                {item.description.slice(0, 60)}
                                                {item.description.length > 60 &&
                                                  "..."}
                                              </p>
                                              <span className="py-1 px-2.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium mt-1 inline-block">
                                                Task-{item.index}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </>
        ) : (
          <>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Users
              </h2>
              <ul className="space-y-4">
                {users &&
                  users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between bg-gray-100 p-4 rounded shadow border-2 border-indigo-500"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          Role: {user.role || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Active: {user.isActive ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="text-indigo-600 hover:underline text-sm"
                          onClick={() => {
                            handleEditUser(user);
                            setUserAddOpen(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
        {/* User Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 border-2 border-indigo-500">
              <h2 className="text-lg font-semibold mb-4">
                {`${isUserAddOpen}` ? "Add User" : "Edit User"}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedUser?.name || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-2 border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-2 border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={selectedUser?.role || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-2 border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {isUserAddOpen && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    // value={selectedUser.password || ""}
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-2 border-indigo-500"
                  ></input>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={handleSaveUser}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <AddTaskModal
          isAddTaskModalOpen={isAddTaskModalOpen}
          setAddTaskModal={setAddTaskModal}
          projectId={projectId}
        />
        <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
      </div>
    </>
  );
}

export default Task;
