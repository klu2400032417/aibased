package com.klef.resumedetector.repository;

import com.klef.resumedetector.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    // ranked leaderboard for a job role
    List<Score> findByJobRoleIdOrderByFitScoreDesc(Long jobRoleId);

    // all scores for a specific resume
    List<Score> findByResumeId(Long resumeId);

    // specific resume score for a specific job
    Optional<Score> findByResumeIdAndJobRoleId(Long resumeId, Long jobRoleId);

    // check if resume already scored for a job
    boolean existsByResumeIdAndJobRoleId(Long resumeId, Long jobRoleId);

    // top N candidates for a job role
    @Query("SELECT s FROM Score s WHERE s.jobRole.id = :jobRoleId " +
           "ORDER BY s.fitScore DESC LIMIT :topN")
    List<Score> findTopCandidatesForJob(@Param("jobRoleId") Long jobRoleId,
                                        @Param("topN") int topN);

    // average fit score for a job role
    @Query("SELECT AVG(s.fitScore) FROM Score s WHERE s.jobRole.id = :jobRoleId")
    Double findAverageFitScoreByJobRole(@Param("jobRoleId") Long jobRoleId);

    // best score of a resume across all jobs
    @Query("SELECT MAX(s.fitScore) FROM Score s WHERE s.resume.id = :resumeId")
    Double findBestScoreByResumeId(@Param("resumeId") Long resumeId);

    // cleanup when resume is deleted
    void deleteByResumeId(Long resumeId);

    // cleanup when job role is closed/deleted
    void deleteByJobRoleId(Long jobRoleId);
}