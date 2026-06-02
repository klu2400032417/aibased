import axiosInstance from './axiosInstance'
export const getAllJobsApi = () => axiosInstance.get('/api/jobs')
export const createJobApi = (data, userId) => axiosInstance.post(`/api/jobs?createdBy=${userId}`, data)
export const updateJobApi = (id, data) => axiosInstance.put(`/api/jobs/${id}`, data)
export const deleteJobApi = (id, userId, role) =>
  axiosInstance.delete(`/api/jobs/${id}?userId=${userId}&role=${role}`)
export const searchJobsApi = (title) => axiosInstance.get(`/api/jobs/search?title=${title}`)