import api from "./api";



export const listUsers = async (pageNumber = 1) => {
  const response = await api.get(`/auth/list_users?page=${pageNumber}`);
  return response.data;
};
