import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENTORS } from '../../data/mockData';
import { MentorProfile } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { mentorApi, counsellingApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const MentorsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [bookingMentor, setBookingMentor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('10:00');
  const [bookingTopic, setBookingTopic] = useState('CAREER');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const domains = ['ALL', 'Cloud Computing', 'Data Science', 'Full Stack', 'Career Roadmap'];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const data = await mentorApi.getApprovedMentors();
      setMentors(data || []);
    } catch {
      setMentors(MOCK_MENTORS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (mentor: any) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/mentors');
      return;
    }
    setBookingMentor(mentor);
    setBookingError(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingMentor) return;

    try {
      setBookingLoading(true);
      setBookingError(null);

      await counsellingApi.bookSession({
        mentorId: bookingMentor.userId || bookingMentor.id,
        sessionDate: bookingDate,
        startTime: bookingSlot.length === 5 ? `${bookingSlot}:00` : bookingSlot,
        sessionType: bookingTopic,
        notes: bookingNotes || `Discussion with ${bookingMentor.fullName}`
      });

      setBookingMentor(null);
      setIsBookedModalOpen(true);
    } catch (err: any) {
      setBookingError(err.message || 'Slot collision: Mentor is already booked for this time. Please choose another slot.');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    if (selectedDomain === 'ALL') return true;
    const tags = mentor.expertiseTags || [];
    return tags.some((t: string) => t.toLowerCase().includes(selectedDomain.toLowerCase()));
  });

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">
          🤝 1-on-1 Student Guidance
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          {t('mentors.title')}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          {t('mentors.subtitle')}
        </p>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedDomain === domain
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container-lowest border border-surface-variant text-on-surface hover:bg-surface-container'
            }`}
          >
            {domain === 'ALL' ? 'All Mentors' : domain}
          </button>
        ))}
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Mentor Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={mentor.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-sm flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-headline-sm text-base font-bold text-primary truncate">
                        {mentor.fullName}
                      </h3>
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] filled" title="Verified Mentor">
                        verified
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-semibold truncate">
                      {mentor.titleRole}
                    </p>
                    <p className="text-[11px] text-outline truncate">{mentor.companyOrInstitution}</p>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-variant text-xs">
                  <span className="font-semibold text-on-surface">
                    <strong>{mentor.yearsOfExperience || 5}</strong> yrs exp
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                    {mentor.ratingAvg || 4.9} ({mentor.reviewCount || 80} sessions)
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Expertise Tags */}
                {mentor.expertiseTags && mentor.expertiseTags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                      Expertise
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertiseTags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary border border-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {mentor.languagesSpoken && mentor.languagesSpoken.length > 0 && (
                  <div className="text-[11px] text-outline">
                    <span>Languages: </span>
                    <strong className="text-on-surface">{mentor.languagesSpoken.join(', ')}</strong>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="pt-3 border-t border-surface-variant space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-outline">Session Fee:</span>
                  <strong className="text-emerald-700 font-bold">Free for Students</strong>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleOpenBooking(mentor)}
                  className="w-full justify-center"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">calendar_add_on</span>}
                >
                  Book 1-on-1 Counselling
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={!!bookingMentor}
        onClose={() => setBookingMentor(null)}
        title={`Book Counselling with ${bookingMentor?.fullName}`}
        maxWidth="md"
      >
        {bookingMentor && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-variant text-xs space-y-1">
              <span className="font-bold text-primary block">{bookingMentor.fullName}</span>
              <span className="text-on-surface-variant">{bookingMentor.titleRole} • {bookingMentor.companyOrInstitution}</span>
              <span className="text-emerald-700 font-semibold block pt-1">
                Verified Mentor • Free 1-on-1 Guidance Session
              </span>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {bookingError}
              </div>
            )}

            <Input
              label="Select Session Date"
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />

            <Select
              label="Select Time Slot"
              value={bookingSlot}
              onChange={(e) => setBookingSlot(e.target.value)}
              options={[
                { value: '10:00', label: '10:00 AM – 10:45 AM' },
                { value: '14:00', label: '02:00 PM – 02:45 PM' },
                { value: '17:00', label: '05:00 PM – 05:45 PM' },
                { value: '19:00', label: '07:00 PM – 07:45 PM' },
              ]}
            />

            <Select
              label="Primary Discussion Topic"
              value={bookingTopic}
              onChange={(e) => setBookingTopic(e.target.value)}
              options={[
                { value: 'CAREER', label: 'Career Roadmap & Higher Studies' },
                { value: 'SCHOLARSHIP_GUIDANCE', label: 'Government & Foundation Scholarship Assistance' },
                { value: 'TECHNICAL_REVIEW', label: 'Technical Prep & Project Review' },
                { value: 'RESUME_MOCK_INTERVIEW', label: 'Resume Review & Mock Interview' },
              ]}
            />

            <Input
              label="Specific Questions / Topics for the Mentor"
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="e.g. Guidance on applying for Pudhumai Penn and preparing for campus interviews"
            />

            <Button
              size="md"
              type="submit"
              isLoading={bookingLoading}
              className="w-full justify-center"
            >
              Confirm Free Counselling Slot
            </Button>
          </form>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isBookedModalOpen}
        onClose={() => setIsBookedModalOpen(false)}
        maxWidth="sm"
      >
        <div className="text-center p-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px] filled">check_circle</span>
          </div>
          <h3 className="font-display text-xl font-bold text-primary">Counselling Confirmed!</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your 1-on-1 mentorship session has been scheduled in the ERE-TN system. You can review your bookings in your Student Dashboard.
          </p>
          <Button size="sm" onClick={() => setIsBookedModalOpen(false)} className="w-full justify-center">
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default MentorsPage;
