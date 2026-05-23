import api from "./api";

export const list_occurrences = async (params) => {
  const response = await api.get("/training/occurrences", { params });
  return response.data;
};

export const get_session_details = async (id) => {
  const response = await api.get(`/training/sessions/${id}`);
  return response.data;
};

// OPTIONS
export const get_formations_options = async () => {
  const res = await api.get("/training/courses/form/options");
  return res.data;
};

export const get_formateurs_options = async () => {
  const res = await api.get("/training/trainers/form/options");
  return res.data;
};

export const get_salles_options = async () => {
  const res = await api.get("/training/salles/form/options");
  return res.data;
};

// CREATE
export const create_session = async (payload) => {
  const res = await api.post("/training/sessions/", payload);
  return res.data;
};