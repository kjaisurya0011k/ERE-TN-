import React, { useState, useMemo, useEffect } from 'react';
import { opportunitiesApi, institutionsApi } from '../../services/api';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const CollegeScholarshipsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('ALL');
  const [filterMyCollegeOnly, setFilterMyCollegeOnly] = useState(false);
  const [selectedEduLevel, setSelectedEduLevel] = useState('ALL');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated student's enrolled college
  const studentCollegeId = 'inst-anna-univ-ceg';
  const studentCollegeName = 'College of Engineering, Guindy (Anna University)';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [oppData, instData] = await Promise.all([
          opportunitiesApi.getAll({ type: 'COLLEGE_SCHOLARSHIP' }),
          institutionsApi.getAll(),
        ]);
        setOpportunities(oppData);
        setInstitutions(instData);
      } catch (err: any) {
        setError(err.message || 'Failed to load scholarships.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredScholarships = useMemo(() => {
    return opportunities.filter((opp) => {
      if (filterMyCollegeOnly && opp.institutionId !== studentCollegeId) return false;
      if (selectedInstitutionId !== 'ALL' && opp.institutionId !== selectedInstitutionId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (opp.title || '').toLowerCase().includes(q);
        const matchInst = (opp.institutionName || '').toLowerCase().includes(q);
        const matchDesc = (opp.eligibilitySummary || opp.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchInst && !matchDesc) return false;
      }
      return true;
    });
  }, [opportunities, filterMyCollegeOnly, selectedInstitutionId, searchQuery]);

  // Stats
  const fullFeeCount = opportunities.filter(o => o.feeBreakdown?.tuitionWaiverPct >= 100).length;
  const partialFeeCount = opportunities.filter(o => o.feeBreakdown?.tuitionWaiverPct > 0 && o.feeBreakdown?.tuitionWaiverPct < 100).length;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" size="md">🎓 College Merit &amp; Cut-off Scholarships</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          College &amp; University Scholarships
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Tamil Nadu private college cut-off based merit waivers — VSB, Kathir, CARE, CMS, SNS, KSR,
          Saveetha, VIT Chennai, SRM, JKKN and more. Up to 100% tuition + hostel fee waiver.
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: 'Total College Scholarships', value: opportunities.length, icon: 'school', color: 'text-secondary' },
            { label: '100% Full Tuition Waiver', value: fullFeeCount, icon: 'paid', color: 'text-primary' },
            { label: 'Partial Fee Waiver', value: partialFeeCount, icon: 'percent', color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5 border border-surface-variant text-sm">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
              <strong className={`font-bold ${s.color}`}>{s.value}</strong>
              <span className="text-on-surface-variant">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* "My College" Priority Banner */}
      <div className="bg-gradient-to-r from-secondary/15 via-primary/10 to-transparent p-5 md:p-6 rounded-2xl border border-secondary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center font-bold shadow-md">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
              Personalized Matching
            </span>
            <h3 className="font-display text-base md:text-lg font-bold text-primary">
              Your Enrolled College: {studentCollegeName}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {filteredScholarships.filter(o => o.institutionId === studentCollegeId).length > 0
                ? `Found ${filteredScholarships.filter(o => o.institutionId === studentCollegeId).length} scholarship(s) for your campus.`
                : 'See all scholarships across Tamil Nadu colleges.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setFilterMyCollegeOnly(!filterMyCollegeOnly)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            filterMyCollegeOnly
              ? 'bg-secondary text-white shadow-md'
              : 'bg-surface-container-lowest text-secondary border border-secondary hover:bg-secondary/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {filterMyCollegeOnly ? 'check_circle' : 'filter_list'}
          </span>
          <span>{filterMyCollegeOnly ? 'Showing My College' : 'Filter by My College'}</span>
        </button>
      </div>

      {/* Cut-off Scale Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">info</span>
        <div className="text-xs text-amber-900">
          <strong>TN Engineering Cut-off Scale:</strong> Calculated out of 200 (Physics + Chemistry + 0.5×Maths).
          Cut-off 190 = ~95%. Scholarships are awarded based on this cut-off, not 12th % directly (except Saveetha &amp; VIT).
        </div>
      </div>

      {/* Search & Institution Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-96 px-3 py-2 rounded-xl bg-surface-container-low border border-surface-variant">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            type="text"
            placeholder="Search by college, cut-off or scholarship name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs md:text-sm text-on-surface w-full placeholder:text-outline"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-outline font-semibold">Select College:</span>
          <select
            value={selectedInstitutionId}
            onChange={(e) => { setSelectedInstitutionId(e.target.value); setFilterMyCollegeOnly(false); }}
            className="px-3 py-2 rounded-lg border border-surface-variant bg-surface text-on-surface text-xs font-semibold"
          >
            <option value="ALL">All Colleges &amp; Universities</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} {inst.district ? `(${inst.district})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
        </div>
      )}
      {error && <div className="text-center py-12 text-red-600 font-semibold">{error}</div>}

      {/* Scholarships Grid */}
      {!loading && !error && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>Showing <strong>{filteredScholarships.length}</strong> college scholarships</span>
            {filterMyCollegeOnly && <span className="text-secondary font-bold">Filtered for {studentCollegeName}</span>}
          </div>

          {filteredScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScholarships.map((scholarship) => (
                <OpportunityCard key={scholarship.id} opportunity={scholarship} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-surface-variant space-y-4">
              <span className="material-symbols-outlined text-5xl text-outline">school</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">No College Scholarships Found</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                Try removing filters or selecting a different institution.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setFilterMyCollegeOnly(false); setSelectedInstitutionId('ALL'); setSearchQuery(''); }}
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
