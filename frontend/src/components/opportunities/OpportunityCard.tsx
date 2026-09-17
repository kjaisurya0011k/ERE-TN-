import React from 'react';
import { Link } from 'react-router-dom';
import { Opportunity } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, VerificationBadge, DeadlineTrafficBadge } from '../common/Badge';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSave,
  isSaved = false,
}) => {
  const getOpportunityTypeLabel = (type: string) => {
    switch (type) {
      case 'SCHOLARSHIP': return 'Merit Scholarship';
      case 'GOVERNMENT_SCHEME': return 'Government Scheme';
      case 'GOVERNMENT_SCHOLARSHIP': return 'Government Scholarship';
      case 'GOVERNMENT_FEE_CONCESSION': return 'Govt Fee Concession';
      case 'COLLEGE_SCHOLARSHIP': return 'College Scholarship';
      case 'FOUNDATION_SCHOLARSHIP': return 'Foundation Scholarship';
      case 'WELFARE_ID_ASSISTANCE': return 'Welfare Board Scheme';
      case 'CORPORATE_CSR': return 'Corporate CSR';
      case 'DISABILITY_SCHOLARSHIP': return 'PWD / Disability';
      case 'MINORITY_SCHOLARSHIP': return 'Minority Scholarship';
      case 'DEFENCE_SCHOLARSHIP': return 'Defence Welfare';
      case 'SPORTS_SCHOLARSHIP': return 'Sports Scholarship';
      case 'NGO_OPPORTUNITY': return 'NGO Opportunity';
      case 'FELLOWSHIP': return 'Fellowship';
      case 'INTERNSHIP': return 'Internship';
      case 'SKILL_DEVELOPMENT': return 'Skill Development';
      case 'EDUCATION_ASSISTANCE': return 'Education Assistance';
      default: return type?.replace(/_/g, ' ') || 'Scholarship';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'GOVERNMENT_SCHEME':
      case 'GOVERNMENT_SCHOLARSHIP':
      case 'GOVERNMENT_FEE_CONCESSION':
        return 'primary';
      case 'WELFARE_ID_ASSISTANCE':
        return 'warning';
      case 'COLLEGE_SCHOLARSHIP':
      case 'SCHOLARSHIP':
        return 'secondary';
      case 'FOUNDATION_SCHOLARSHIP':
      case 'CORPORATE_CSR':
        return 'cyan';
      case 'DISABILITY_SCHOLARSHIP':
        return 'neutral';
      case 'MINORITY_SCHOLARSHIP':
        return 'cyan';
      case 'DEFENCE_SCHOLARSHIP':
        return 'primary';
      case 'SPORTS_SCHOLARSHIP':
        return 'warning';
      case 'NGO_OPPORTUNITY':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      featured={opportunity.featured}
      className="flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <VerificationBadge status={opportunity.verificationStatus} />
            <Badge variant={getBadgeVariant(opportunity.type) as any} size="sm">
              {getOpportunityTypeLabel(opportunity.type)}
            </Badge>
            {opportunity.minCutoffMarks && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <span className="material-symbols-outlined text-[13px]">grade</span>
                Cut-off {opportunity.minCutoffMarks}+
              </span>
            )}
            {opportunity.tuitionFeeSupport && opportunity.hostelSupport && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="material-symbols-outlined text-[13px]">hotel</span>
                100% Free Hostel & Tuition
              </span>
            )}
            {opportunity.state === 'Tamil Nadu' && !opportunity.tuitionFeeSupport && (
              <Badge variant="cyan" size="sm">
                Tamil Nadu
              </Badge>
            )}
          </div>

          <button
            onClick={() => onSave && onSave(opportunity.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'border-surface-variant text-on-surface-variant hover:text-red-500 hover:bg-surface-container'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'filled text-red-500' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        {/* Title */}
        <Link to={`/opportunities/${opportunity.id}`} className="block">
          <h3 className="font-headline-sm text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 mb-1.5">
            {opportunity.title}
          </h3>
        </Link>

        {/* Provider with Logo */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={opportunity.provider?.logoUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=60&auto=format&fit=crop&q=80'}
            alt={opportunity.provider?.name || 'Provider'}
            className="w-6 h-6 rounded-full object-cover border border-surface-variant flex-shrink-0"
          />
          <p className="text-xs text-on-surface-variant font-semibold line-clamp-1">
            {opportunity.provider?.name}
          </p>
        </div>

        {/* Institution Callout (for College Scholarships) */}
        {opportunity.institutionName && (
          <div className="flex items-center gap-1.5 text-xs text-secondary font-bold mb-2.5">
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span className="line-clamp-1">{opportunity.institutionName}</span>
          </div>
        )}

        {/* Benefits Highlight */}
        <div className="bg-surface-container-low rounded-lg p-3 border border-surface-variant/60 mb-3.5">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-0.5">
            Financial Aid & Benefits
          </span>
          <p className="text-sm font-extrabold text-primary line-clamp-2">
            {opportunity.benefitsDescription}
          </p>
        </div>

        {/* Eligibility Snippet */}
        <div className="space-y-1 mb-4">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
            Eligibility Criteria
          </span>
          <p className="text-xs text-on-surface leading-relaxed line-clamp-2">
            {opportunity.eligibilitySummary}
          </p>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-surface-variant/70 mt-2 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <DeadlineTrafficBadge
            deadline={opportunity.deadline}
            isOngoing={opportunity.isOngoing}
          />
          <span className="text-[11px] font-medium text-outline">
            Verified: {opportunity.lastVerifiedDate}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link to={`/opportunities/${opportunity.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <a
            href={opportunity.officialApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="apply"
              size="sm"
              className="w-full"
              rightIcon={<span className="material-symbols-outlined text-[14px]">open_in_new</span>}
            >
              Apply Official
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
};
