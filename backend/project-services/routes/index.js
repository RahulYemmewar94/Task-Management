import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getProjectById,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  updateTodo,
} from "../controllers/index.js";

const api = express.Router();

api.get("/projects", getProjects);

// api.get("/project/:id", async (req, res) => {
//   if (!req.params.id)
//     res.status(422).send({ data: { error: true, message: "Id is reaquire" } });
//   try {
//     const data = await Project.find({
//       _id: mongoose.Types.ObjectId(req.params.id),
//     }).sort({ order: 1 });
//     return res.send(data);
//   } catch (error) {
//     return res.send(error);
//   }
// });

api.get("/project/:id", getProjectById);

api.post("/project", createProject);

api.put("/project/:id", updateProject);

api.delete("/project/:id", deleteProject);

// task api
api.post("/project/:id/task", createTask);

api.get("/project/:id/task/:taskId", getTaskById);

api.put("/project/:id/task/:taskId", updateTask);

api.delete("/project/:id/task/:taskId", deleteTask);

api.put("/project/:id/todo", updateTodo);

export default api;
