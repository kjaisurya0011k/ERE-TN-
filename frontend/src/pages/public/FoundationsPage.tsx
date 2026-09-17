import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { providersApi } from '../../services/api';
import { opportunitiesApi } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge, VerificationBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const FoundationsPage: React.FC = () => {
  const [selectedFocus, setSelectedFocus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [provData, oppData] = await Promise.all([
          providersApi.getAll(),
          opportunitiesApi.getAll(),
        ]);
        setProviders(provData);
        setOpportunities(oppData);
      } catch (err: any) {
        setError(err.message || 'Failed to load foundations.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter: Foundations = FOUNDATION / CHARITABLE_TRUST / PRIVATE_EDUCATIONAL_TRUST type
  const foundations = providers.filter((p) =>
    ['FOUNDATION', 'CHARITABLE_TRUST', 'PRIVATE_EDUCATIONAL_TRUST', 'NGO_NON_PROFIT'].includes(p.type) &&
    !['NGO', 'NGO_NON_PROFIT'].includes(p.providerCategory || '') // separate NGOs on NGO page
    // show trusts + foundations here
  );

  // Focus area tags derived from data
  const focusTags = ['ALL', 'Higher Education', 'STEM Scholarships', 'Medical & Healthcare Grants', 'Crisis Support', 'Merit', 'Girl Child'];

  const filteredFoundations = foundations.filter((f) => {
    const name = (f.name || '').toLowerCase();
    const desc = (f.description || '').toLowerCase();
    const focuses = (f.focusAreas || []).map((a: string) => a.toLowerCase());
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !focuses.some((a: string) => a.includes(q))) return false;
    }
    if (selectedFocus !== 'ALL') {
      const sl = selectedFocus.toLowerCase();
      if (!focuses.some((a: string) => a.includes(sl)) && !desc.includes(sl) && !name.includes(sl)) return false;
    }
    return true;
  });

  const getOppCount = (providerId: string) =>
    opportunities.filter((o) => o.providerId === providerId).length;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="cyan" size="md">🏛️ Charitable Trusts &amp; Foundations</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Foundation Scholarships &amp; Grants
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Discover scholarships from Tamil Nadu's leading private trusts, corporate CSR foundations,
          and philanthropic organisations — Sabari Foundation, RIT, JKKN, Agni Siragugal &amp; more.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: 'Foundations Listed', value: filteredFoundations.length, icon: 'foundation', color: 'text-primary' },
            { label: 'Active Scholarships', value: opportunities.filter(o => ['FOUNDATION_SCHOLARSHIP','CORPORATE_CSR'].includes(o.type)).length, icon: 'payments', color: 'text-secondary' },
            { label: 'Verified 2026', value: filteredFoundations.filter(f => f.verificationStatus === 'VERIFIED' || f.verificationStatus === 'ACTIVE').length, icon: 'verified', color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5 border border-surface-variant text-sm">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
              <strong className={`font-bold ${s.color}`}>{s.value}</strong>
              <span className="text-on-surface-variant">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-96 px-3 py-2 rounded-xl bg-surface-container-low border border-surface-variant">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            type="text"
            placeholder="Search foundations (e.g. Sabari, JKKN, RIT, Agni)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs md:text-sm text-on-surface w-full placeholder:text-outline"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {focusTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFocus(tag)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFocus === tag
                  ? 'bg-primary text-white font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tag === 'ALL' ? 'All Focus Areas' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-600 font-semibold">{error}</div>
      )}

      {/* Foundations Grid */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold px-1">
            <span>Showing <strong className="text-primary">{filteredFoundations.length}</strong> foundations</span>
            {searchQuery && <span>Results for "<strong>{searchQuery}</strong>"</span>}
          </div>
          {filteredFoundations.length === 0 ? (
            <Card className="p-12 text-center border border-surface-variant space-y-4">
              <span className="material-symbols-outlined text-5xl text-outline">foundation</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">No Foundations Found</h3>
              <p className="text-xs text-on-surface-variant">Try clearing your search or filter.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedFocus('ALL'); }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFoundations.map((foundation) => {
                const oppCount = getOppCount(foundation.id);
                return (
                  <Card key={foundation.id} className="p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start gap-3.5">
                        {foundation.logoUrl ? (
                          <img
                            src={foundation.logoUrl}
                            alt={foundation.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-surface-variant shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-[28px]">foundation</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-headline-sm text-base font-bold text-primary leading-snug line-clamp-2">
                            {foundation.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                            {foundation.location || foundation.state || 'Tamil Nadu'}
                          </p>
                        </div>
                      </div>

                      <VerificationBadge status={foundation.verificationStatus} />

                      {/* Mission / Description */}
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {foundation.mission || foundation.description || foundation.whoTheySupport || '—'}
                      </p>

                      {/* Focus Areas */}
                      {(foundation.focusAreas || []).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                            Grant &amp; Scholarship Areas
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {foundation.focusAreas.map((area: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary border border-surface-variant"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Official Website */}
                      {(foundation.officialWebsiteUrl || foundation.officialWebsite) && (
                        <a
                          href={foundation.officialWebsiteUrl || foundation.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Official Website
                        </a>
                      )}
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-4 border-t border-surface-variant space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-outline">Active Scholarships:</span>
                        <strong className="text-primary font-bold">{oppCount > 0 ? `${oppCount} Available` : 'Verify for 2026'}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/foundations/${foundation.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                        </Link>
                        <Link to={`/opportunities?provider=${foundation.id}&type=FOUNDATION_SCHOLARSHIP`} className="w-full">
                          <Button variant="primary" size="sm" className="w-full">Scholarships</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
