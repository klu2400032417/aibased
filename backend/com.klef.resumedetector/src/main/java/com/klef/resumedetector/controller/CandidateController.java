package com.klef.resumedetector.controller;

import com.klef.resumedetector.dto.ApiResponseDto;
import com.klef.resumedetector.dto.CandidateRankDto;
import com.klef.resumedetector.dto.ScoreResponseDto;
import com.klef.resumedetector.entity.Resume;
import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.service.CandidateService;
import com.klef.resumedetector.service.ScoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidates", description = "Candidate management and ranking APIs")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private ScoringService scoringService;

    // GET /api/candidates
    @GetMapping
    @Operation(summary = "Get all candidates")
    public ResponseEntity<ApiResponseDto<List<User>>> getAllCandidates() {
        List<User> candidates = candidateService.getAllCandidates();
        return ResponseEntity.ok(
                ApiResponseDto.success("Candidates fetched", candidates));
    }

    // GET /api/candidates/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Get candidate by ID")
    public ResponseEntity<ApiResponseDto<User>> getCandidateById(
            @PathVariable Long id) {
        User candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(
                ApiResponseDto.success("Candidate fetched", candidate));
    }

    // GET /api/candidates/{id}/resumes
    @GetMapping("/{id}/resumes")
    @Operation(summary = "Get all resumes of a candidate")
    public ResponseEntity<ApiResponseDto<List<Resume>>> getCandidateResumes(
            @PathVariable Long id) {
        List<Resume> resumes = candidateService.getResumesByCandidate(id);
        return ResponseEntity.ok(
                ApiResponseDto.success("Candidate resumes fetched", resumes));
    }

    // POST /api/candidates/score?resumeId=1&jobRoleId=2
    @PostMapping("/score")
    @Operation(summary = "Score a resume against a job role")
    public ResponseEntity<ApiResponseDto<ScoreResponseDto>> scoreResume(
            @RequestParam Long resumeId,
            @RequestParam Long jobRoleId) {
        ScoreResponseDto score = scoringService.scoreResume(resumeId, jobRoleId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Resume scored successfully", score));
    }

    // POST /api/candidates/score/bulk?jobRoleId=2
    @PostMapping("/score/bulk")
    @Operation(summary = "Score all resumes against a job role")
    public ResponseEntity<ApiResponseDto<List<ScoreResponseDto>>> scoreAllResumes(
            @RequestParam Long jobRoleId) {
        List<ScoreResponseDto> scores = scoringService.scoreAllResumesForJob(jobRoleId);
        return ResponseEntity.ok(
                ApiResponseDto.success("All resumes scored successfully", scores));
    }

    // GET /api/candidates/ranked?jobRoleId=2
    @GetMapping("/ranked")
    @Operation(summary = "Get ranked candidates for a job role")
    public ResponseEntity<ApiResponseDto<List<CandidateRankDto>>> getRankedCandidates(
            @RequestParam Long jobRoleId) {
        List<CandidateRankDto> ranked = scoringService.getRankedCandidates(jobRoleId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Ranked candidates fetched", ranked));
    }

    // GET /api/candidates/top?jobRoleId=2&topN=5
    @GetMapping("/top")
    @Operation(summary = "Get top N candidates for a job role")
    public ResponseEntity<ApiResponseDto<List<CandidateRankDto>>> getTopCandidates(
            @RequestParam Long jobRoleId,
            @RequestParam(defaultValue = "5") int topN) {
        List<CandidateRankDto> top = scoringService.getTopNCandidates(jobRoleId, topN);
        return ResponseEntity.ok(
                ApiResponseDto.success("Top candidates fetched", top));
    }

    // DELETE /api/candidates/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a candidate")
    public ResponseEntity<ApiResponseDto<String>> deleteCandidate(
            @PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok(
                ApiResponseDto.success("Candidate deleted successfully", null));
    }
}