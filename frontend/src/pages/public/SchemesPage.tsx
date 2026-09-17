import React, { useState, useEffect, useMemo } from 'react';
import { opportunitiesApi } from '../../services/api';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

const SCHEME_TYPES = [
  'GOVERNMENT_SCHOLARSHIP',
  'WELFARE_ID_ASSISTANCE',
  'DISABILITY_SCHOLARSHIP',
  'MINORITY_SCHOLARSHIP',
  'DEFENCE_SCHOLARSHIP',
  'SPORTS_SCHOLARSHIP',
  'GOVERNMENT_FEE_CONCESSION',
];

const CATEGORY_TABS = [
  { key: 'ALL', label: 'All Schemes', icon: 'policy' },
  { key: 'GOVERNMENT_SCHOLARSHIP', label: 'Govt Scholarships', icon: 'account_balance' },
  { key: 'WELFARE_ID_ASSISTANCE', label: 'Welfare Board (ID Card)', icon: 'badge' },
  { key: 'DISABILITY_SCHOLARSHIP', label: 'PWD / Disability', icon: 'accessible' },
  { key: 'MINORITY_SCHOLARSHIP', label: 'Minority', icon: 'diversity_3' },
  { key: 'DEFENCE_SCHOLARSHIP', label: 'Defence / Ex-Servicemen', icon: 'military_tech' },
  { key: 'SPORTS_SCHOLARSHIP', label: 'Sports', icon: 'sports' },
];

const TYPE_LABELS: Record<string, string> = {
  GOVERNMENT_SCHOLARSHIP: 'Government Scholarship',
  WELFARE_ID_ASSISTANCE: 'Welfare Board (ID Card)',
  DISABILITY_SCHOLARSHIP: 'PWD / Disability Scheme',
  MINORITY_SCHOLARSHIP: 'Minority Scholarship',
  DEFENCE_SCHOLARSHIP: 'Defence / Armed Forces',
  SPORTS_SCHOLARSHIP: 'Sports Scholarship',
  GOVERNMENT_FEE_CONCESSION: 'Govt Fee Concession',
};

export const SchemesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [allOpps, setAllOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await opportunitiesApi.getAll();
        // Filter to only government/welfare/scheme types
        setAllOpps(data.filter((o: any) => SCHEME_TYPES.includes(o.type)));
      } catch (err: any) {
        setError(err.message || 'Failed to load schemes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return allOpps.filter((o) => {
      if (activeCategory !== 'ALL' && o.type !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          (o.title || '').toLowerCase().includes(q) ||
          (o.eligibilitySummary || '').toLowerCase().includes(q) ||
          (o.benefitsDescription || '').toLowerCase().includes(q) ||
          (o.idCardType || '').toLowerCase().includes(q) ||
          (o.provider?.name || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allOpps, activeCategory, searchQuery]);

  const countByType = (type: string) => allOpps.filter(o => o.type === type).length;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">🏛️ Government Schemes &amp; Welfare Board</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Government Scholarships &amp; Welfare Schemes
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Central and Tamil Nadu state government scholarships, welfare board ID-card schemes,
          disability benefits, minority programmes, defence welfare, and sports scholarships —
          all in one place.
        </p>
      </div>

      {/* Key Info Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 text-[22px] mt-0.5">badge</span>
          <div>
            <strong className="text-xs font-bold text-blue-900 block">Welfare Board ID Schemes</strong>
            <p className="text-xs text-blue-800 mt-0.5">
              19 schemes for workers — Construction, Washermen, Hairdressers, Beedi, Cine workers, etc. ID card required.
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-emerald-600 text-[22px] mt-0.5">account_balance</span>
          <div>
            <strong className="text-xs font-bold text-emerald-900 block">State &amp; Central Govt Scholarships</strong>
            <p className="text-xs text-emerald-800 mt-0.5">
              Post-matric, merit, income-based, and category scholarships from TN &amp; GoI portals.
            </p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-purple-600 text-[22px] mt-0.5">accessible</span>
          <div>
            <strong className="text-xs font-bold text-purple-900 block">PWD / Minority / Defence</strong>
            <p className="text-xs text-purple-800 mt-0.5">
              Disability scholarships, minority community schemes, and PM Scholarship for armed forces wards.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Total Schemes', value: allOpps.length, icon: 'policy', color: 'text-primary' },
            { label: 'Welfare Board', value: countByType('WELFARE_ID_ASSISTANCE'), icon: 'badge', color: 'text-blue-600' },
            { label: 'Govt Scholarships', value: countByType('GOVERNMENT_SCHOLARSHIP'), icon: 'account_balance', color: 'text-emerald-600' },
            { label: 'Disability / PWD', value: countByType('DISABILITY_SCHOLARSHIP'), icon: 'accessible', color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2 border border-surface-variant text-xs">
              <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
              <strong className={`font-bold ${s.color}`}>{s.value}</strong>
              <span className="text-on-surface-variant">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeCategory === tab.key
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-surface-container text-on-surface border-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
            {tab.key !== 'ALL' && (
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeCategory === tab.key ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {countByType(tab.key)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-lowest border border-surface-variant shadow-sm">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          type="text"
          placeholder="Search by scheme name, ID card type, department, or benefit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-xs md:text-sm text-on-surface w-full placeholder:text-outline"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
        </div>
      )}
      {error && <div className="text-center py-12 text-red-600 font-semibold">{error}</div>}

      {/* Results */}
      {!loading && !error && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>
              Showing <strong className="text-primary">{filtered.length}</strong> schemes
              {activeCategory !== 'ALL' && <> · <span className="text-primary">{TYPE_LABELS[activeCategory] || activeCategory}</span></>}
            </span>
            {searchQuery && <span>Results for "<strong>{searchQuery}</strong>"</span>}
          </div>

          {filtered.length === 0 ? (
            <Card className="p-12 text-center border border-surface-variant space-y-4">
              <span className="material-symbols-outlined text-5xl text-outline">policy</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">No Schemes Found</h3>
              <p className="text-xs text-on-surface-variant">Try clearing your search or selecting a different category.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
