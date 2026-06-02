package com.klef.resumedetector.dto;

import lombok.Data;

@Data
public class ResumeUploadDto {

    private Long resumeId;
    private String fileName;
    private String fileType;
    private String candidateName;
    private String candidateEmail;
    private String skillsJson;
    private Integer yearsOfExperience;
    private String uploadedAt;
    private String message;
}