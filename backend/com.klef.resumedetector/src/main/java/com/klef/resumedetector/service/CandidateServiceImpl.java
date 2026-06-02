package com.klef.resumedetector.service;

import com.klef.resumedetector.entity.Resume;
import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.repository.ResumeRepository;
import com.klef.resumedetector.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateServiceImpl implements CandidateService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Override
    public List<User> getAllCandidates() {
        return userRepository.findByRole(User.Role.CANDIDATE);
    }

    @Override
    public User getCandidateById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + userId));
    }

    @Override
    public List<Resume> getResumesByCandidate(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    @Override
    public void deleteCandidate(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Candidate not found: " + userId);
        }
        userRepository.deleteById(userId);
    }
}