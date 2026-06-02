package com.klef.resumedetector.service;

import com.klef.resumedetector.entity.JobRole;
import com.klef.resumedetector.entity.JobRole.JobStatus;
import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.repository.JobRoleRepository;
import com.klef.resumedetector.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobRoleServiceImpl implements JobRoleService {

    @Autowired
    private JobRoleRepository jobRoleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public JobRole createJobRole(JobRole jobRole, Long createdByUserId) {
        User recruiter = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + createdByUserId));
        jobRole.setCreatedBy(recruiter);
        return jobRoleRepository.save(jobRole);
    }

    @Override
    public JobRole getJobRoleById(Long id) {
        return jobRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobRole not found: " + id));
    }

    @Override
    public List<JobRole> getAllActiveJobs() {
        return jobRoleRepository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE);
    }

    @Override
    public List<JobRole> getJobsByRecruiter(Long userId) {
        return jobRoleRepository.findByCreatedById(userId);
    }

    @Override
    public JobRole updateJobRole(Long id, JobRole updated) {
        JobRole existing = getJobRoleById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setRequiredSkills(updated.getRequiredSkills());
        existing.setExperienceRequired(updated.getExperienceRequired());
        existing.setLocation(updated.getLocation());
        existing.setStatus(updated.getStatus());
        return jobRoleRepository.save(existing);
    }

    @Override
    public void deleteJobRole(Long id) {
        if (!jobRoleRepository.existsById(id)) {
            throw new RuntimeException("JobRole not found: " + id);
        }
        jobRoleRepository.deleteById(id);
    }

    @Override
    public List<JobRole> searchByTitle(String title) {
        return jobRoleRepository.findByTitleContainingIgnoreCase(title);
    }
}