package com.klef.resumedetector.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "scores",
       uniqueConstraints = @UniqueConstraint(columnNames = {"resume_id", "job_role_id"}))
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @Column(name = "fit_score", nullable = false)
    private Double fitScore;

    @Column(name = "skill_match_json", columnDefinition = "TEXT")
    private String skillMatchJson;

    @Column(name = "matched_skills_count")
    private Integer matchedSkillsCount;

    @Column(name = "total_required_skills")
    private Integer totalRequiredSkills;

    @Column(name = "experience_match")
    private Boolean experienceMatch;

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Column(name = "scored_at", updatable = false)
    private LocalDateTime scoredAt;

    @PrePersist
    public void prePersist() {
        this.scoredAt = LocalDateTime.now();
    }
}