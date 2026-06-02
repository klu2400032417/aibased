package com.klef.resumedetector.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

	@Value("${file.upload-dir:C:/Users/ASUS/OneDrive/Desktop/airesumebuilder/uploads/resumes}")
	private String uploadDir;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    @Override
    public String storeFile(MultipartFile file) {
        if (!isValidFileType(file)) {
            throw new RuntimeException("Only PDF and DOCX files are allowed");
        }
        try {
            Path dirPath = Paths.get(uploadDir);
            Files.createDirectories(dirPath);
            String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(uniqueName);
            file.transferTo(filePath.toFile());
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("File storage failed: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String filePath) {
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
    }

    @Override
    public boolean isValidFileType(MultipartFile file) {
        return ALLOWED_TYPES.contains(file.getContentType());
    }
}