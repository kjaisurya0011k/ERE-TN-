package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "opportunity_benefits")
public class OpportunityBenefit {
    @Id
    @Column(name = "opportunity_id")
    private String opportunityId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    private Long amount;

    @Column(name = "payment_frequency")
    private String paymentFrequency;

    @Column(name = "tuition_fee")
    private boolean tuitionFee;

    @Column(name = "hostel_assistance")
    private boolean hostelAssistance;

    @Column(name = "book_allowance")
    private boolean bookAllowance;

    @Column(name = "exam_fee")
    private boolean examFee;

    @Column(name = "equipment_assistance")
    private boolean equipmentAssistance;

    @Column(name = "other_benefits", columnDefinition = "TEXT")
    private String otherBenefits;

    @Column(name = "maximum_benefit")
    private String maximumBenefit;

    private String duration;
}
