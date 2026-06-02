package com.klef.resumedetector.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CosineSimilarityScorer {

    @Autowired
    private TFIDFVectorizer tfidfVectorizer;

    @Autowired
    private NERSkillExtractor nerSkillExtractor;

    // calculate cosine similarity between resume text and job description
    // returns a score between 0.0 and 1.0
    public double calculate(String resumeText, String jobDescriptionText) {
        if (resumeText == null || jobDescriptionText == null) return 0.0;

        Map<String, Double> resumeVector    = tfidfVectorizer.vectorize(resumeText);
        Map<String, Double> jobVector       = tfidfVectorizer.vectorize(jobDescriptionText);

        return cosineSimilarity(resumeVector, jobVector);
    }

    // build skill match JSON: matched skills vs missing skills
    public String getSkillMatchJson(String resumeSkillsJson, String requiredSkillsCsv) {
        try {
            // parse resume skills from JSON
            List<String> resumeSkills = new ObjectMapper().readValue(
                    resumeSkillsJson,
                    new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});

            // parse required skills from comma-separated string
            List<String> requiredSkills = Arrays.asList(
                    requiredSkillsCsv.split(",\\s*"));

            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            for (String required : requiredSkills) {
                boolean found = resumeSkills.stream()
                        .anyMatch(s -> s.trim().equalsIgnoreCase(required.trim())); // exact match
                if (found) matched.add(required.trim());
                else       missing.add(required.trim());
            }
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("matched", matched);
            result.put("missing", missing);
            result.put("matchedCount", matched.size());
            result.put("totalRequired", requiredSkills.size());

            return new ObjectMapper().writeValueAsString(result);

        } catch (Exception e) {
            return "{\"matched\":[], \"missing\":[], \"matchedCount\":0, \"totalRequired\":0}";
        }
    }

    // ── core cosine similarity formula ─────────────────────────
    private double cosineSimilarity(Map<String, Double> vectorA,
                                    Map<String, Double> vectorB) {
        double dotProduct  = 0.0;
        double magnitudeA  = 0.0;
        double magnitudeB  = 0.0;

        // dot product — only iterate terms present in both vectors
        for (Map.Entry<String, Double> entry : vectorA.entrySet()) {
            if (vectorB.containsKey(entry.getKey())) {
                dotProduct += entry.getValue() * vectorB.get(entry.getKey());
            }
            magnitudeA += Math.pow(entry.getValue(), 2);
        }

        for (double val : vectorB.values()) {
            magnitudeB += Math.pow(val, 2);
        }

        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);

        // avoid division by zero
        if (magnitudeA == 0 || magnitudeB == 0) return 0.0;

        return dotProduct / (magnitudeA * magnitudeB);
    }
}