import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, Clock, Video, Plus, ShieldCheck,
  AlertTriangle, CheckCircle, XCircle, Star, Sparkles, Trash2,
  Layers, ExternalLink, RefreshCw, Edit2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { mentorApi, meetingsApi, counsellingApi } from '../../services/api';

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700 border border-amber-200',
  REJECTED: 'bg-red-50 text-red-700 border border-red-200',
  DRAFT: 'bg-slate-100 text-slate-600 border border-slate-200',
  CANCELLED: 'bg-slate-100 text-slate-500 border border-slate-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border border-blue-200',
};

const EMPTY_FORM = {
  title: '',
  description: '',
  topic: '',
  meetingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  startTime: '18:00',
  endTime: '19:00',
  maxParticipants: 50,
  language: 'English',
  targetAudience: '',
  meetingAgenda: '',
  meetingPlatform: 'EXTERNAL_URL',
  meetingUrl: '',
  notes: '',
};

export const MentorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({ totalBookings: 0, upcomingSessions: 0, completedSessions: 0, averageRating: 5.0 });
  const [meetings, setMeetings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSlot, setNewSlot] = useState({ dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '11:00' });
  const [savingAvailability, setSavingAvailability] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null); // null = create, string = resubmit
  const [meetingForm, setMeetingForm] = useState({ ...EMPTY_FORM });
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profData, statsData, meetData, bookData] = await Promise.allSettled([
        mentorApi.getOwnProfile(),
        mentorApi.getStats(),
        meetingsApi.getMentorMeetings(),
        counsellingApi.getMentorSessions(),
      ]);
      if (profData.status === 'fulfilled' && profData.value) {
        setProfile(profData.value);
        if (profData.value.availabilitySlots) setAvailabilitySlots(profData.value.availabilitySlots);
      }
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (meetData.status === 'fulfilled') setMeetings(meetData.value || []);
      if (bookData.status === 'fulfilled') setBookings(bookData.value || []);
    } catch {
      // silence — data stays empty
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMeetingId(null);
    setMeetingForm({ ...EMPTY_FORM });
    setUrlError(null);
    setShowModal(true);
  };

  const openResubmitModal = (m: any) => {
    setEditingMeetingId(m.id);
    setMeetingForm({
      title: m.title || '',
      description: m.description || '',
      topic: m.topic || '',
      meetingDate: m.meetingDate || EMPTY_FORM.meetingDate,
      startTime: m.startTime || '18:00',
      endTime: m.endTime || '19:00',
      maxParticipants: m.maxParticipants || 50,
      language: m.language || 'English',
      targetAudience: m.targetAudience || '',
      meetingAgenda: m.meetingAgenda || '',
      meetingPlatform: m.meetingPlatform || 'EXTERNAL_URL',
      meetingUrl: m.meetingUrl || '',
      notes: m.notes || '',
    });
    setUrlError(null);
    setShowModal(true);
  };

  const validateUrl = (url: string) => {
    if (meetingForm.meetingPlatform === 'EXTERNAL_URL') {
      if (!url || url.trim() === '') return 'Meeting URL is required for External URL platform.';
      if (!url.startsWith('https://')) return 'URL must start with https://';
    }
    return null;
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUrl(meetingForm.meetingUrl);
    if (err) { setUrlError(err); return; }
    setUrlError(null);
    try {
      setModalLoading(true);
      if (editingMeetingId) {
        await meetingsApi.resubmit(editingMeetingId, meetingForm);
        setMessage('Session resubmitted for Admin Review! Status: PENDING_APPROVAL');
      } else {
        await meetingsApi.create(meetingForm);
        setMessage('Session submitted for Admin Review! Status: PENDING_APPROVAL');
      }
      setShowModal(false);
      setMeetingForm({ ...EMPTY_FORM });
      setEditingMeetingId(null);
      setTimeout(() => setMessage(null), 6000);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Could not save session');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAvailability(true);
      const updated = [...availabilitySlots, newSlot];
      await mentorApi.updateAvailability(updated);
      setAvailabilitySlots(updated);
      setMessage('Availability slot added!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to add slot');
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleRemoveSlot = async (index: number) => {
    try {
      setSavingAvailability(true);
      const updated = availabilitySlots.filter((_, i) => i !== index);
      await mentorApi.updateAvailability(updated);
      setAvailabilitySlots(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove slot');
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleUpdateBookingStatus = async (sessionId: string, status: string) => {
    try {
      await counsellingApi.updateStatus(sessionId, status);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update session');
    }
  };

  const isApproved = profile?.verificationStatus === 'APPROVED';

  // Group meetings by status
  const groupedMeetings = {
    PENDING_APPROVAL: meetings.filter(m => m.status === 'PENDING_APPROVAL'),
    APPROVED: meetings.filter(m => m.status === 'APPROVED'),
    REJECTED: meetings.filter(m => m.status === 'REJECTED'),
    COMPLETED: meetings.filter(m => m.status === 'COMPLETED'),
    CANCELLED: meetings.filter(m => m.status === 'CANCELLED'),
    DRAFT: meetings.filter(m => m.status === 'DRAFT'),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t('mentorDashboard.title')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome, {user?.fullName || 'Mentor'}</h1>
            <p className="text-slate-300 text-sm mt-1">
              {profile?.titleRole || 'Industry Mentor'} • {profile?.companyOrInstitution || 'ERE-TN'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isApproved ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t('mentorDashboard.approved')}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> {t('mentorDashboard.pending')}
              </div>
            )}
            <button onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all">
              <Plus className="w-4 h-4" /> {t('mentorDashboard.createMeeting')}
            </button>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold text-sm">{message}</p>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: <Users className="w-5 h-5" />, value: stats.totalBookings, label: t('mentorDashboard.totalBookings'), color: 'blue' },
            { icon: <Clock className="w-5 h-5" />, value: stats.upcomingSessions, label: t('mentorDashboard.upcomingSessions'), color: 'amber' },
            { icon: <Video className="w-5 h-5" />, value: meetings.length, label: t('mentorDashboard.myMeetings'), color: 'purple' },
            { icon: <Star className="w-5 h-5" />, value: `${stats.averageRating || '5.0'}/5`, label: 'Avg Rating', color: 'emerald' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <div className="text-2xl font-black text-slate-900">{card.value}</div>
              <div className="text-xs text-slate-500 font-semibold">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Availability Slots */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Weekly Availability Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Set the days and time slots when students can book 1-on-1 counselling</p>
          </div>

          <form onSubmit={handleAddSlot} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Day of Week</label>
              <select value={newSlot.dayOfWeek} onChange={e => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-900 focus:outline-none focus:border-blue-600">
                {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(d => (
                  <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            {['startTime','endTime'].map(field => (
              <div key={field} className="w-32">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">{field === 'startTime' ? 'Start' : 'End'}</label>
                <input type="time" required value={(newSlot as any)[field]}
                  onChange={e => setNewSlot({ ...newSlot, [field]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
            ))}
            <button type="submit" disabled={savingAvailability}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50">
              <Plus className="w-4 h-4" /> {savingAvailability ? 'Saving...' : 'Add Slot'}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availabilitySlots.length === 0 ? (
              <div className="col-span-3 text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No recurring slots yet. Add one above.
              </div>
            ) : availabilitySlots.map((slot, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm hover:border-blue-300 transition-all">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase">{slot.dayOfWeek}</span>
                  <div className="text-xs font-bold text-slate-900 mt-1">{slot.startTime} – {slot.endTime}</div>
                </div>
                <button onClick={() => handleRemoveSlot(idx)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Online Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" /> {t('mentorDashboard.myMeetings')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">All scheduled sessions grouped by status</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadDashboardData} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={openCreateModal} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Schedule New
              </button>
            </div>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              You haven't scheduled any sessions yet. Click "Schedule New" to get started!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending */}
              {groupedMeetings.PENDING_APPROVAL.length > 0 && (
                <SessionGroup title="⏳ Pending Admin Approval" sessions={groupedMeetings.PENDING_APPROVAL} statusStyles={STATUS_STYLES} />
              )}
              {/* Approved */}
              {groupedMeetings.APPROVED.length > 0 && (
                <SessionGroup title="✅ Approved — Live to Students" sessions={groupedMeetings.APPROVED} statusStyles={STATUS_STYLES} />
              )}
              {/* Rejected */}
              {groupedMeetings.REJECTED.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">❌ Rejected — Edit & Resubmit</div>
                  <div className="space-y-3">
                    {groupedMeetings.REJECTED.map(m => (
                      <div key={m.id} className="p-4 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                            <div className="text-xs text-slate-500">{m.topic} • {m.meetingDate} at {m.startTime}</div>
                            {m.rejectionReason && (
                              <div className="mt-2 p-3 rounded-lg bg-red-100 border border-red-200 text-xs text-red-800">
                                <strong>Rejection Reason:</strong> {m.rejectionReason}
                              </div>
                            )}
                          </div>
                          <button onClick={() => openResubmitModal(m)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shrink-0 transition-all">
                            <Edit2 className="w-3.5 h-3.5" /> Edit & Resubmit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Completed / Cancelled */}
              {[...groupedMeetings.COMPLETED, ...groupedMeetings.CANCELLED, ...groupedMeetings.DRAFT].length > 0 && (
                <SessionGroup
                  title="📋 Completed / Cancelled / Draft"
                  sessions={[...groupedMeetings.COMPLETED, ...groupedMeetings.CANCELLED, ...groupedMeetings.DRAFT]}
                  statusStyles={STATUS_STYLES}
                />
              )}
            </div>
          )}
        </div>

        {/* 1-on-1 Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-indigo-600" /> 1-on-1 Mentorship Bookings
          </h2>
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No 1-on-1 counselling bookings yet. Update your availability slots above!
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-4">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{b.studentName}</div>
                    <div className="text-xs text-slate-500">{b.sessionDate} at {b.startTime} • {b.sessionType || 'Career Guidance'}</div>
                    {b.notes && <p className="text-xs text-slate-600 mt-1 italic">"{b.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status === 'REQUESTED' && (
                      <>
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Confirm</button>
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300">Decline</button>
                      </>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Mark Completed</button>
                    )}
                    <span className="text-xs font-bold text-slate-500 uppercase ml-2">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Resubmit Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                {editingMeetingId ? 'Edit & Resubmit Session' : 'Schedule New Online Session'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitMeeting} className="space-y-4 text-sm">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Title *</label>
                <input type="text" required value={meetingForm.title}
                  onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  placeholder="e.g. Breaking into AI & Cloud Computing in 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Domain *</label>
                <input type="text" required value={meetingForm.topic}
                  onChange={e => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                  placeholder="e.g. Software Engineering & Placements"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
              </div>

              {/* Date + Times + Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input type="date" required value={meetingForm.meetingDate}
                    onChange={e => setMeetingForm({ ...meetingForm, meetingDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
                  <input type="time" required value={meetingForm.startTime}
                    onChange={e => setMeetingForm({ ...meetingForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time *</label>
                  <input type="time" required value={meetingForm.endTime}
                    onChange={e => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Seats *</label>
                  <input type="number" min="5" max="500" required value={meetingForm.maxParticipants}
                    onChange={e => setMeetingForm({ ...meetingForm, maxParticipants: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
              </div>

              {/* Meeting Platform */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Platform *</label>
                <select value={meetingForm.meetingPlatform}
                  onChange={e => setMeetingForm({ ...meetingForm, meetingPlatform: e.target.value, meetingUrl: '' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs bg-white">
                  <option value="EXTERNAL_URL">External URL (Google Meet, Teams, Jitsi, etc.)</option>
                  <option value="BUILT_IN_WEBRTC">Built-in WebRTC Room</option>
                </select>
              </div>

              {/* Meeting URL — required only for EXTERNAL_URL */}
              {meetingForm.meetingPlatform === 'EXTERNAL_URL' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting URL * <span className="font-normal text-slate-400">(must start with https://)</span></label>
                  <input type="url" required value={meetingForm.meetingUrl}
                    onChange={e => { setMeetingForm({ ...meetingForm, meetingUrl: e.target.value }); setUrlError(null); }}
                    placeholder="https://meet.google.com/abc-def-ghi"
                    pattern="https://.*"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 focus:outline-none text-xs ${urlError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-600'}`} />
                  {urlError && <p className="text-red-600 text-[11px] mt-1 font-semibold">{urlError}</p>}
                  <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    This URL is only visible to registered students — never to the public.
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Learning Outcomes *</label>
                <textarea rows={3} required value={meetingForm.description}
                  onChange={e => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  placeholder="Explain key takeaways, target audience, and what students will learn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs resize-none" />
              </div>

              {/* Target Audience + Agenda (collapsible optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <input type="text" value={meetingForm.targetAudience}
                    onChange={e => setMeetingForm({ ...meetingForm, targetAudience: e.target.value })}
                    placeholder="e.g. Final year engineering students"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                  <input type="text" value={meetingForm.language}
                    onChange={e => setMeetingForm({ ...meetingForm, language: e.target.value })}
                    placeholder="English / Tamil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Agenda (optional)</label>
                <textarea rows={2} value={meetingForm.meetingAgenda}
                  onChange={e => setMeetingForm({ ...meetingForm, meetingAgenda: e.target.value })}
                  placeholder="Intro → Demo → Q&A..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 text-xs resize-none" />
              </div>

              {/* Approval notice */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
                <strong>Approval Required:</strong> Sessions are reviewed by administrators before becoming visible to students.
                {editingMeetingId && ' Resubmitting will clear the rejection and send for re-review.'}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={modalLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm disabled:opacity-50">
                  {modalLoading ? 'Submitting...' : editingMeetingId ? 'Resubmit for Approval' : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: simple session table group
const SessionGroup: React.FC<{ title: string; sessions: any[]; statusStyles: Record<string, string> }> = ({ title, sessions, statusStyles }) => (
  <div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="pb-3">Title</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Seats</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sessions.map(m => (
            <tr key={m.id} className="hover:bg-slate-50/50">
              <td className="py-3">
                <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                <div className="text-xs text-slate-500">{m.topic}</div>
              </td>
              <td className="py-3 text-xs font-medium text-slate-600">{m.meetingDate} at {m.startTime}</td>
              <td className="py-3 text-xs font-medium text-slate-600">{m.registeredCount || 0}/{m.maxParticipants}</td>
              <td className="py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyles[m.status] || 'bg-slate-100 text-slate-600'}`}>
                  {m.status?.replace('_', ' ')}
                </span>
              </td>
              <td className="py-3 text-right">
                {m.status === 'APPROVED' && (
                  <a href={m.meetingPlatform === 'EXTERNAL_URL' && m.meetingUrl ? m.meetingUrl : `/meetings/${m.roomCode}/room`}
                    target={m.meetingPlatform === 'EXTERNAL_URL' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
                    <Video className="w-3.5 h-3.5" /> Start
                  </a>
                )}
                {m.status === 'PENDING_APPROVAL' && (
                  <span className="text-xs text-amber-600 font-semibold">Under Review</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MentorDashboardPage;
