package com.klef.resumedetector.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScoreResponseDto {

    private Long scoreId;
    private Long resumeId;
    private Long jobRoleId;
    private String jobTitle;
    private Double fitScore;        // 0.0 to 100.0
    private String skillMatchJson;  // matched vs missing skills
    private LocalDateTime scoredAt;
}