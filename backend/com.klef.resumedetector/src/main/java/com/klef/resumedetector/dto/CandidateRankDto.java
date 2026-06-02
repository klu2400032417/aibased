package com.klef.resumedetector.dto;

import lombok.Data;

@Data
public class CandidateRankDto {

    private Integer rank;
    private Long resumeId;
    private String candidateName;
    private String candidateEmail;
    private Double fitScore;
    private String skillMatchJson;
}