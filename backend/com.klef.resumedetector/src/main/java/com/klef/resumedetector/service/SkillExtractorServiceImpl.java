package com.klef.resumedetector.service;

import com.klef.resumedetector.ai.NERSkillExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillExtractorServiceImpl implements SkillExtractorService {

    @Autowired
    private NERSkillExtractor nerSkillExtractor;

    @Override
    public List<String> extractSkills(String text) {
        return nerSkillExtractor.extractSkills(text);
    }

    @Override
    public String extractSkillsAsJson(String text) {
        return nerSkillExtractor.extractSkillsAsJson(text);
    }
}