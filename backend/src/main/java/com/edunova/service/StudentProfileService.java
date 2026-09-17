package com.edunova.service;

import com.edunova.domain.entity.StudentProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.StudentProfileDtos.*;
import com.edunova.repository.StudentProfileRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserAccountRepository userRepository;

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(UUID userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserAccount user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    StudentProfile newProfile = StudentProfile.builder().user(user).build();
                    return studentProfileRepository.save(newProfile);
                });

        return mapToResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateProfile(UUID userId, StudentProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserAccount user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    return StudentProfile.builder().user(user).build();
                });

        profile.setAge(request.getAge());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setNativeState(request.getNativeState());
        profile.setEducationLevel(request.getEducationLevel());
        profile.setClassOrYear(request.getClassOrYear());
        profile.setCourseBranch(request.getCourseBranch());
        profile.setMarksPercentage(request.getMarksPercentage());
        profile.setFamilyAnnualIncome(request.getFamilyAnnualIncome());
        profile.setSocialCategory(request.getSocialCategory());
        profile.setCommunityCaste(request.getCommunityCaste());
        profile.setReligion(request.getReligion());
        profile.setIsPwd(request.getIsPwd() != null ? request.getIsPwd() : false);
        profile.setPwdPercentage(request.getPwdPercentage());
        profile.setIsGovtSchoolStudent(request.getIsGovtSchoolStudent() != null ? request.getIsGovtSchoolStudent() : false);
        profile.setIsFirstGraduate(request.getIsFirstGraduate() != null ? request.getIsFirstGraduate() : false);
        profile.setIsHosteller(request.getIsHosteller() != null ? request.getIsHosteller() : false);
        profile.setParentOccupation(request.getParentOccupation());
        profile.setInstitutionId(request.getInstitutionId());
        profile.setInstitutionName(request.getInstitutionName());
        profile.setInstitutionType(request.getInstitutionType());
        profile.setSportsAchievement(request.getSportsAchievement());

        if (request.getCareerInterests() != null) {
            profile.setCareerInterests(new HashSet<>(request.getCareerInterests()));
        }

        profile = studentProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    private StudentProfileResponse mapToResponse(StudentProfile p) {
        int completion = calculateCompletion(p);

        return StudentProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .phone(p.getUser().getPhone())
                .age(p.getAge())
                .dob(p.getDob())
                .gender(p.getGender())
                .state(p.getState())
                .district(p.getDistrict())
                .nativeState(p.getNativeState())
                .educationLevel(p.getEducationLevel())
                .classOrYear(p.getClassOrYear())
                .courseBranch(p.getCourseBranch())
                .marksPercentage(p.getMarksPercentage())
                .familyAnnualIncome(p.getFamilyAnnualIncome())
                .socialCategory(p.getSocialCategory())
                .communityCaste(p.getCommunityCaste())
                .religion(p.getReligion())
                .isPwd(p.getIsPwd())
                .pwdPercentage(p.getPwdPercentage())
                .isGovtSchoolStudent(p.getIsGovtSchoolStudent())
                .isFirstGraduate(p.getIsFirstGraduate())
                .isHosteller(p.getIsHosteller())
                .parentOccupation(p.getParentOccupation())
                .institutionId(p.getInstitutionId())
                .institutionName(p.getInstitutionName())
                .institutionType(p.getInstitutionType())
                .sportsAchievement(p.getSportsAchievement())
                .careerInterests(new ArrayList<>(p.getCareerInterests()))
                .profileCompletionPercentage(completion)
                .build();
    }

    private int calculateCompletion(StudentProfile p) {
        int score = 20; // user exists
        if (p.getState() != null) score += 10;
        if (p.getEducationLevel() != null) score += 15;
        if (p.getCourseBranch() != null) score += 15;
        if (p.getMarksPercentage() != null) score += 10;
        if (p.getSocialCategory() != null) score += 10;
        if (p.getFamilyAnnualIncome() != null) score += 10;
        if (p.getInstitutionName() != null) score += 10;
        return Math.min(100, score);
    }
}
