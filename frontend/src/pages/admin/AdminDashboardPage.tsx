import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Video, Check, X, AlertCircle,
  Calendar, RefreshCw, ExternalLink, ChevronDown
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const STATUS_BADGE: Record<string, string> = {
  APPROVED: 'bg-emerald-100 text-emerald-800',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-100 text-slate-600',
  COMPLETED: 'bg-blue-100 text-blue-700',
  DRAFT: 'bg-slate-100 text-slate-500',
};

export const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage();

  const [stats, setStats] = useState<any>({ totalStudents: 0, totalMentors: 0, pendingMentors: 0, totalOpportunities: 0, pendingMeetings: 0 });
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<any[]>([]);
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'mentors' | 'pending_sessions' | 'all_sessions'>('mentors');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Rejection dialog state
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => { loadAdminData(); }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, mentorsRes, pendingRes, allRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getPendingMentors(),
        adminApi.getPendingMeetings(),
        adminApi.getAllMeetings(),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (mentorsRes.status === 'fulfilled') setPendingMentors(mentorsRes.value || []);
      if (pendingRes.status === 'fulfilled') setPendingMeetings(pendingRes.value || []);
      if (allRes.status === 'fulfilled') setAllMeetings(allRes.value || []);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleApproveMentor = async (id: string) => {
    try { await adminApi.updateMentorStatus(id, 'APPROVED'); showSuccess('Mentor approved!'); loadAdminData(); }
    catch (err: any) { alert(err.message || 'Failed'); }
  };

  const handleRejectMentor = async (id: string) => {
    try { await adminApi.updateMentorStatus(id, 'REJECTED'); showSuccess('Mentor rejected.'); loadAdminData(); }
    catch (err: any) { alert(err.message || 'Failed'); }
  };

  const handleApproveSession = async (id: string) => {
    try {
      await adminApi.updateMeetingStatus(id, 'APPROVED');
      showSuccess('Session approved and published to students!');
      loadAdminData();
    } catch (err: any) { alert(err.message || 'Failed'); }
  };

  const openRejectDialog = (session: any) => {
    setRejectTarget({ id: session.id, title: session.title });
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectionReason.trim()) { alert('Please enter a rejection reason.'); return; }
    try {
      setRejectLoading(true);
      await adminApi.updateMeetingStatus(rejectTarget.id, 'REJECTED', rejectionReason.trim());
      showSuccess('Session rejected. Mentor has been notified.');
      setRejectTarget(null);
      setRejectionReason('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setRejectLoading(false);
    }
  };

  const tabs = [
    { id: 'mentors', label: `Pending Mentors (${pendingMentors.length})` },
    { id: 'pending_sessions', label: `Pending Sessions (${pendingMeetings.length})` },
    { id: 'all_sessions', label: `All Sessions (${allMeetings.length})` },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('adminDashboard.title')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Administration & Approval Console</h1>
            <p className="text-slate-300 text-sm mt-1">Audit mentor registrations, review online sessions, and oversee opportunities</p>
          </div>
          <button onClick={loadAdminData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Action Alert */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold text-sm">{actionMessage}</p>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: t('adminDashboard.pendingMentors'), value: pendingMentors.length, color: 'text-amber-600' },
            { label: t('adminDashboard.pendingMeetings'), value: pendingMeetings.length, color: 'text-blue-600' },
            { label: t('adminDashboard.totalStudents'), value: `${stats.totalStudents || 50000}+`, color: 'text-slate-900' },
            { label: t('adminDashboard.totalOpportunities'), value: `${stats.totalOpportunities || 500}+`, color: 'text-emerald-600' },
          ].map((c, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.label}</div>
              <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Pending Mentors */}
        {activeTab === 'mentors' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Mentor Credentials Awaiting Verification
            </h2>
            {pendingMentors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">🎉 All mentor applications reviewed!</div>
            ) : (
              <div className="space-y-4">
                {pendingMentors.map(m => (
                  <div key={m.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900">{m.fullName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase">PENDING</span>
                      </div>
                      <div className="text-xs text-slate-600">{m.titleRole} at <strong>{m.companyOrInstitution}</strong> • {m.yearsOfExperience} yrs • {m.qualification}</div>
                      <div className="text-xs text-slate-500 font-mono">{m.email}</div>
                      <p className="text-xs text-slate-600 italic">"{m.bio}"</p>
                      {m.expertiseTags && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.expertiseTags.map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleApproveMentor(m.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all">
                        <Check className="w-4 h-4" /> {t('adminDashboard.approve')}
                      </button>
                      <button onClick={() => handleRejectMentor(m.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all">
                        <X className="w-4 h-4" /> {t('adminDashboard.reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Sessions */}
        {activeTab === 'pending_sessions' && (
          <SessionsTable
            title="Online Sessions Awaiting Admin Approval"
            sessions={pendingMeetings}
            onApprove={handleApproveSession}
            onReject={openRejectDialog}
            showActions
            statusBadge={STATUS_BADGE}
          />
        )}

        {/* Tab 3: All Sessions */}
        {activeTab === 'all_sessions' && (
          <SessionsTable
            title="All Sessions"
            sessions={allMeetings}
            onApprove={handleApproveSession}
            onReject={openRejectDialog}
            showActions={false}
            statusBadge={STATUS_BADGE}
          />
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Reject Session</h3>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-3">
                You are rejecting: <strong>"{rejectTarget.title}"</strong>.<br/>
                The mentor will be notified with your reason.
              </p>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Reason *</label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain what needs to be changed or why the session cannot be approved..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-red-400 text-sm resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setRejectTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">Cancel</button>
              <button onClick={handleConfirmReject} disabled={rejectLoading || !rejectionReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm disabled:opacity-50">
                {rejectLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: reusable sessions table
const SessionsTable: React.FC<{
  title: string;
  sessions: any[];
  onApprove: (id: string) => void;
  onReject: (session: any) => void;
  showActions: boolean;
  statusBadge: Record<string, string>;
}> = ({ title, sessions, onApprove, onReject, showActions, statusBadge }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
      <Video className="w-5 h-5 text-indigo-600" /> {title}
    </h2>
    {sessions.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm">🎉 No sessions in this view.</div>
    ) : (
      <div className="space-y-4">
        {sessions.map(s => (
          <div key={s.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-slate-900">{s.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${statusBadge[s.status] || 'bg-slate-100 text-slate-600'}`}>
                  {s.status?.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Host: <strong>{s.mentorName}</strong> • Topic: <span className="font-semibold text-blue-600">{s.topic}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {s.meetingDate} {s.startTime && `at ${s.startTime}`} {s.endTime && `→ ${s.endTime}`}
                • Max {s.maxParticipants} seats
              </div>
              {/* Platform & URL */}
              {s.meetingPlatform && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 font-semibold text-[10px] uppercase">{s.meetingPlatform?.replace('_', ' ')}</span>
                  {s.meetingUrl && (
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold">
                      <ExternalLink className="w-3 h-3" /> Preview Meeting URL
                    </a>
                  )}
                </div>
              )}
              {s.description && <p className="text-xs text-slate-600 line-clamp-2 mt-1">{s.description}</p>}
              {s.rejectionReason && (
                <div className="mt-1 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  <strong>Rejection Reason:</strong> {s.rejectionReason}
                </div>
              )}
            </div>

            {(showActions || s.status === 'PENDING_APPROVAL') && (
              <div className="flex items-center gap-2 shrink-0">
                {s.status === 'PENDING_APPROVAL' && (
                  <>
                    <button onClick={() => onApprove(s.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => onReject(s)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminDashboardPage;
