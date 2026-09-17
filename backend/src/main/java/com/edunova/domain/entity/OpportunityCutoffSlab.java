package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Engineering cut-off slab for an opportunity.
 * Example: min_cutoff=190, max_cutoff=null, tuitionWaiverPercent=100 → "≥190 → 100% tuition waiver"
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "opportunity_cutoff_slabs",
       uniqueConstraints = @UniqueConstraint(name = "uq_opp_cutoff_slab",
                                             columnNames = {"opportunity_id", "min_cutoff"}))
public class OpportunityCutoffSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    /** Lower bound of cut-off slab (inclusive). E.g. 190.00 */
    @Column(name = "min_cutoff", nullable = false, precision = 6, scale = 2)
    private BigDecimal minCutoff;

    /** Upper bound of cut-off slab (inclusive). NULL = no upper bound (≥ minCutoff). */
    @Column(name = "max_cutoff", precision = 6, scale = 2)
    private BigDecimal maxCutoff;

    /** Percentage of tuition fee waived for this slab (0–100). */
    @Column(name = "tuition_waiver_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tuitionWaiverPercent = BigDecimal.ZERO;

    /** Percentage of hostel + bus fee waived for this slab (0–100). */
    @Column(name = "hostel_bus_waiver_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal hostelBusWaiverPercent = BigDecimal.ZERO;

    /** Human-readable note for this slab, e.g. "100% tuition for 190+". */
    @Column(length = 255)
    private String notes;

    /** Display sort order (ascending). */
    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}
