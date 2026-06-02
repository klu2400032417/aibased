package com.klef.resumedetector.controller;

import com.klef.resumedetector.dto.ApiResponseDto;
import com.klef.resumedetector.entity.JobRole;
import com.klef.resumedetector.service.JobRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job Roles", description = "Job role management APIs")
public class JobRoleController {

    @Autowired
    private JobRoleService jobRoleService;

    // POST /api/jobs?createdBy=1
    @PostMapping
    @Operation(summary = "Create a new job role")
    public ResponseEntity<ApiResponseDto<JobRole>> createJobRole(
            @RequestBody JobRole jobRole,
            @RequestParam("createdBy") Long createdByUserId) {
        JobRole created = jobRoleService.createJobRole(jobRole, createdByUserId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Job role created successfully", created));
    }

    // GET /api/jobs
    @GetMapping
    @Operation(summary = "Get all active job roles")
    public ResponseEntity<ApiResponseDto<List<JobRole>>> getAllActiveJobs() {
        List<JobRole> jobs = jobRoleService.getAllActiveJobs();
        return ResponseEntity.ok(
                ApiResponseDto.success("Active jobs fetched", jobs));
    }

    // GET /api/jobs/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Get job role by ID")
    public ResponseEntity<ApiResponseDto<JobRole>> getJobRoleById(
            @PathVariable Long id) {
        JobRole job = jobRoleService.getJobRoleById(id);
        return ResponseEntity.ok(
                ApiResponseDto.success("Job role fetched", job));
    }

    // GET /api/jobs/recruiter/{userId}
    @GetMapping("/recruiter/{userId}")
    @Operation(summary = "Get all job roles created by a recruiter")
    public ResponseEntity<ApiResponseDto<List<JobRole>>> getJobsByRecruiter(
            @PathVariable Long userId) {
        List<JobRole> jobs = jobRoleService.getJobsByRecruiter(userId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Recruiter jobs fetched", jobs));
    }

    // GET /api/jobs/search?title=Java
    @GetMapping("/search")
    @Operation(summary = "Search job roles by title")
    public ResponseEntity<ApiResponseDto<List<JobRole>>> searchJobs(
            @RequestParam("title") String title) {
        List<JobRole> jobs = jobRoleService.searchByTitle(title);
        return ResponseEntity.ok(
                ApiResponseDto.success("Search results fetched", jobs));
    }

    // PUT /api/jobs/{id}
    @PutMapping("/{id}")
    @Operation(summary = "Update a job role")
    public ResponseEntity<ApiResponseDto<JobRole>> updateJobRole(
            @PathVariable Long id,
            @RequestBody JobRole jobRole) {
        JobRole updated = jobRoleService.updateJobRole(id, jobRole);
        return ResponseEntity.ok(
                ApiResponseDto.success("Job role updated successfully", updated));
    }

    // DELETE /api/jobs/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job role")
    public ResponseEntity<ApiResponseDto<String>> deleteJobRole(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String role) {

        JobRole job = jobRoleService.getJobRoleById(id);

        // ADMIN can delete any job
        // RECRUITER can only delete their own job
        if (role.equals("RECRUITER") &&
            !job.getCreatedBy().getId().equals(userId)) {
            return ResponseEntity.status(403).body(
                ApiResponseDto.failure("You can only delete your own job roles"));
        }

        jobRoleService.deleteJobRole(id);
        return ResponseEntity.ok(
            ApiResponseDto.success("Job role deleted successfully", null));
    }
}