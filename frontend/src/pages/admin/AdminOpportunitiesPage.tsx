import React, { useState, useEffect } from 'react';
import { MOCK_OPPORTUNITIES, MOCK_PROVIDERS } from '../../data/mockData';
import { Opportunity, OpportunityType, VerificationStatus, GovernmentLevel, Provider } from '../../types';
import { opportunitiesApi, providersApi, adminApi } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, VerificationBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ShieldCheck, Plus, CheckCircle2, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State for creating new opportunity
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({
    title: '',
    providerId: 'prov-moe-india',
    type: 'GOVERNMENT_SCHOLARSHIP',
    governmentLevel: 'CENTRAL',
    description: '',
    eligibilitySummary: '',
    benefitsDescription: '',
    deadline: 'Ongoing',
    officialInfoUrl: '',
    officialApplyUrl: '',
    state: 'All India',
    verificationStatus: 'VERIFIED',
    lastVerifiedDate: '2026-08-22',
    requiredDocuments: ['Class 10/12 Marksheet', 'Income Certificate', 'Aadhaar Card', 'Admission Proof'],
    applicationProcess: ['Apply on official portal', 'Upload required certificates', 'Institution verification'],
    categoryTags: ['Higher Education', 'Scholarship'],
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await opportunitiesApi.getAll();
      if (data && data.length > 0) {
        setOpportunities(data);
      }
      const provs = await providersApi.getAll();
      if (provs && provs.length > 0) {
        setProviders(provs);
      }
    } catch {
      // Keep initial dataset
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = providers.find((p) => p.id === newOpp.providerId) || providers[0];
    const payload = {
      title: newOpp.title || 'New Opportunity',
      providerId: provider.id,
      governmentLevel: newOpp.governmentLevel || 'CENTRAL',
      type: newOpp.type || 'GOVERNMENT_SCHOLARSHIP',
      categoryTags: newOpp.categoryTags || ['General'],
      description: newOpp.description || newOpp.title || '',
      eligibilitySummary: newOpp.eligibilitySummary || '',
      benefitsDescription: newOpp.benefitsDescription || '',
      deadline: newOpp.deadline || 'Ongoing',
      officialInfoUrl: newOpp.officialInfoUrl || 'https://scholarships.gov.in',
      officialApplyUrl: newOpp.officialApplyUrl || 'https://scholarships.gov.in',
      state: newOpp.state || 'All India',
      verificationStatus: newOpp.verificationStatus || 'VERIFIED',
      requiredDocuments: newOpp.requiredDocuments || [],
      applicationProcess: newOpp.applicationProcess || [],
    };

    try {
      const created = await adminApi.createOpportunity(payload);
      setOpportunities([created, ...opportunities]);
      showToast(`Successfully published "${payload.title}" to ERE-TN database.`);
    } catch {
      const mockCreated: Opportunity = {
        id: 'opp-' + Date.now(),
        ...payload,
        provider: provider,
        isOngoing: true,
        lastVerifiedDate: '2026-08-22',
      } as Opportunity;
      setOpportunities([mockCreated, ...opportunities]);
      showToast(`Created "${payload.title}" in workspace.`);
    }
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: VerificationStatus) => {
    try {
      await adminApi.updateOpportunityStatus(id, newStatus);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, verificationStatus: newStatus, lastVerifiedDate: '2026-08-22' } : o))
      );
      showToast(`Opportunity status updated to ${newStatus}.`);
    } catch {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, verificationStatus: newStatus, lastVerifiedDate: '2026-08-22' } : o))
      );
      showToast(`Opportunity status updated to ${newStatus}.`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove/expire this opportunity record?')) {
      try {
        await adminApi.deleteOpportunity(id);
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
        showToast('Opportunity removed from active directory.');
      } catch {
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
        showToast('Opportunity removed.');
      }
    }
  };

  const filtered = opportunities.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = o.title?.toLowerCase().includes(q);
      const provMatch = o.provider?.name?.toLowerCase().includes(q);
      if (!titleMatch && !provMatch) return false;
    }
    if (selectedType !== 'ALL' && o.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-slate-700 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{actionSuccess}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-red-100 text-red-800">
              Admin Console
            </span>
            <span className="text-xs text-outline">PostgreSQL Opportunity Manager</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-primary">
            Opportunity & Scheme Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Opportunity
          </Button>
        </div>
      </div>

      {/* Mandatory Admin Anti-Hallucination & Verification Warning */}
      <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950">
          <h4 className="font-bold text-sm">Strict Grounding & Verification Policy</h4>
          <p className="leading-relaxed">
            All schemes in ERE-TN are backed by official Government gazettes, University Grants Commission notifications, or verified foundations. Never publish unverifiable application URLs or fabricated financial benefits.
          </p>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-extrabold text-primary">{opportunities.length}</p>
          <span className="text-xs text-outline">Total Active Records</span>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">
            {opportunities.filter((o) => o.verificationStatus === 'VERIFIED').length}
          </p>
          <span className="text-xs text-outline">Verified Official</span>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">
            {opportunities.filter((o) => o.verificationStatus === 'NEEDS_VERIFICATION').length}
          </p>
          <span className="text-xs text-outline">Pending Verification</span>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-extrabold text-secondary">{providers.length}</p>
          <span className="text-xs text-outline">Verified Providers</span>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-variant shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-80 px-3 py-2 rounded-lg bg-surface-container-low border border-surface-variant">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            type="text"
            placeholder="Search scheme name or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-on-surface w-full placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-outline font-semibold">Filter Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-variant bg-surface text-on-surface text-xs font-semibold"
          >
            <option value="ALL">All Types</option>
            <option value="GOVERNMENT_SCHEME">Government Schemes</option>
            <option value="GOVERNMENT_SCHOLARSHIP">Government Scholarships</option>
            <option value="EDUCATION_ASSISTANCE">Education Assistance & Loans</option>
            <option value="COLLEGE_SCHOLARSHIP">College Scholarships</option>
            <option value="FOUNDATION_SCHOLARSHIP">Foundation Scholarships</option>
            <option value="NGO_OPPORTUNITY">NGO Opportunities</option>
          </select>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-outline uppercase font-bold border-b border-surface-variant">
              <tr>
                <th className="p-4">Opportunity Name</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Type</th>
                <th className="p-4">Benefits</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {filtered.map((opp) => (
                <tr key={opp.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="p-4 font-bold text-primary max-w-xs">
                    <p className="line-clamp-1">{opp.title}</p>
                    <span className="text-[10px] text-outline font-normal">Last verified: {opp.lastVerifiedDate || '2026-08-22'}</span>
                  </td>
                  <td className="p-4 text-on-surface font-semibold max-w-[180px] truncate">
                    {opp.provider?.name || 'Verified Provider'}
                  </td>
                  <td className="p-4">
                    <Badge variant="primary" size="sm">
                      {opp.type ? opp.type.replace('_', ' ') : 'SCHOLARSHIP'}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium text-on-surface max-w-[160px] truncate">
                    {opp.benefitsDescription}
                  </td>
                  <td className="p-4">
                    <VerificationBadge status={opp.verificationStatus} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {opp.verificationStatus !== 'VERIFIED' ? (
                        <button
                          onClick={() => handleUpdateStatus(opp.id, 'VERIFIED')}
                          className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 text-[11px]"
                          title="Mark as Verified Official"
                        >
                          Verify ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(opp.id, 'DEMO_DATA')}
                          className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 text-[11px]"
                          title="Set Expired / Needs Review"
                        >
                          Expire
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(opp.id)}
                        className="p-1 rounded hover:bg-red-50 text-red-600"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Opportunity Record to PostgreSQL"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateOpportunity} className="space-y-4">
          <Input
            label="Opportunity Title / Scheme Name"
            required
            value={newOpp.title}
            onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
            placeholder="e.g. Central Sector Scheme of Scholarship"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Provider Organization"
              value={newOpp.providerId}
              onChange={(e) => setNewOpp({ ...newOpp, providerId: e.target.value })}
              options={providers.map((p) => ({ value: p.id, label: `${p.name} (${p.type})` }))}
            />

            <Select
              label="Opportunity Type"
              value={newOpp.type}
              onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value as OpportunityType })}
              options={[
                { value: 'GOVERNMENT_SCHEME', label: 'Government Scheme' },
                { value: 'GOVERNMENT_SCHOLARSHIP', label: 'Government Scholarship' },
                { value: 'EDUCATION_ASSISTANCE', label: 'Education Assistance & Loan' },
                { value: 'COLLEGE_SCHOLARSHIP', label: 'College Scholarship' },
                { value: 'FOUNDATION_SCHOLARSHIP', label: 'Foundation Scholarship' },
                { value: 'NGO_OPPORTUNITY', label: 'NGO Opportunity' },
                { value: 'FELLOWSHIP', label: 'Fellowship' },
                { value: 'INTERNSHIP', label: 'Internship' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Financial Benefits (e.g. ₹1,000/month or ₹1,50,000/yr)"
              required
              value={newOpp.benefitsDescription}
              onChange={(e) => setNewOpp({ ...newOpp, benefitsDescription: e.target.value })}
              placeholder="₹1,000 per month"
            />
            <Input
              label="Application Deadline (e.g. Ongoing or Verify on NSP)"
              required
              value={newOpp.deadline}
              onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
              placeholder="Ongoing"
            />
          </div>

          <Input
            label="Eligibility Summary"
            required
            value={newOpp.eligibilitySummary}
            onChange={(e) => setNewOpp({ ...newOpp, eligibilitySummary: e.target.value })}
            placeholder="Meritorious students scoring ≥ 80% with family income ≤ ₹4.5 LPA"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Information URL"
              type="url"
              required
              value={newOpp.officialInfoUrl}
              onChange={(e) => setNewOpp({ ...newOpp, officialInfoUrl: e.target.value })}
              placeholder="https://www.ugc.gov.in"
            />
            <Input
              label="Official Application URL"
              type="url"
              required
              value={newOpp.officialApplyUrl}
              onChange={(e) => setNewOpp({ ...newOpp, officialApplyUrl: e.target.value })}
              placeholder="https://scholarships.gov.in"
            />
          </div>

          <Select
            label="Verification Status"
            value={newOpp.verificationStatus}
            onChange={(e) => setNewOpp({ ...newOpp, verificationStatus: e.target.value as VerificationStatus })}
            options={[
              { value: 'VERIFIED', label: 'Verified Official (Checked with Source)' },
              { value: 'NEEDS_VERIFICATION', label: 'Needs Verification (Pending Review)' },
              { value: 'DEMO_DATA', label: 'Demo Data — Sample Record' },
            ]}
          />

          <Button size="lg" type="submit" className="w-full justify-center shadow-md font-bold">
            Save Opportunity to PostgreSQL
          </Button>
        </form>
      </Modal>
    </div>
  );
};
export default AdminOpportunitiesPage;
