import axiosInstance from './axiosInstance'

export const uploadResumeApi = (file, userId) => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance.post(`/api/resume/upload?userId=${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const getResumesByUserApi = (userId) => axiosInstance.get(`/api/resume/user/${userId}`)
export const deleteResumeApi = (id) => axiosInstance.delete(`/api/resume/${id}`)