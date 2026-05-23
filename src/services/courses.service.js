import api from "./api";



export const listCourses = async (pageNumber = 1) => {
  const response = await api.get(`/training/courses?page=${pageNumber}`);
  return response.data;
};


export const getCourse = async (course_id) => {
  const response = await api.get(`/training/courses/${course_id}`);
  return response.data
}


export const createCourse = async (payload) => {
  const reponse = await api.post("/training/courses/" , payload);
  return response.data
}