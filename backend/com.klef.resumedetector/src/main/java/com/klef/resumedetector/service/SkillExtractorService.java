package com.klef.resumedetector.service;

import java.util.List;

public interface SkillExtractorService {

    // extract skills list from raw text
    List<String> extractSkills(String text);

    // return skills as JSON string for DB storage
    String extractSkillsAsJson(String text);
}