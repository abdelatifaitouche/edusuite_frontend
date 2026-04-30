import api from "./api";



export const listTrainers = async (pageNumber = 1) => {
  const response = await api.get(`/training/trainers?page=${pageNumber}`);
  return response.data;
};


export async function createTrainer(payload) {
    return await api.post("/training/trainer/" , payload)
}