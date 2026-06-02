package com.klef.resumedetector.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill_name", nullable = false, unique = true, length = 100)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private SkillCategory category;

    @Column(name = "aliases", length = 255)
    private String aliases;

    public enum SkillCategory {
        PROGRAMMING_LANGUAGE,
        FRAMEWORK,
        DATABASE,
        CLOUD,
        DEVOPS,
        AI_ML,
        SOFT_SKILL,
        OTHER
    }
}