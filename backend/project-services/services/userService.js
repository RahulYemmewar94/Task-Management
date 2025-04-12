import axios from "axios";

export const fetchUserById = async (userId, token) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const headers = { Authorization: token };
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/${userId}`,
      { headers }
    );

    return response.data; // Extract user data
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error("Failed to retrieve user details");
  }
};
