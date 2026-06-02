package com.klef.resumedetector.service;

import com.klef.resumedetector.ai.NERSkillExtractor;
import com.klef.resumedetector.ai.TikaResumeParser;
import com.klef.resumedetector.entity.Resume;
import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.repository.ResumeRepository;
import com.klef.resumedetector.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeParserServiceImpl implements ResumeParserService {

    @Autowired
    private TikaResumeParser tikaResumeParser;

    @Autowired
    private NERSkillExtractor nerSkillExtractor;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public Resume parseResume(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // extract text FIRST before saving
        String parsedText = tikaResumeParser.extractText(file);
        String skillsJson = nerSkillExtractor.extractSkillsAsJson(parsedText);

        // then save file
        String savedPath = saveFileToDisk(file);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(file.getOriginalFilename());
        resume.setFilePath(savedPath);
        resume.setFileType(getFileExtension(file.getOriginalFilename()));
        resume.setParsedText(parsedText);
        resume.setSkillsJson(skillsJson);
        resume.setCandidateName(tikaResumeParser.extractCandidateName(parsedText));
        resume.setCandidateEmail(tikaResumeParser.extractEmail(parsedText));
        resume.setYearsOfExperience(tikaResumeParser.extractYearsOfExperience(parsedText));

        return resumeRepository.save(resume);
    }

    @Override
    public String extractText(MultipartFile file) {
        return tikaResumeParser.extractText(file);
    }

    @Override
    public String extractSkillsAsJson(String parsedText) {
        return nerSkillExtractor.extractSkillsAsJson(parsedText);
    }

    @Override
    public List<Resume> getResumesByUser(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    @Override
    public void deleteResume(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + id));
        fileStorageService.deleteFile(resume.getFilePath());
        resumeRepository.deleteById(id);
    }

 private String saveFileToDisk(MultipartFile file) {
    try {

        File dir = new File("/app/uploads/resumes");

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String uniqueName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        File destFile = new File(dir, uniqueName);

        Files.copy(
            file.getInputStream(),
            destFile.toPath(),
            StandardCopyOption.REPLACE_EXISTING
        );

        return destFile.getAbsolutePath();

    } catch (Exception e) {
        throw new RuntimeException("Failed to save file", e);
    }
}

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "UNKNOWN";
        return fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
    }
}
