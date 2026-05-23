import api from "./api";



export const listSalles = async (pageNumber = 1) => {
  const response = await api.get(`/training/salles?page=${pageNumber}`);
  return response.data;
};
