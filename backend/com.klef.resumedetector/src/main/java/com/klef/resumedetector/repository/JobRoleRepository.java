package com.klef.resumedetector.repository;

import com.klef.resumedetector.entity.JobRole;
import com.klef.resumedetector.entity.JobRole.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {

    // get all active jobs
    List<JobRole> findByStatus(JobStatus status);

    // get all jobs created by a specific recruiter
    List<JobRole> findByCreatedById(Long userId);

    // search jobs by title (case-insensitive)
    List<JobRole> findByTitleContainingIgnoreCase(String title);

    // get active jobs ordered by newest first
    List<JobRole> findByStatusOrderByCreatedAtDesc(JobStatus status);

    // get jobs that require experience <= given years
    @Query("SELECT j FROM JobRole j WHERE j.experienceRequired <= :years AND j.status = 'ACTIVE'")
    List<JobRole> findJobsByMaxExperience(@Param("years") Integer years);

    // count active jobs
    long countByStatus(JobStatus status);
}