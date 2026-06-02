import { useState, useEffect } from 'react'
import { getResumesByUserApi } from '../api/resumeApi'

export const useResumes = (userId) => {
  const [resumes, setResumes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!userId) return
    const fetchResumes = async () => {
      setLoading(true)
      try {
        const res = await getResumesByUserApi(userId)
        setResumes(res.data.data || [])
      } catch (e) {
        setError('Failed to load resumes')
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [userId])

  return { resumes, loading, error }
}