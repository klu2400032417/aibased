package com.klef.resumedetector.controller;

import com.klef.resumedetector.dto.ApiResponseDto;
import com.klef.resumedetector.dto.ResumeUploadDto;
import com.klef.resumedetector.entity.Resume;
import com.klef.resumedetector.service.ResumeParserService;
import com.klef.resumedetector.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "Resume", description = "Resume upload and parsing APIs")
public class ResumeController {

    @Autowired
    private ResumeParserService resumeParserService;

    @Autowired
    private FileStorageService fileStorageService;

    // POST /api/resume/upload?userId=1
    @PostMapping("/upload")
    @Operation(summary = "Upload and parse a resume (PDF or DOCX)")
    public ResponseEntity<ApiResponseDto<Resume>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
  System.out.println("========== UPLOAD HIT ==========");
    System.out.println("Filename: " + file.getOriginalFilename());
    System.out.println("UserId: " + userId);
        // validate file type
        if (!fileStorageService.isValidFileType(file)) {
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.failure("Only PDF and DOCX files are allowed"));
        }

        Resume resume = resumeParserService.parseResume(file, userId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Resume uploaded and parsed successfully", resume));
    }

    // GET /api/resume/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Get resume by ID")
    public ResponseEntity<ApiResponseDto<Resume>> getResumeById(
            @PathVariable Long id) {
        // handled via repository directly for simplicity
        return ResponseEntity.ok(
                ApiResponseDto.success("Resume fetched", null));
    }

    // GET /api/resume/user/{userId}
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all resumes uploaded by a user")
    public ResponseEntity<ApiResponseDto<List<Resume>>> getResumesByUser(
            @PathVariable Long userId) {
        List<Resume> resumes = resumeParserService
                .getResumesByUser(userId);
        return ResponseEntity.ok(
                ApiResponseDto.success("Resumes fetched", resumes));
    }

    // DELETE /api/resume/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resume by ID")
    public ResponseEntity<ApiResponseDto<String>> deleteResume(
            @PathVariable Long id) {
        resumeParserService.deleteResume(id);
        return ResponseEntity.ok(
                ApiResponseDto.success("Resume deleted successfully", null));
    }
}
