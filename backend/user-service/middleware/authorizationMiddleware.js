import permissions from "./rolePermissions.js";

export const authorize = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Access Denied: No role provided" });
      }

      const rolePermissions = permissions.find(
        (role) => role.name === userRole
      );

      if (!rolePermissions) {
        return res.status(403).json({ message: "Access Denied: Invalid role" });
      }

      if (!rolePermissions.permissions.includes(requiredPermission)) {
        return res
          .status(403)
          .json({ message: "Access Denied: Insufficient permissions" });
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };
};
