package com.edunova.service;

import com.edunova.domain.EducationLevel;
import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.SocialCategory;
import com.edunova.domain.UserRole;
import com.edunova.domain.UserStatus;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.StudentProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.AuthDtos.*;
import com.edunova.repository.MentorProfileRepository;
import com.edunova.repository.StudentProfileRepository;
import com.edunova.repository.UserAccountRepository;
import com.edunova.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        UserAccount user = UserAccount.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        EducationLevel eduLevel = null;
        if (request.getEducationLevel() != null) {
            try {
                eduLevel = EducationLevel.valueOf(request.getEducationLevel());
            } catch (Exception ignored) {}
        }
        SocialCategory socCategory = null;
        if (request.getSocialCategory() != null) {
            try {
                socCategory = SocialCategory.valueOf(request.getSocialCategory());
            } catch (Exception ignored) {}
        }

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .gender(request.getGender())
                .state(request.getState() != null ? request.getState() : "Tamil Nadu")
                .educationLevel(eduLevel != null ? eduLevel : EducationLevel.UNDERGRADUATE)
                .socialCategory(socCategory != null ? socCategory : SocialCategory.BC)
                .isGovtSchoolStudent(Boolean.TRUE.equals(request.getIsGovtSchoolStudent()))
                .isFirstGraduate(Boolean.TRUE.equals(request.getIsFirstGraduate()))
                .marksPercentage(request.getMarksPercentage())
                .familyAnnualIncome(request.getFamilyAnnualIncome())
                .institutionName(request.getInstitutionName())
                .build();

        studentProfileRepository.save(profile);

        String token = tokenProvider.generateTokenFromUser(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    @Transactional
    public AuthResponse registerMentor(MentorRegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        UserAccount user = UserAccount.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.MENTOR)
                .status(UserStatus.PENDING) // Pending admin review
                .build();

        user = userRepository.save(user);

        MentorProfile profile = new MentorProfile();
        profile.setUser(user);
        profile.setTitleRole(request.getTitleRole());
        profile.setCompanyOrInstitution(request.getCompanyOrInstitution());
        profile.setQualification(request.getQualification());
        profile.setYearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 3);
        profile.setBio(request.getBio());
        profile.setSpecialization(request.getSpecialization());
        profile.setHourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : BigDecimal.ZERO);
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setVerificationStatus(MentorVerificationStatus.PENDING);

        if (request.getLanguagesSpoken() != null) {
            profile.setLanguagesSpoken(new HashSet<>(request.getLanguagesSpoken()));
        }
        if (request.getExpertiseTags() != null) {
            profile.setExpertiseTags(new HashSet<>(request.getExpertiseTags()));
        }

        mentorProfileRepository.save(profile);

        String token = tokenProvider.generateTokenFromUser(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .avatarUrl(profile.getAvatarUrl())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserAccount user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String avatar = null;
        if (user.getRole() == UserRole.MENTOR) {
            avatar = mentorProfileRepository.findByUserId(user.getId())
                    .map(MentorProfile::getAvatarUrl)
                    .orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .avatarUrl(avatar)
                .build();
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(UUID userId) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String avatar = null;
        if (user.getRole() == UserRole.MENTOR) {
            avatar = mentorProfileRepository.findByUserId(user.getId())
                    .map(MentorProfile::getAvatarUrl)
                    .orElse(null);
        }

        return UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .avatarUrl(avatar)
                .build();
    }
}
