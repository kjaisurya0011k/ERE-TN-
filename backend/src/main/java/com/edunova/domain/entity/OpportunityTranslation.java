package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "opportunity_translations",
       uniqueConstraints = @UniqueConstraint(name = "uq_opp_lang",
                                             columnNames = {"opportunity_id", "language_code"}))
public class OpportunityTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Column(name = "language_code", nullable = false, length = 5)
    private String languageCode;

    @Column(length = 400)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "eligibility_summary", columnDefinition = "TEXT")
    private String eligibilitySummary;

    @Column(name = "benefits_description", columnDefinition = "TEXT")
    private String benefitsDescription;

    @Column(name = "application_method", length = 255)
    private String applicationMethod;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
