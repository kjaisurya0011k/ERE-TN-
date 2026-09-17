import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { opportunitiesApi, meetingsApi } from '../../services/api';
import { Opportunity } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { 
  Video, Calendar, Clock, Users, Play, ArrowRight, 
  CheckCircle, ShieldCheck, Sparkles, Bookmark, Compass
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [registeredMeetings, setRegisteredMeetings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'RECOMMENDED' | 'SAVED' | 'MEETINGS' | 'GOVT' | 'FOUNDATIONS' | 'NGOS'>('RECOMMENDED');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [oppsRes, savedRes, meetingsRes, regMeetingsRes] = await Promise.allSettled([
        opportunitiesApi.getAll(),
        opportunitiesApi.getSaved(),
        meetingsApi.getApprovedUpcoming(),
        meetingsApi.getRegistered()
      ]);

      if (oppsRes.status === 'fulfilled' && oppsRes.value) {
        setOpportunities(oppsRes.value);
      }
      if (savedRes.status === 'fulfilled' && savedRes.value) {
        setSavedOpportunities(savedRes.value);
      }
      if (meetingsRes.status === 'fulfilled' && meetingsRes.value) {
        setUpcomingMeetings(meetingsRes.value);
      }
      if (regMeetingsRes.status === 'fulfilled' && regMeetingsRes.value) {
        setRegisteredMeetings(regMeetingsRes.value);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMeeting = async (meetingId: string, title: string) => {
    try {
      await meetingsApi.register(meetingId);
      setActionMessage(`Registered for "${title}"!`);
      setTimeout(() => setActionMessage(null), 4000);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Could not register for meeting');
    }
  };

  // Categorized live opportunities
  const govtOpps = opportunities.filter((o) => 
    o.type === 'GOVERNMENT_SCHEME' || o.type === 'GOVERNMENT_SCHOLARSHIP' || o.type === 'EDUCATION_ASSISTANCE' || o.categoryTags?.some(t => t.includes('Govt') || t.includes('Board'))
  );
  const foundationOpps = opportunities.filter((o) => 
    o.type === 'FOUNDATION_SCHOLARSHIP' || o.providerName?.toLowerCase().includes('foundation') || o.providerName?.toLowerCase().includes('trust')
  );
  const ngoOpps = opportunities.filter((o) => 
    o.type === 'NGO_OPPORTUNITY' || o.providerName?.toLowerCase().includes('ngo')
  );

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white rounded-3xl p-6 md:p-10 shadow-[0px_10px_30px_rgba(26,35,126,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md text-white">
              Student Workspace
            </span>
            <span className="text-xs text-primary-fixed-dim font-medium">
              Profile: Active & Verified
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white">
            Welcome to ERE-TN, {user?.fullName || 'Student'} 👋
          </h1>
          <p className="text-xs md:text-sm text-primary-fixed-dim max-w-xl leading-relaxed">
            We discovered <strong>{opportunities.length} verified opportunities & schemes</strong> in PostgreSQL and <strong>{upcomingMeetings.length} live mentor sessions</strong> scheduled for your career roadmap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            variant="apply"
            onClick={() => navigate('/opportunities?eligibility=true')}
            className="shadow-lg whitespace-nowrap text-white font-bold"
            leftIcon={<span className="material-symbols-outlined text-[20px]">search_check</span>}
          >
            {t('hero.primaryCta')}
          </Button>
          <Link to="/meetings">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 whitespace-nowrap font-bold"
              leftIcon={<Video className="w-4 h-4 text-emerald-300" />}
            >
              Live Sessions ({upcomingMeetings.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{actionMessage}</p>
        </div>
      )}

      {/* Section: Live Mentor-Created Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Video className="w-6 h-6 text-blue-600" />
              Live Mentor Sessions & Group Masterclasses
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin-approved career workshops created by industry experts and verified mentors
            </p>
          </div>
          <Link to="/meetings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All ({upcomingMeetings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingMeetings.length === 0 ? (
          <Card className="p-8 text-center space-y-3 bg-white border border-slate-200">
            <Video className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No New Sessions Scheduled Today</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our verified mentors schedule interactive coding, placement and scholarship sessions regularly.
            </p>
            <Link to="/mentors">
              <Button size="sm" variant="outline">Browse Approved Mentors</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMeetings.map((meet) => {
              const isRegistered = registeredMeetings.some(r => r.id === meet.id) || meet.isUserRegistered;
              return (
                <div
                  key={meet.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        {meet.topic || 'Masterclass'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {meet.seatsAvailable} seats left
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm md:text-base leading-snug">
                      {meet.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {meet.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <img
                        src={meet.mentorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={meet.mentorName}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          {meet.mentorName}
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{meet.mentorRole}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        {meet.meetingDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        {meet.startTime} IST
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    {isRegistered ? (
                      <button
                        onClick={() => navigate(`/meetings/${meet.roomCode}/room`)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Join Live Room
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterMeeting(meet.id, meet.title)}
                        disabled={meet.seatsAvailable <= 0}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all disabled:opacity-50"
                      >
                        <span>{meet.seatsAvailable <= 0 ? 'Session Full' : 'Register Free'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Categorized Opportunities Discovery Streams */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-surface-variant pb-2">
          {[
            { id: 'RECOMMENDED', label: '⭐ Recommended Schemes' },
            { id: 'SAVED', label: `❤️ Saved Schemes (${savedOpportunities.length})` },
            { id: 'GOVT', label: '🏛️ Government Schemes & Assistance' },
            { id: 'FOUNDATIONS', label: '💎 Foundation Grants' },
            { id: 'NGOS', label: '🤝 NGO Programs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'RECOMMENDED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.slice(0, 6).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}

        {activeTab === 'SAVED' && (
          <div>
            {savedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center space-y-3 bg-white border border-slate-200">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No Saved Opportunities Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse opportunities and click the heart icon to save deadlines and set reminders.
                </p>
                <Link to="/opportunities">
                  <Button variant="outline" size="sm">Explore Schemes</Button>
                </Link>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'GOVT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {govtOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}

        {activeTab === 'FOUNDATIONS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundationOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}

        {activeTab === 'NGOS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngoOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>

      {/* Career Pathways & Mentorship Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-secondary" />
              Structured Career Roadmaps
            </h3>
            <Badge variant="primary" size="sm">Free Guidance</Badge>
          </div>
          <p className="text-sm font-bold text-slate-900">Cloud & DevOps Solutions Architect Roadmap</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Step-by-step milestone progression from Linux & Docker containerization to AWS multi-cloud architecture and Kubernetes.
          </p>
          <div className="pt-2 flex justify-end">
            <Link to="/career">
              <Button variant="primary" size="sm">View Visual Roadmap</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              1-on-1 Mentor Counselling
            </h3>
            <Badge variant="secondary" size="sm">Verified Experts</Badge>
          </div>
          <p className="text-sm font-bold text-slate-900">Connect with Senior Engineers & Professors</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Book free personalized 1-on-1 video guidance on higher studies, placement interviews, and resume reviews.
          </p>
          <div className="pt-2 flex justify-end">
            <Link to="/mentors">
              <Button variant="secondary" size="sm">Find a Mentor</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;

