import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_OPPORTUNITIES } from '../../data/mockData';
import { opportunitiesApi } from '../../services/api';
import { Opportunity } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge, VerificationBadge, DeadlineTrafficBadge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { Bell, CheckCircle2 } from 'lucide-react';

export const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState<Opportunity>(() => {
    return MOCK_OPPORTUNITIES.find((opp) => opp.id === id) || MOCK_OPPORTUNITIES[0];
  });
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(() => {
    const saved = localStorage.getItem('edunova_saved_opps');
    if (!saved) return false;
    const list: string[] = JSON.parse(saved);
    return list.includes(id || '');
  });

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        const data = await opportunitiesApi.getById(id);
        if (data && data.id) {
          setOpportunity(data);
        }
        const all = await opportunitiesApi.getAll();
        if (all && all.length > 0) {
          setAllOpportunities(all);
        }
        if (isAuthenticated) {
          const savedList = await opportunitiesApi.getSaved();
          if (savedList) {
            setIsSaved(savedList.some((s: any) => s.id === id));
          }
        }
      } catch {
        const fallback = MOCK_OPPORTUNITIES.find((opp) => opp.id === id);
        if (fallback) setOpportunity(fallback);
      }
    };
    loadDetail();
  }, [id, isAuthenticated]);

  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    const saved = localStorage.getItem('edunova_saved_opps');
    let list: string[] = saved ? JSON.parse(saved) : [];
    if (nextSaved) {
      if (!list.includes(opportunity.id)) list.push(opportunity.id);
    } else {
      list = list.filter((i) => i !== opportunity.id);
    }
    localStorage.setItem('edunova_saved_opps', JSON.stringify(list));

    if (isAuthenticated) {
      try {
        if (nextSaved) {
          await opportunitiesApi.save(opportunity.id);
        } else {
          await opportunitiesApi.unsave(opportunity.id);
        }
      } catch {
        // keep local state
      }
    }
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    setReminderToast(`Deadline reminder active for "${opportunity.title}". You will receive notifications before the closing date.`);
    setTimeout(() => {
      setReminderToast(null);
    }, 4500);
  };

  // Find 2-3 Related Opportunities based on type or state
  const relatedOpportunities = allOpportunities.filter(
    (o) => o.id !== opportunity.id && (o.type === opportunity.type || o.governmentLevel === opportunity.governmentLevel)
  ).slice(0, 3);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-slate-700 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{reminderToast}</p>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/opportunities" className="hover:text-primary transition-colors">
          Opportunities
        </Link>
        <span>/</span>
        <span className="text-primary font-bold line-clamp-1">{opportunity.title}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-variant shadow-[0px_4px_20px_rgba(26,35,126,0.05)] space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={opportunity.verificationStatus} />
              <Badge variant="primary" size="md">
                {opportunity.type ? opportunity.type.replace('_', ' ') : 'SCHOLARSHIP'}
              </Badge>
              {opportunity.governmentLevel === 'TAMIL_NADU' && (
                <Badge variant="cyan" size="md">
                  Tamil Nadu
                </Badge>
              )}
              {opportunity.tuitionFeeSupport && (
                <Badge variant="success" size="md">
                  Tuition Fee Support
                </Badge>
              )}
              {opportunity.hostelSupport && (
                <Badge variant="secondary" size="md">
                  Hostel Support
                </Badge>
              )}
            </div>

            {/* Title & Provider */}
            <div className="space-y-2">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-primary leading-tight">
                {opportunity.title}
              </h1>
              <div className="flex items-center gap-2.5 pt-1">
                {opportunity.provider?.logoUrl && (
                  <img
                    src={opportunity.provider.logoUrl}
                    alt={opportunity.provider.name}
                    className="w-8 h-8 rounded-full object-cover border border-surface-variant"
                  />
                )}
                <span className="text-sm font-bold text-on-surface">
                  {opportunity.provider?.name || 'Verified Organization'}
                </span>
              </div>
            </div>

            {/* Institution Highlight (for College Scholarships) */}
            {opportunity.institutionName && (
              <div className="p-4 rounded-xl bg-primary-fixed/30 border border-primary/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">school</span>
                <div>
                  <span className="text-xs font-bold text-primary block">Institutional Requirement:</span>
                  <p className="text-xs text-on-surface font-semibold">{opportunity.institutionName}</p>
                </div>
              </div>
            )}

            {/* Financial Benefits Box */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Financial Assistance & Coverage</span>
              </div>
              <p className="font-display text-2xl md:text-3xl font-extrabold text-primary">
                {opportunity.benefitsDescription || 'Financial Grant'}
              </p>
              {opportunity.financialAmount && opportunity.financialAmount > 0 && (
                <p className="text-xs font-bold text-emerald-700">
                  Value: ₹{opportunity.financialAmount.toLocaleString('en-IN')} (Grant / Scholarship Support)
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-headline-sm text-lg font-bold text-primary">
                About the Scheme / Opportunity
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-3 pt-4 border-t border-surface-variant">
              <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">fact_check</span>
                Eligibility Criteria
              </h3>
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant space-y-3">
                <p className="text-xs md:text-sm text-on-surface font-semibold leading-relaxed">
                  {opportunity.eligibilitySummary}
                </p>
                {opportunity.criteria && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-on-surface-variant border-t border-surface-variant">
                    {opportunity.criteria.allowedStates && (
                      <div>
                        <strong>State Domicile: </strong>
                        <span>{opportunity.criteria.allowedStates.join(', ')}</span>
                      </div>
                    )}
                    {opportunity.criteria.maxFamilyIncome && (
                      <div>
                        <strong>Max Family Income: </strong>
                        <span>₹{opportunity.criteria.maxFamilyIncome.toLocaleString('en-IN')} / year</span>
                      </div>
                    )}
                    {opportunity.criteria.minMarksPercentage && (
                      <div>
                        <strong>Minimum Marks: </strong>
                        <span>{opportunity.criteria.minMarksPercentage}%</span>
                      </div>
                    )}
                    {opportunity.criteria.requiresGovtSchool && (
                      <div className="text-primary font-bold col-span-full">
                        ✓ Requires 6th–12th schooling in Tamil Nadu Government Schools
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Required Documents */}
            {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-surface-variant">
                <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Required Documents
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {opportunity.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-on-surface bg-surface-container-low p-2.5 rounded-lg border border-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Process Steps */}
            {opportunity.applicationProcess && opportunity.applicationProcess.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-surface-variant">
                <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">checklist</span>
                  Application Steps
                </h3>
                <div className="space-y-2.5">
                  {opportunity.applicationProcess.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="text-on-surface leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mandatory Disclaimer */}
            <div className="p-4 bg-tertiary/5 rounded-xl border border-tertiary/20 text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-primary font-bold">Official Verification Policy:</strong> {t('disclaimer.official')}
            </div>
          </div>
        </div>

        {/* Right Sticky Action Panel */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0px_10px_30px_rgba(26,35,126,0.08)] space-y-6">
            <h3 className="font-headline-sm text-base font-bold text-primary border-b border-surface-variant pb-3">
              Application Actions
            </h3>

            {/* Deadline status */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-outline uppercase tracking-wider block">
                Application Deadline
              </span>
              <DeadlineTrafficBadge
                deadline={opportunity.deadline}
                isOngoing={opportunity.isOngoing}
                className="text-sm py-1.5 px-3"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={opportunity.officialApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="apply"
                  size="lg"
                  className="w-full justify-center shadow-md"
                  rightIcon={<span className="material-symbols-outlined text-[18px]">open_in_new</span>}
                >
                  APPLY ON OFFICIAL WEBSITE
                </Button>
              </a>

              <a
                href={opportunity.officialInfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant="outline" size="md" className="w-full justify-center">
                  View Official Information
                </Button>
              </a>

              <Button
                variant={isSaved ? 'secondary' : 'ghost'}
                size="md"
                onClick={handleToggleSave}
                className="w-full justify-center"
                leftIcon={
                  <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled text-red-500' : ''}`}>
                    favorite
                  </span>
                }
              >
                {isSaved ? 'Saved to My Opportunities' : 'Save Opportunity'}
              </Button>

              <Button
                variant={reminderSet ? 'secondary' : 'outline'}
                size="md"
                onClick={handleSetReminder}
                className="w-full justify-center"
                leftIcon={<Bell className="w-4 h-4" />}
              >
                {reminderSet ? 'Reminder Active ✓' : 'Set Deadline Reminder'}
              </Button>
            </div>

            {/* Provider Snapshot */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant space-y-3 text-xs">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                Provider Information
              </span>
              <div className="flex items-center gap-2">
                {opportunity.provider?.logoUrl && (
                  <img
                    src={opportunity.provider.logoUrl}
                    alt={opportunity.provider.name}
                    className="w-8 h-8 rounded-lg object-cover border border-surface-variant"
                  />
                )}
                <div>
                  <p className="font-bold text-on-surface line-clamp-1">{opportunity.provider?.name}</p>
                  <span className="text-[10px] text-outline uppercase font-semibold">
                    {opportunity.provider?.type ? opportunity.provider.type.replace('_', ' ') : 'ORGANIZATION'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Verification:</span>
                <VerificationBadge status={opportunity.verificationStatus} />
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Last Verified:</span>
                <strong>{opportunity.lastVerifiedDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Opportunities Section */}
      {relatedOpportunities.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-surface-variant">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">auto_awesome</span>
              Related Opportunities
            </h2>
            <Link to="/opportunities" className="text-xs font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedOpportunities.map((relOpp) => (
              <OpportunityCard key={relOpp.id} opportunity={relOpp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OpportunityDetailPage;
