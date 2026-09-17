import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video, Users, Calendar, Clock, Globe, Award,
  CheckCircle2, ArrowRight, Sparkles, Filter, ShieldCheck, Play, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { meetingsApi } from '../../services/api';

export const MeetingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await meetingsApi.getApprovedUpcoming();
      setMeetings(data || []);
    } catch {
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (meeting: any) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/meetings');
      return;
    }

    try {
      setRegisteringId(meeting.id);
      await meetingsApi.register(meeting.id);
      setSuccessMessage(`Successfully registered for "${meeting.title}"!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      fetchMeetings();
    } catch (err: any) {
      alert(err.message || 'Could not register for meeting');
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (filterType === 'ALL') return true;
    return m.meetingType === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Video className="w-3.5 h-3.5" />
              {t('meetings.title')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {t('meetings.title')}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              {t('meetings.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Admin Approved Mentors
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Users className="w-4 h-4 text-blue-400" />
                Live Q&A & Hands-On Guidance
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Award className="w-4 h-4 text-amber-400" />
                Free Participation for Students
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold text-sm">{successMessage}</p>
          </div>
        )}

        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
            {[
              { id: 'ALL', label: 'All Sessions' },
              { id: 'CAREER_GUIDANCE', label: 'Career Roadmaps' },
              { id: 'INTERVIEW_PREP', label: 'Interview & Coding' },
              { id: 'SCHOLARSHIP_MASTERCLASS', label: 'Scholarship Clinics' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {user?.role === 'MENTOR' && (
            <button
              onClick={() => navigate('/mentor/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <Video className="w-4 h-4" />
              {t('meetings.hostSession')}
            </button>
          )}
        </div>

        {/* Meetings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-72" />
            ))}
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Online Career Sessions Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              New verified sessions are scheduled weekly. Check back soon or request a 1-on-1 session with a mentor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredMeetings.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      <Sparkles className="w-3 h-3" />
                      {m.topic}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Users className="w-3 h-3" />
                      {m.seatsAvailable} {t('meetings.seatsLeft')}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Mentor Info */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                    <img
                      src={m.mentorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={m.mentorName}
                      className="w-11 h-11 rounded-full object-cover border border-white shadow-sm"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {m.mentorName}
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-xs text-slate-500 font-medium line-clamp-1">{m.mentorRole}</div>
                    </div>
                  </div>

                  {/* Date, Time, Language */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <div className="flex items-center gap-1.5 bg-slate-100/70 p-2.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{m.meetingDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100/70 p-2.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{m.startTime} IST</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100/70 p-2.5 rounded-lg">
                      <Globe className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">{m.language || 'English'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
                  {m.isUserRegistered ? (
                    // Registered: show Join Session
                    m.meetingPlatform === 'EXTERNAL_URL' && m.meetingUrl ? (
                      <a
                        href={m.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-sm hover:bg-emerald-700 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Join Session
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(`/meetings/${m.roomCode}/room`)}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-sm hover:bg-emerald-700 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {t('meetings.joinRoom')}
                      </button>
                    )
                  ) : (
                    // Not registered
                    <button
                      onClick={() => handleRegister(m)}
                      disabled={registeringId === m.id || m.seatsAvailable <= 0}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white text-xs font-extrabold shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {registeringId === m.id ? (
                        'Registering...'
                      ) : m.seatsAvailable <= 0 ? (
                        'Session Full'
                      ) : (
                        <>
                          {t('meetings.registerFree')}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MeetingsPage;
