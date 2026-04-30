import api from "./api";



export const listCourses = async (pageNumber = 1) => {
  const response = await api.get(`/training/courses?page=${pageNumber}`);
  return response.data;
};