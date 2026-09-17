package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * 12th marks percentage slab for an opportunity.
 * Example: min_percent=80, max_percent=89.99, benefit_percentage=75 → "80–89.9% → 75% tuition waiver"
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "opportunity_percentage_slabs",
       uniqueConstraints = @UniqueConstraint(name = "uq_opp_pct_slab",
                                             columnNames = {"opportunity_id", "min_percent"}))
public class OpportunityPercentageSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    /** Minimum 12th percentage for this slab (inclusive). E.g. 80.00 */
    @Column(name = "min_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal minPercent;

    /** Maximum 12th percentage for this slab (inclusive). NULL = no upper bound. */
    @Column(name = "max_percent", precision = 5, scale = 2)
    private BigDecimal maxPercent;

    /** Tuition fee waiver percentage awarded for this slab (0–100). */
    @Column(name = "benefit_percentage", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal benefitPercentage = BigDecimal.ZERO;

    /** Hostel fee waiver percentage for this slab (0–100). */
    @Column(name = "hostel_waiver_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal hostelWaiverPercent = BigDecimal.ZERO;

    /** Human-readable note for this slab. */
    @Column(length = 255)
    private String notes;

    /** Display sort order (ascending = best benefit first). */
    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}
