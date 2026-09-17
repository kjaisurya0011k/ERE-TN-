import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PROVIDERS, MOCK_OPPORTUNITIES } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, VerificationBadge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';

export const FoundationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const foundation =
    MOCK_PROVIDERS.find((p) => p.id === id && p.type === 'FOUNDATION') ||
    MOCK_PROVIDERS.find((p) => p.type === 'FOUNDATION')!;

  const foundationOpportunities = MOCK_OPPORTUNITIES.filter(
    (o) => o.providerId === foundation.id || o.foundationId === foundation.id
  );

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/foundations" className="hover:text-primary transition-colors">
          Foundations
        </Link>
        <span>/</span>
        <span className="text-primary font-bold">{foundation.name}</span>
      </nav>

      {/* Main Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-variant shadow-[0px_4px_20px_rgba(26,35,126,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={foundation.logoUrl}
            alt={foundation.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-md flex-shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={foundation.verificationStatus} />
              <Badge variant="cyan" size="sm">
                Philanthropic Trust
              </Badge>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-primary">
              {foundation.name}
            </h1>
            <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
              {foundation.location}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={foundation.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="apply"
              size="md"
              className="w-full justify-center"
              rightIcon={<span className="material-symbols-outlined text-[16px]">open_in_new</span>}
            >
              Visit Official Website
            </Button>
          </a>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Mission, Who they support, and Scholarships */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">flag</span>
                Mission & Educational Objectives
              </h2>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {foundation.mission || foundation.description}
              </p>
            </div>

            {foundation.whoTheySupport && (
              <div className="space-y-2 pt-4 border-t border-surface-variant">
                <h3 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">groups</span>
                  Who They Support
                </h3>
                <p className="text-xs md:text-sm text-on-surface leading-relaxed font-medium">
                  {foundation.whoTheySupport}
                </p>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-surface-variant">
              <h3 className="font-headline-sm text-base font-bold text-primary">
                Key Focus & Scholarship Domains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {foundation.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container text-primary border border-surface-variant"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Scholarships offered by this Foundation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">school</span>
                Opportunities by {foundation.name} ({foundationOpportunities.length})
              </h3>
            </div>

            {foundationOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foundationOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-xs text-on-surface-variant">
                No active scholarships open at this moment. Check back soon.
              </Card>
            )}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-surface-variant pb-2">
              Foundation Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-outline">Verification:</span>
                <VerificationBadge status={foundation.verificationStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Last Verified:</span>
                <strong className="text-on-surface">{foundation.lastVerifiedDate}</strong>
              </div>
              {foundation.contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-outline">Email:</span>
                  <span className="font-semibold text-primary">{foundation.contactEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-outline">Official Portal:</span>
                <a
                  href={foundation.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-secondary underline truncate max-w-[140px]"
                >
                  {new URL(foundation.officialWebsite).hostname}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-variant">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                <strong>Data Accuracy Note:</strong> ERE-TN verifies foundation details against official corporate CSR registries and trust deeds.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
