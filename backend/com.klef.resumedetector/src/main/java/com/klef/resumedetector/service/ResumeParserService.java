package com.klef.resumedetector.service;

import com.klef.resumedetector.entity.Resume;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ResumeParserService {

    // parse uploaded file and return populated Resume entity
    Resume parseResume(MultipartFile file, Long userId);

    // extract raw text from PDF or DOCX
    String extractText(MultipartFile file);

    // extract skills from parsed text and return as JSON string
    String extractSkillsAsJson(String parsedText);
    
 // add these 2 methods to ResumeParserService.java
    List<Resume> getResumesByUser(Long userId);
    void deleteResume(Long id);
}