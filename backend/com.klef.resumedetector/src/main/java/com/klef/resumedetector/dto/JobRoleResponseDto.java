package com.klef.resumedetector.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobRoleResponseDto {

    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private Integer experienceRequired;
    private String location;
    private String status;
    private String createdByName;
    private LocalDateTime createdAt;
    private Long totalApplicants;    // how many resumes scored for this job
}