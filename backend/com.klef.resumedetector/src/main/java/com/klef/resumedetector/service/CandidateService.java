package com.klef.resumedetector.service;

import com.klef.resumedetector.entity.Resume;
import com.klef.resumedetector.entity.User;

import java.util.List;

public interface CandidateService {

    List<User> getAllCandidates();

    User getCandidateById(Long userId);

    List<Resume> getResumesByCandidate(Long userId);

    void deleteCandidate(Long userId);
}