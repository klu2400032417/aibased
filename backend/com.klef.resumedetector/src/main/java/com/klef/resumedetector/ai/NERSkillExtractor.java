package com.klef.resumedetector.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class NERSkillExtractor {

    // master skill dictionary — add more as needed
    private static final List<String> SKILL_DICTIONARY = Arrays.asList(
        // Programming Languages
        "Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#",
        "Kotlin", "Swift", "Go", "Rust", "PHP", "Ruby", "Scala", "R",

        // Frontend
        "React", "Angular", "Vue", "HTML", "CSS", "Bootstrap", "Tailwind",
        "Redux", "Next.js", "jQuery",

        // Backend Frameworks
        "Spring Boot", "Spring", "Django", "Flask", "FastAPI", "Node.js",
        "Express", "Hibernate", "JPA",

        // Databases
        "MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis", "SQLite",
        "Cassandra", "Firebase",

        // Cloud & DevOps
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins",
        "Git", "GitHub", "GitLab", "CI/CD", "Linux", "Maven", "Gradle",

        // AI / ML
        "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch",
        "Scikit-learn", "Pandas", "NumPy", "Computer Vision", "OpenCV",
        "Keras", "Hugging Face", "LangChain",

        // Tools & Others
        "REST API", "GraphQL", "Microservices", "Agile", "Scrum",
        "Postman", "Swagger", "JIRA", "Kafka", "RabbitMQ",
        
     // Add these to your existing list
        "Hibernate", "OOP", "Postman", "REST API",
        "Data Structures", "Machine Learning",
        "Linux", "Git"
    );

    // extract skills from resume text — case-insensitive match
    public List<String> extractSkills(String parsedText) {
        if (parsedText == null || parsedText.isEmpty()) return new ArrayList<>();

        List<String> matchedSkills = new ArrayList<>();
        String lowerText = parsedText.toLowerCase();

        for (String skill : SKILL_DICTIONARY) {
            String lowerSkill = skill.toLowerCase();
            // simple contains check instead of word boundary regex
            if (lowerText.contains(lowerSkill)) {
                matchedSkills.add(skill);
            }
        }

        return matchedSkills;
    }

    // return skills as JSON string for DB storage
    public String extractSkillsAsJson(String parsedText) {
        List<String> skills = extractSkills(parsedText);
        try {
            return new ObjectMapper().writeValueAsString(skills);
        } catch (Exception e) {
            return "[]";
        }
    }
}