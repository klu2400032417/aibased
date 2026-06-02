package com.klef.resumedetector.repository;

import com.klef.resumedetector.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    // get all resumes uploaded by a specific user
    List<Resume> findByUserId(Long userId);

    // get all resumes for a user ordered by latest first
    List<Resume> findByUserIdOrderByUploadedAtDesc(Long userId);

    // check if user already uploaded a resume with same filename
    boolean existsByUserIdAndFileName(Long userId, String fileName);

    // search by candidate name
    List<Resume> findByCandidateNameContainingIgnoreCase(String candidateName);

    // get resumes not yet scored for a specific job role
    @Query("SELECT r FROM Resume r WHERE r.id NOT IN " +
           "(SELECT s.resume.id FROM Score s WHERE s.jobRole.id = :jobRoleId)")
    List<Resume> findUnScoredResumesForJob(@Param("jobRoleId") Long jobRoleId);

    // count resumes uploaded by a user
    long countByUserId(Long userId);
}