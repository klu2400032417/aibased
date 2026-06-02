package com.klef.resumedetector.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    // save file and return saved file path
    String storeFile(MultipartFile file);

    // delete file from disk
    void deleteFile(String filePath);

    // validate file type (only PDF and DOCX allowed)
    boolean isValidFileType(MultipartFile file);
}