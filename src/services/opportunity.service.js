import api from "./api";


export const listOpportunities = async (p) => await api.get("/crm/opportunity")



export const getOpportunity    = async (id)      => await api.get(`/crm/opportunity/${id}`)
export const transitionNext    = async (id)      => await api.post(`/crm/opportunity/${id}/transition/next/`, { method: "POST" })
export const markAsWon         = async (id)      => await api.patch(`/crm/opportunity/${id}/win/`,             { method: "PATCH" })
export const createOpportunity = async (payload) =>
  await api.post(`/crm/opportunity/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })


export const createSessionPlan = async (id, payload) =>
  await api.post(`/crm/opportunity/${id}/session_plan/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })