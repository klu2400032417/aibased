package com.klef.resumedetector.service;

import com.klef.resumedetector.dto.ScoreResponseDto;
import com.klef.resumedetector.dto.CandidateRankDto;

import java.util.List;

public interface ScoringService {

    // score a single resume against a job role
    ScoreResponseDto scoreResume(Long resumeId, Long jobRoleId);

    // score all resumes against a job role (bulk)
    List<ScoreResponseDto> scoreAllResumesForJob(Long jobRoleId);

    // get ranked leaderboard for a job role
    List<CandidateRankDto> getRankedCandidates(Long jobRoleId);

    // get top N candidates for a job role
    List<CandidateRankDto> getTopNCandidates(Long jobRoleId, int topN);
}