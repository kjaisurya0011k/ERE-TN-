import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Opportunity, OpportunityType, ProviderType, SocialCategory, EducationLevel, EligibilityEvaluationResult, Provider } from '../../types';
import { MOCK_OPPORTUNITIES, MOCK_PROVIDERS } from '../../data/mockData';
import { opportunitiesApi, providersApi } from '../../services/api';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const OpportunitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Live Database State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGovtLevel, setSelectedGovtLevel] = useState<string>(searchParams.get('state') || 'ALL');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'ALL');
  const [selectedProviderType, setSelectedProviderType] = useState<string>(searchParams.get('providerType') || 'ALL');
  const [selectedVerification, setSelectedVerification] = useState<string>('ALL');
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('edunova_saved_opps');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Eligibility Modal State
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(
    searchParams.get('eligibility') === 'true'
  );
  const [eligibilityStep, setEligibilityStep] = useState(1);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    gender: 'FEMALE',
    state: 'Tamil Nadu',
    nativeState: 'Tamil Nadu',
    educationLevel: 'UNDERGRADUATE' as EducationLevel,
    classOrYear: '1st Year',
    courseBranch: 'Engineering (B.E / B.Tech)',
    marksPercentage: 85,
    familyAnnualIncome: 180000,
    socialCategory: 'BC' as SocialCategory,
    isGovtSchoolStudent: true,
    isFirstGraduate: true,
    isPwd: false,
    isHosteller: false,
  });

  const [evaluationResults, setEvaluationResults] = useState<EligibilityEvaluationResult[] | null>(null);

  // Load live data from PostgreSQL via Spring Boot — refetches when language changes so backend returns localized content
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await opportunitiesApi.getAll();
        if (data && data.length > 0) {
          setOpportunities(data);
        }
        const provs = await providersApi.getAll();
        if (provs && provs.length > 0) {
          setProviders(provs);
        }
        if (isAuthenticated) {
          const saved = await opportunitiesApi.getSaved();
          if (saved && saved.length > 0) {
            setSavedIds(saved.map((s: any) => s.id));
          }
        }
      } catch {
        // Keep initial dataset
      } finally {
        setIsLoading(false);
      }
    };
    loadOpportunities();
  }, [isAuthenticated, t]); // t changes identity when language switches, triggering refetch


  // Sync saved to localStorage
  useEffect(() => {
    localStorage.setItem('edunova_saved_opps', JSON.stringify(savedIds));
  }, [savedIds]);

  const handleToggleSave = async (id: string) => {
    const isCurrentlySaved = savedIds.includes(id);
    setSavedIds((prev) =>
      isCurrentlySaved ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (isAuthenticated) {
      try {
        if (isCurrentlySaved) {
          await opportunitiesApi.unsave(id);
        } else {
          await opportunitiesApi.save(id);
        }
      } catch {
        // Fallback gracefully
      }
    }
  };

  // Rule-Based Eligibility Evaluation Engine
  const runEligibilityCheck = () => {
    const results: EligibilityEvaluationResult[] = opportunities.map((opp) => {
      const criteria = opp.criteria || {};
      const reasonsMatched: string[] = [];
      const missingCriteria: string[] = [];
      let totalChecks = 0;
      let matchedChecks = 0;

      // 1. Gender check
      if (criteria.genderAllowed) {
        totalChecks++;
        if (criteria.genderAllowed === 'ALL') {
          matchedChecks++;
          reasonsMatched.push('Open to all genders');
        } else if (criteria.genderAllowed === 'FEMALE_ONLY' && studentForm.gender === 'FEMALE') {
          matchedChecks++;
          reasonsMatched.push('Matches female student requirement');
        } else if (criteria.genderAllowed === 'MALE_ONLY' && studentForm.gender === 'MALE') {
          matchedChecks++;
          reasonsMatched.push('Matches male student requirement');
        } else {
          missingCriteria.push(`Requires ${criteria.genderAllowed.toLowerCase().replace('_', ' ')}`);
        }
      }

      // 2. State Check
      if (criteria.allowedStates && criteria.allowedStates.length > 0) {
        totalChecks++;
        if (criteria.allowedStates.includes(studentForm.state) || criteria.allowedStates.includes('All India')) {
          matchedChecks++;
          reasonsMatched.push(`Domicile state ${studentForm.state} is eligible`);
        } else {
          missingCriteria.push(`Requires domicile in: ${criteria.allowedStates.join(', ')}`);
        }
      }

      // 3. Education Level Check
      if (criteria.allowedEducationLevels && criteria.allowedEducationLevels.length > 0) {
        totalChecks++;
        if (criteria.allowedEducationLevels.includes(studentForm.educationLevel)) {
          matchedChecks++;
          reasonsMatched.push(`Matches current level: ${studentForm.educationLevel.replace('_', ' ')}`);
        } else {
          missingCriteria.push('Education level criteria not met');
        }
      }

      // 4. Govt School Background Check
      if (criteria.requiresGovtSchool) {
        totalChecks++;
        if (studentForm.isGovtSchoolStudent) {
          matchedChecks++;
          reasonsMatched.push('Studied 6th to 12th in Tamil Nadu Government School');
        } else {
          missingCriteria.push('Requires 6th-12th schooling in TN Government School');
        }
      }

      // 5. First Graduate Check
      if (criteria.requiresFirstGraduate) {
        totalChecks++;
        if (studentForm.isFirstGraduate) {
          matchedChecks++;
          reasonsMatched.push('Matches First Graduate in Family status');
        } else {
          missingCriteria.push('Requires First Graduate in Family status');
        }
      }

      // 6. Income Ceiling Check
      if (criteria.maxFamilyIncome) {
        totalChecks++;
        if (studentForm.familyAnnualIncome <= criteria.maxFamilyIncome) {
          matchedChecks++;
          reasonsMatched.push(`Family annual income (₹${studentForm.familyAnnualIncome.toLocaleString('en-IN')}) is below ceiling of ₹${criteria.maxFamilyIncome.toLocaleString('en-IN')}`);
        } else {
          missingCriteria.push(`Family annual income exceeds limit of ₹${criteria.maxFamilyIncome.toLocaleString('en-IN')}`);
        }
      }

      // 7. Marks Percentage Check
      if (criteria.minMarksPercentage) {
        totalChecks++;
        if (studentForm.marksPercentage >= criteria.minMarksPercentage) {
          matchedChecks++;
          reasonsMatched.push(`Academic score (${studentForm.marksPercentage}%) satisfies minimum of ${criteria.minMarksPercentage}%`);
        } else {
          missingCriteria.push(`Requires minimum score of ${criteria.minMarksPercentage}%`);
        }
      }

      // 8. Social Category Check
      if (criteria.allowedCategories && criteria.allowedCategories.length > 0) {
        totalChecks++;
        if (criteria.allowedCategories.includes(studentForm.socialCategory)) {
          matchedChecks++;
          reasonsMatched.push(`Category ${studentForm.socialCategory} is eligible`);
        } else {
          missingCriteria.push(`Applicable for categories: ${criteria.allowedCategories.join(', ')}`);
        }
      }

      const matchPercentage = totalChecks > 0 ? Math.round((matchedChecks / totalChecks) * 100) : 80;
      
      let status: 'ELIGIBLE' | 'PARTIAL' | 'NOT_ELIGIBLE' = 'NOT_ELIGIBLE';
      if (matchPercentage >= 80 && missingCriteria.length === 0) {
        status = 'ELIGIBLE';
      } else if (matchPercentage >= 50) {
        status = 'PARTIAL';
      }

      return {
        opportunity: opp,
        matchPercentage,
        status,
        reasonsMatched,
        missingCriteria,
        notes: opp.verificationStatus === 'DEMO_DATA' 
          ? 'DEMO DATA — NOT FOR ACTUAL APPLICATION'
          : 'Verified according to latest official notification.'
      };
    });

    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setEvaluationResults(results);
    setEligibilityStep(5);
  };

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');

  // Filtered Opportunities List
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (showOnlySaved && !savedIds.includes(opp.id)) return false;

      // 1. Category Tab Filter
      if (selectedCategoryTab !== 'ALL') {
        if (selectedCategoryTab === 'INSTITUTION_MERIT_CUTOFF') {
          const isInstMerit = opp.governmentLevel === 'INSTITUTION_MERIT' || opp.governmentLevel === 'INSTITUTION' || opp.minCutoffMarks || opp.institutionName;
          if (!isInstMerit) return false;
        } else if (selectedCategoryTab === 'WELFARE_BOARD') {
          const isWelfare = opp.categoryTags?.some((t) => t.toLowerCase().includes('welfare') || t.toLowerCase().includes('labour') || t.toLowerCase().includes('construction') || t.toLowerCase().includes('unorganized'));
          if (!isWelfare) return false;
        } else if (selectedCategoryTab === 'TN_GOVT_FREE_SCHEMES') {
          const isTnGovt = (opp.governmentLevel === 'TAMIL_NADU' || opp.governmentLevel === 'STATE_GOVERNMENT') && !opp.categoryTags?.some((t) => t.toLowerCase().includes('welfare') || t.toLowerCase().includes('labour'));
          if (!isTnGovt) return false;
        } else if (selectedCategoryTab === 'GRASSROOTS_FOUNDATIONS_100_PERCENT_FREE') {
          const isGrassroots = opp.governmentLevel === 'NON_PROFIT_TRUST' || opp.providerId?.includes('agaram') || opp.providerId?.includes('maatram') || opp.providerId?.includes('team-everest');
          if (!isGrassroots) return false;
        } else if (selectedCategoryTab === 'CENTRAL_GOVT_AICTE_NSP') {
          const isCentral = opp.governmentLevel === 'CENTRAL' || opp.governmentLevel === 'CENTRAL_GOVERNMENT' || opp.categoryTags?.some((t) => t.toLowerCase().includes('nsp') || t.toLowerCase().includes('aicte'));
          if (!isCentral) return false;
        } else if (selectedCategoryTab === 'CORPORATE_CSR_TRUSTS') {
          const isCsr = opp.governmentLevel === 'CORPORATE_CSR' || opp.governmentLevel === 'CORPORATE_FOUNDATION' || (opp.provider?.type === 'FOUNDATION' && !opp.institutionId);
          if (!isCsr) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesProvider = opp.provider?.name?.toLowerCase().includes(q);
        const matchesDesc = opp.description?.toLowerCase().includes(q);
        const matchesTags = opp.categoryTags?.some((t) => t.toLowerCase().includes(q));
        const matchesInst = opp.institutionName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesTags && !matchesInst) return false;
      }

      if (selectedGovtLevel !== 'ALL') {
        if (selectedGovtLevel === 'TAMIL_NADU' && opp.governmentLevel !== 'TAMIL_NADU' && opp.governmentLevel !== 'STATE_GOVERNMENT') return false;
        if (selectedGovtLevel === 'CENTRAL' && opp.governmentLevel !== 'CENTRAL' && opp.governmentLevel !== 'CENTRAL_GOVERNMENT') return false;
        if (selectedGovtLevel === 'FOUNDATION' && opp.governmentLevel !== 'CORPORATE_FOUNDATION' && opp.governmentLevel !== 'CORPORATE_CSR') return false;
        if (selectedGovtLevel === 'NGO' && opp.governmentLevel !== 'NGO_INSTITUTE' && opp.governmentLevel !== 'NON_PROFIT_TRUST') return false;
        if (selectedGovtLevel === 'INSTITUTION' && opp.governmentLevel !== 'INSTITUTION' && opp.governmentLevel !== 'INSTITUTION_MERIT') return false;
      }

      if (selectedType !== 'ALL' && opp.type !== selectedType) return false;
      if (selectedProviderType !== 'ALL' && opp.provider?.type !== selectedProviderType) return false;
      if (selectedVerification !== 'ALL' && opp.verificationStatus !== selectedVerification) return false;

      return true;
    });
  }, [opportunities, searchQuery, selectedCategoryTab, selectedGovtLevel, selectedType, selectedProviderType, selectedVerification, showOnlySaved, savedIds]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryTab('ALL');
    setSelectedGovtLevel('ALL');
    setSelectedType('ALL');
    setSelectedProviderType('ALL');
    setSelectedVerification('ALL');
    setShowOnlySaved(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-container to-secondary text-white rounded-2xl p-6 md:p-8 shadow-[0px_10px_30px_rgba(26,35,126,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <Badge variant="cyan" size="sm">
            Unified Opportunity Explorer
          </Badge>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            {t('opportunities.title')}
          </h1>
          <p className="text-xs md:text-sm text-primary-fixed-dim leading-relaxed">
            Discover Government Schemes, Foundation Grants, College Scholarships, NGO Opportunities, Fellowships & Internships in one unified platform.
          </p>
        </div>

        <Button
          size="lg"
          variant="apply"
          onClick={() => {
            setIsEligibilityModalOpen(true);
            setEligibilityStep(1);
          }}
          className="shadow-lg whitespace-nowrap"
          leftIcon={<span className="material-symbols-outlined text-[22px]">search_check</span>}
        >
          {t('hero.primaryCta')}
        </Button>
      </div>

      {/* Main Layout: Filters Sidebar + Opportunities Stream */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-surface-container-lowest rounded-xl p-5 border border-surface-variant shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
            <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              {t('opportunities.filters')}
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-secondary hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Quick Saved Filter */}
          <div>
            <button
              onClick={() => setShowOnlySaved(!showOnlySaved)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                showOnlySaved
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'border-surface-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500 filled">favorite</span>
                My Saved Opportunities
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border font-extrabold">
                {savedIds.length}
              </span>
            </button>
          </div>

          {/* Opportunity Type Filter (All 10 Types) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Opportunity Type
            </label>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { id: 'ALL', label: 'All Opportunities' },
                { id: 'GOVERNMENT_SCHEME', label: 'Government Schemes' },
                { id: 'GOVERNMENT_SCHOLARSHIP', label: 'Government Scholarships' },
                { id: 'COLLEGE_SCHOLARSHIP', label: 'College Scholarships' },
                { id: 'FOUNDATION_SCHOLARSHIP', label: 'Foundation Scholarships' },
                { id: 'NGO_OPPORTUNITY', label: 'NGO Opportunities' },
                { id: 'FELLOWSHIP', label: 'Fellowships' },
                { id: 'INTERNSHIP', label: 'Internships' },
                { id: 'SKILL_DEVELOPMENT', label: 'Skill Development' },
                { id: 'EDUCATION_ASSISTANCE', label: 'Education Assistance' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    selectedType === item.id
                      ? 'bg-primary text-white font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {selectedType === item.id && (
                    <span className="material-symbols-outlined text-[16px] flex-shrink-0">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Provider Category
            </label>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { id: 'ALL', label: 'All Providers' },
                { id: 'STATE_GOVERNMENT', label: 'Tamil Nadu Govt' },
                { id: 'CENTRAL_GOVERNMENT', label: 'Central Government' },
                { id: 'FOUNDATION', label: 'Foundations & Trusts' },
                { id: 'NGO', label: 'NGOs & Non-Profits' },
                { id: 'COLLEGE_UNIVERSITY', label: 'Colleges & Universities' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedProviderType(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    selectedProviderType === item.id
                      ? 'bg-secondary text-white font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedProviderType === item.id && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Verification Status
            </label>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'VERIFIED', label: 'Verified Official' },
                { id: 'DEMO_DATA', label: 'Demo Data' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedVerification(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    selectedVerification === item.id
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedVerification === item.id && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Opportunities Stream */}
        <main className="flex-1 w-full space-y-6">
          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { id: 'ALL', label: 'All (28)', icon: 'apps' },
              { id: 'INSTITUTION_MERIT_CUTOFF', label: '190+ Cut-Off & 100% Free Seats', icon: 'school' },
              { id: 'TN_GOVT_FREE_SCHEMES', label: 'TN Govt Free Schemes (7.5% / FG)', icon: 'account_balance' },
              { id: 'WELFARE_BOARD', label: 'Welfare Boards (TNCWWB / Labour)', icon: 'engineering' },
              { id: 'GRASSROOTS_FOUNDATIONS_100_PERCENT_FREE', label: 'Grassroots 100% Free (Agaram / Maatram)', icon: 'volunteer_activism' },
              { id: 'CENTRAL_GOVT_AICTE_NSP', label: 'Central Govt / AICTE / NSP', icon: 'flag' },
              { id: 'CORPORATE_CSR_TRUSTS', label: 'Corporate CSR & Trusts', icon: 'corporate_fare' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-sm ${
                  selectedCategoryTab === tab.id
                    ? 'bg-primary text-white ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-primary border border-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-3 border border-surface-variant shadow-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-outline pl-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, provider, college, foundation, or field..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-primary pr-2 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant px-1 font-semibold">
            <span>
              Showing <strong>{filteredOpportunities.length}</strong> opportunities
            </span>
            {(selectedGovtLevel !== 'ALL' || selectedType !== 'ALL' || selectedProviderType !== 'ALL' || selectedVerification !== 'ALL' || searchQuery) && (
              <span className="text-secondary font-bold">Filters Active</span>
            )}
          </div>

          {/* Cards Grid */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  isSaved={savedIds.includes(opportunity.id)}
                  onSave={handleToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-variant space-y-4">
              <span className="material-symbols-outlined text-5xl text-outline">search_off</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">
                No Matching Opportunities Found
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                We couldn't find any opportunities matching your current search or filter criteria. Try clearing some filters or searching with broader keywords.
              </p>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Primary Feature: Interactive Rule-Based Eligibility Modal */}
      <Modal
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        title="🎯 Unified Rule-Based Eligibility Checker"
        maxWidth="2xl"
      >
        {eligibilityStep < 5 ? (
          <div className="space-y-6">
            {/* Step Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>Step {eligibilityStep} of 4</span>
                <span>
                  {eligibilityStep === 1 && 'Basic Information'}
                  {eligibilityStep === 2 && 'Academic & Education'}
                  {eligibilityStep === 3 && 'Category & Income'}
                  {eligibilityStep === 4 && 'Special TN Quotas & Criteria'}
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${(eligibilityStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {eligibilityStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Full Name (as per official documents)"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="e.g. Kavitha R"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Gender"
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    options={[
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'MALE', label: 'Male' },
                      { value: 'OTHER', label: 'Other / Transgender' },
                    ]}
                  />
                  <Select
                    label="State of Domicile"
                    value={studentForm.state}
                    onChange={(e) => setStudentForm({ ...studentForm, state: e.target.value })}
                    options={[
                      { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                      { value: 'Karnataka', label: 'Karnataka' },
                      { value: 'Kerala', label: 'Kerala' },
                      { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
                      { value: 'Other State', label: 'Other State (All India)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academics */}
            {eligibilityStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Current Education Level"
                    value={studentForm.educationLevel}
                    onChange={(e) => setStudentForm({ ...studentForm, educationLevel: e.target.value as EducationLevel })}
                    options={[
                      { value: 'SCHOOL_12TH', label: '12th Standard Completed / Enrolled' },
                      { value: 'DIPLOMA_POLYTECHNIC', label: 'Diploma / Polytechnic' },
                      { value: 'UNDERGRADUATE', label: 'Undergraduate (B.E / B.Tech / B.Sc / Arts)' },
                      { value: 'POSTGRADUATE', label: 'Postgraduate (M.E / M.Sc / MBA)' },
                      { value: 'PHD_RESEARCH', label: 'Ph.D. / Research' },
                    ]}
                  />
                  <Input
                    label="Current Academic Score (%)"
                    type="number"
                    min="35"
                    max="100"
                    value={studentForm.marksPercentage}
                    onChange={(e) => setStudentForm({ ...studentForm, marksPercentage: Number(e.target.value) })}
                  />
                </div>
                <Input
                  label="Course / Branch of Study"
                  value={studentForm.courseBranch}
                  onChange={(e) => setStudentForm({ ...studentForm, courseBranch: e.target.value })}
                  placeholder="e.g. Computer Science Engineering, B.Sc Mathematics"
                />
              </div>
            )}

            {/* Step 3: Category & Income */}
            {eligibilityStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Social Category / Community"
                    value={studentForm.socialCategory}
                    onChange={(e) => setStudentForm({ ...studentForm, socialCategory: e.target.value as SocialCategory })}
                    options={[
                      { value: 'BC', label: 'BC (Backward Class)' },
                      { value: 'BCM', label: 'BCM (Backward Class Muslim)' },
                      { value: 'MBC', label: 'MBC (Most Backward Class)' },
                      { value: 'DNC', label: 'DNC (De-notified Community)' },
                      { value: 'SC', label: 'SC (Scheduled Caste)' },
                      { value: 'SCA', label: 'SCA (SC Arunthathiyar)' },
                      { value: 'ST', label: 'ST (Scheduled Tribe)' },
                      { value: 'GENERAL', label: 'General / Open Category' },
                    ]}
                  />
                  <Input
                    label="Family Annual Income (₹ INR)"
                    type="number"
                    value={studentForm.familyAnnualIncome}
                    onChange={(e) => setStudentForm({ ...studentForm, familyAnnualIncome: Number(e.target.value) })}
                    helperText="As per official Tahsildar / Revenue Income Certificate"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Special TN Quotas */}
            {eligibilityStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Tamil Nadu Welfare & Special Quota Checks
                  </h4>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentForm.isGovtSchoolStudent}
                      onChange={(e) => setStudentForm({ ...studentForm, isGovtSchoolStudent: e.target.checked })}
                      className="mt-1 rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-on-surface block">
                        Studied 6th to 12th in Tamil Nadu Government School?
                      </span>
                      <span className="text-on-surface-variant">
                        Unlocks Pudhumai Penn, Tamil Pudhalvan, and 7.5% Govt School quota benefits.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-surface-variant">
                    <input
                      type="checkbox"
                      checked={studentForm.isFirstGraduate}
                      onChange={(e) => setStudentForm({ ...studentForm, isFirstGraduate: e.target.checked })}
                      className="mt-1 rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-on-surface block">
                        First Graduate in Family?
                      </span>
                      <span className="text-on-surface-variant">
                        No siblings or parents hold a graduate degree (qualifies for TNEA tuition concession).
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-surface-variant">
                    <input
                      type="checkbox"
                      checked={studentForm.isPwd}
                      onChange={(e) => setStudentForm({ ...studentForm, isPwd: e.target.checked })}
                      className="mt-1 rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-on-surface block">
                        Person with Benchmark Disability (PwD)?
                      </span>
                      <span className="text-on-surface-variant">
                        Eligible for AICTE Saksham & specialized welfare grants.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-surface-variant">
              {eligibilityStep > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEligibilityStep(eligibilityStep - 1)}
                >
                  Previous
                </Button>
              ) : <div />}

              {eligibilityStep < 4 ? (
                <Button
                  size="sm"
                  onClick={() => setEligibilityStep(eligibilityStep + 1)}
                  rightIcon={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="primary"
                  onClick={runEligibilityCheck}
                  leftIcon={<span className="material-symbols-outlined text-[18px]">calculate</span>}
                >
                  Evaluate Matching Opportunities
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Step 5: Results View */
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  🎉 Unified Evaluation Complete!
                </h4>
                <p className="text-xs text-emerald-700">
                  Identified matching Government Schemes, College Scholarships, and Foundation Grants.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEligibilityStep(1)}
              >
                Re-evaluate
              </Button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {evaluationResults?.map((res) => (
                <div
                  key={res.opportunity.id}
                  className={`p-4 rounded-xl border transition-all ${
                    res.status === 'ELIGIBLE'
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : res.status === 'PARTIAL'
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-surface-container-low border-surface-variant opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase mb-1 ${
                        res.status === 'ELIGIBLE'
                          ? 'bg-emerald-600 text-white'
                          : res.status === 'PARTIAL'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {res.status === 'ELIGIBLE' ? '🟢 YOU MAY BE ELIGIBLE' : res.status === 'PARTIAL' ? '🟡 NEEDS MORE INFORMATION' : '🔴 LIKELY NOT ELIGIBLE'} ({res.matchPercentage}%)
                      </span>
                      <h4 className="font-headline-sm text-base font-bold text-primary">
                        {res.opportunity.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {res.opportunity.provider.name}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary bg-white px-2.5 py-1 rounded-lg border shadow-sm flex-shrink-0">
                      {res.opportunity.benefitsDescription.split('+')[0]}
                    </span>
                  </div>

                  {/* Why it matches */}
                  {res.reasonsMatched.length > 0 && (
                    <div className="mt-2 text-xs text-emerald-800 space-y-1">
                      <span className="font-bold block">✓ Why you match:</span>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        {res.reasonsMatched.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing criteria */}
                  {res.missingCriteria.length > 0 && (
                    <div className="mt-2 text-xs text-amber-900 space-y-1">
                      <span className="font-bold block">⚠️ Needs attention:</span>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        {res.missingCriteria.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="mt-3 pt-3 border-t border-surface-variant flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-outline">
                      {res.opportunity.verificationStatus === 'VERIFIED' ? 'Verified Official Record' : 'Demo Record'}
                    </span>
                    <a
                      href={res.opportunity.officialApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary"
                    >
                      Apply on Official Portal <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Mandatory Disclaimer Box */}
            <div className="p-3 bg-surface-container-low rounded-lg border border-surface-variant text-[11px] text-on-surface-variant leading-relaxed">
              <strong>Notice:</strong> {t('disclaimer.official')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
