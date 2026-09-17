import React, { useState } from 'react';
import { MOCK_FUTURE_TALKS } from '../../data/mockData';
import { FutureTalk } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const FutureTalksPage: React.FC = () => {
  const [selectedTalk, setSelectedTalk] = useState<FutureTalk | null>(null);
  const [registeredTalkIds, setRegisteredTalkIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('edunova_registered_talks');
    return saved ? JSON.parse(saved) : [];
  });
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalk) return;

    const next = [...registeredTalkIds, selectedTalk.id];
    setRegisteredTalkIds(next);
    localStorage.setItem('edunova_registered_talks', JSON.stringify(next));
    setSelectedTalk(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white rounded-2xl p-8 md:p-12 shadow-[0px_20px_50px_rgba(26,35,126,0.2)] text-center space-y-4 max-w-4xl mx-auto">
        <Badge variant="cyan" size="md">
          🎙️ Live Interactive Masterclasses
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          ERE-TN Future Talks
        </h1>
        <p className="text-sm md:text-base text-primary-fixed-dim leading-relaxed max-w-2xl mx-auto">
          Join monthly live interactive sessions with top researchers, industry architects, and higher education leaders to discover breakthroughs in AI, Engineering, and Scholarships.
        </p>
      </div>

      {/* Talks Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">event</span>
            Upcoming Live Sessions
          </h2>
          <span className="text-xs font-semibold text-on-surface-variant">
            {MOCK_FUTURE_TALKS.length} Sessions Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MOCK_FUTURE_TALKS.map((talk) => {
            const isRegistered = registeredTalkIds.includes(talk.id);
            return (
              <Card key={talk.id} className="p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Top Badge & Domain */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
                      {talk.topicDomain}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      🟢 Registration Open
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-headline-sm text-xl font-bold text-primary leading-tight">
                    {talk.title}
                  </h3>

                  {/* Speaker Card */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-container-low border border-surface-variant">
                    <img
                      src={talk.speakerAvatarUrl}
                      alt={talk.speakerName}
                      className="w-12 h-12 rounded-full object-cover border border-primary/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-primary">{talk.speakerName}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">{talk.speakerRole}</p>
                      <p className="text-[11px] text-outline">{talk.speakerCompany}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {talk.description}
                  </p>
                </div>

                {/* Session Details & CTA */}
                <div className="pt-4 border-t border-surface-variant space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-on-surface">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                      <span>{talk.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                      <span>{talk.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-outline">
                      <span className="material-symbols-outlined text-[18px]">group</span>
                      <span>{talk.registeredCount} / {talk.maxParticipants}</span>
                    </div>
                  </div>

                  <Button
                    size="md"
                    variant={isRegistered ? 'secondary' : 'primary'}
                    onClick={() => {
                      if (!isRegistered) setSelectedTalk(talk);
                    }}
                    className="w-full justify-center"
                    leftIcon={
                      <span className="material-symbols-outlined text-[18px]">
                        {isRegistered ? 'check_circle' : 'how_to_reg'}
                      </span>
                    }
                  >
                    {isRegistered ? 'Registered (Zoom Link Sent)' : 'Register Free for Session'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={!!selectedTalk}
        onClose={() => setSelectedTalk(null)}
        title="Register for Future Talk"
        maxWidth="md"
      >
        {selectedTalk && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="p-3 bg-surface-container-low rounded-lg text-xs space-y-1">
              <span className="font-bold text-primary block">{selectedTalk.title}</span>
              <span className="text-on-surface-variant">Speaker: {selectedTalk.speakerName}</span>
              <span className="text-outline block">Date: {selectedTalk.date} at {selectedTalk.time}</span>
            </div>

            <Input
              label="Your Full Name"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Anandha Kumar"
            />

            <Input
              label="Email Address (for meeting link & calendar invite)"
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="anand@college.edu.in"
            />

            <Button size="md" type="submit" className="w-full justify-center">
              Confirm Free Registration
            </Button>
          </form>
        )}
      </Modal>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        maxWidth="sm"
      >
        <div className="text-center p-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px] filled">check_circle</span>
          </div>
          <h3 className="font-display text-xl font-bold text-primary">Registration Confirmed!</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We have confirmed your seat for this ERE-TN Future Talk. The meeting link and calendar reminder will be shared with you.
          </p>
          <Button size="sm" onClick={() => setIsSuccessModalOpen(false)} className="w-full justify-center">
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};
