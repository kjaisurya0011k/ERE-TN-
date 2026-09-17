import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PROVIDERS, MOCK_OPPORTUNITIES } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, VerificationBadge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';

export const NGODetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ngo =
    MOCK_PROVIDERS.find((p) => p.id === id && p.type === 'NGO') ||
    MOCK_PROVIDERS.find((p) => p.type === 'NGO')!;

  const ngoOpportunities = MOCK_OPPORTUNITIES.filter(
    (o) => o.providerId === ngo.id || o.ngoId === ngo.id
  );

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/ngos" className="hover:text-primary transition-colors">
          NGOs
        </Link>
        <span>/</span>
        <span className="text-primary font-bold">{ngo.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-variant shadow-[0px_4px_20px_rgba(26,35,126,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={ngo.logoUrl}
            alt={ngo.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-secondary/20 shadow-md flex-shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={ngo.verificationStatus} />
              <Badge variant="secondary" size="sm">
                Non-Governmental Organization
              </Badge>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-primary">
              {ngo.name}
            </h1>
            <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
              {ngo.location}
            </p>
          </div>
        </div>

        <a
          href={ngo.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto"
        >
          <Button
            variant="apply"
            size="md"
            className="w-full justify-center"
            rightIcon={<span className="material-symbols-outlined text-[16px]">open_in_new</span>}
          >
            Visit NGO Portal
          </Button>
        </a>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">handshake</span>
                Mission & Impact Vision
              </h2>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {ngo.mission || ngo.description}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-surface-variant">
              <h3 className="font-headline-sm text-base font-bold text-primary">
                Program Areas & Student Initiatives
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ngo.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container text-secondary border border-surface-variant"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Opportunities by this NGO */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">volunteer_activism</span>
              Programs & Opportunities by {ngo.name} ({ngoOpportunities.length})
            </h3>

            {ngoOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ngoOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-xs text-on-surface-variant">
                No active NGO programs open right now.
              </Card>
            )}
          </div>
        </div>

        {/* Right Details Box */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-surface-variant pb-2">
              NGO Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-outline">Verification:</span>
                <VerificationBadge status={ngo.verificationStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Last Verified:</span>
                <strong className="text-on-surface">{ngo.lastVerifiedDate}</strong>
              </div>
              {ngo.contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-outline">Contact Email:</span>
                  <span className="font-semibold text-primary">{ngo.contactEmail}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
