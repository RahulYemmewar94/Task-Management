export const authorizedRoutes = {
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  GET_ALL_USERS: "get_all_users",
  GET_USER: "get_user",
  ASSIGN_ROLE: "assign_role",
};

const permissions = [
  {
    name: "admin",
    permissions: [
      authorizedRoutes.CREATE_USER,
      authorizedRoutes.UPDATE_USER,
      authorizedRoutes.DELETE_USER,
      authorizedRoutes.GET_ALL_USERS,
      authorizedRoutes.GET_USER,
      authorizedRoutes.ASSIGN_ROLE,
    ],
  },
  {
    name: "user",
    permissions: [
      authorizedRoutes.CREATE_USER,
      authorizedRoutes.UPDATE_USER,
      authorizedRoutes.GET_USER,
    ],
  },
];

export default permissions;
