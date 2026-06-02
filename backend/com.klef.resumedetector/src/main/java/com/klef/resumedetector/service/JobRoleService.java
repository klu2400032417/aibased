package com.klef.resumedetector.service;

import com.klef.resumedetector.entity.JobRole;
import com.klef.resumedetector.entity.JobRole.JobStatus;

import java.util.List;

public interface JobRoleService {

    JobRole createJobRole(JobRole jobRole, Long createdByUserId);

    JobRole getJobRoleById(Long id);

    List<JobRole> getAllActiveJobs();

    List<JobRole> getJobsByRecruiter(Long userId);

    JobRole updateJobRole(Long id, JobRole updated);

    void deleteJobRole(Long id);

    List<JobRole> searchByTitle(String title);
}