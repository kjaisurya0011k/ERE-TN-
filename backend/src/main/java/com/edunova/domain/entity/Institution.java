package com.edunova.domain.entity;

import com.edunova.domain.InstitutionType;
import com.edunova.domain.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "institutions")
public class Institution {
    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private InstitutionType type;

    @Column(name = "university_affiliation")
    private String universityAffiliation;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.NEEDS_VERIFICATION;
}
