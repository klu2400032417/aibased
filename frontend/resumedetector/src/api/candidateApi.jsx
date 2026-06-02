import axiosInstance from './axiosInstance'
export const getAllCandidatesApi = () => axiosInstance.get('/api/candidates')
export const scoreResumeApi = (resumeId, jobRoleId) => axiosInstance.post(`/api/candidates/score?resumeId=${resumeId}&jobRoleId=${jobRoleId}`)
export const scoreAllResumesApi = (jobRoleId) => axiosInstance.post(`/api/candidates/score/bulk?jobRoleId=${jobRoleId}`)
export const getRankedCandidatesApi = (jobRoleId) => axiosInstance.get(`/api/candidates/ranked?jobRoleId=${jobRoleId}`)
export const getTopCandidatesApi = (jobRoleId, topN = 5) => axiosInstance.get(`/api/candidates/top?jobRoleId=${jobRoleId}&topN=${topN}`)