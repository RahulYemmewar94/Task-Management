import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserById,
  logoutUser,
} from "../controllers/userController.js";
import jwtAuthMiddleware from "../middleware/jwtmiddleware.js";
import { authorize } from "../middleware/authorizationMiddleware.js";
import { authorizedRoutes } from "../middleware/rolePermissions.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get(
  "/",
  jwtAuthMiddleware,
  authorize(authorizedRoutes.GET_ALL_USERS),
  getAllUsers
);
router.get(
  "/:id",
  jwtAuthMiddleware,
  authorize(authorizedRoutes.GET_ALL_USERS),
  getUserById
);

router.delete(
  "/:id",
  jwtAuthMiddleware,
  authorize(authorizedRoutes.DELETE_USER),
  deleteUser
);
router.put(
  "/:id",
  jwtAuthMiddleware,
  authorize(authorizedRoutes.UPDATE_USER),
  updateUserById
);

export default router;
