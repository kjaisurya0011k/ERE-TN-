import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { providersApi, opportunitiesApi } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge, VerificationBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const NGOsPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState('ALL');
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
        setError(err.message || 'Failed to load NGOs.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // NGOs = type NGO_NON_PROFIT or providerCategory NGO
  const ngos = providers.filter((p) =>
    p.type === 'NGO_NON_PROFIT' ||
    (p.providerCategory || '').toUpperCase() === 'NGO'
  );

  const areaTags = ['ALL', 'Teaching Fellowships', 'STEM Innovation', 'Rural Youth', 'Leadership', 'First Graduate', 'Girl Child Education'];

  const filteredNGOs = ngos.filter((n) => {
    const name = (n.name || '').toLowerCase();
    const desc = (n.description || '').toLowerCase();
    const focuses = (n.focusAreas || []).map((a: string) => a.toLowerCase());
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !focuses.some((a: string) => a.includes(q))) return false;
    }
    if (selectedArea !== 'ALL') {
      const sl = selectedArea.toLowerCase();
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
        <Badge variant="secondary" size="md">🤝 Non-Governmental Organizations (NGOs)</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Educational NGOs &amp; Fellowships
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Discover verified NGOs offering paid fellowships, student grants, community learning programs,
          and STEM innovation opportunities across Tamil Nadu and India.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: 'NGOs Listed', value: filteredNGOs.length, icon: 'groups', color: 'text-secondary' },
            { label: 'Active Programs', value: opportunities.filter(o => o.type === 'FOUNDATION_SCHOLARSHIP').length, icon: 'volunteer_activism', color: 'text-primary' },
            { label: 'Verified 2026', value: filteredNGOs.filter(f => ['VERIFIED','ACTIVE'].includes(f.verificationStatus)).length, icon: 'verified', color: 'text-emerald-600' },
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
            placeholder="Search NGOs (e.g. Teach For India, Agastya, Pratham)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs md:text-sm text-on-surface w-full placeholder:text-outline"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {areaTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedArea(tag)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedArea === tag
                  ? 'bg-secondary text-white font-bold'
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
      {error && <div className="text-center py-12 text-red-600 font-semibold">{error}</div>}

      {/* NGO Grid */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold px-1">
            <span>Showing <strong className="text-secondary">{filteredNGOs.length}</strong> NGOs</span>
            {searchQuery && <span>Results for "<strong>{searchQuery}</strong>"</span>}
          </div>

          {filteredNGOs.length === 0 ? (
            <Card className="p-12 text-center border border-surface-variant space-y-4">
              <span className="material-symbols-outlined text-5xl text-outline">groups</span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">No NGOs Found</h3>
              <p className="text-xs text-on-surface-variant">Try clearing your search or filter.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedArea('ALL'); }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNGOs.map((ngo) => {
                const oppCount = getOppCount(ngo.id);
                return (
                  <Card key={ngo.id} className="p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3.5">
                        {ngo.logoUrl ? (
                          <img
                            src={ngo.logoUrl}
                            alt={ngo.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-surface-variant shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-secondary text-[28px]">groups</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-headline-sm text-base font-bold text-primary leading-snug line-clamp-2">
                            {ngo.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                            {ngo.location || ngo.state || 'India'}
                          </p>
                        </div>
                      </div>

                      <VerificationBadge status={ngo.verificationStatus} />

                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {ngo.mission || ngo.description || ngo.whoTheySupport || '—'}
                      </p>

                      {(ngo.focusAreas || []).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                            Student Programs &amp; Focus
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {ngo.focusAreas.map((area: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-secondary border border-surface-variant"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(ngo.officialWebsiteUrl || ngo.officialWebsite) && (
                        <a
                          href={ngo.officialWebsiteUrl || ngo.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-secondary font-semibold hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Official Website
                        </a>
                      )}
                    </div>

                    <div className="pt-4 border-t border-surface-variant space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-outline">Open Opportunities:</span>
                        <strong className="text-secondary font-bold">{oppCount > 0 ? `${oppCount} Available` : 'Verify for 2026'}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/ngos/${ngo.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full">View NGO</Button>
                        </Link>
                        <Link to={`/opportunities?provider=${ngo.id}`} className="w-full">
                          <Button variant="secondary" size="sm" className="w-full">View Programs</Button>
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
