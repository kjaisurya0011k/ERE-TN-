import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { MOCK_OPPORTUNITIES, MOCK_FUTURE_TALKS, MOCK_MENTORS, MOCK_ROADMAPS } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const featuredOpportunities = MOCK_OPPORTUNITIES.slice(0, 3);
  const nextTalk = MOCK_FUTURE_TALKS[0];

  return (
    <div className="flex flex-col gap-16 md:gap-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative hero-gradient pt-12 md:pt-20 pb-16 md:pb-24 border-b border-surface-variant/60">
        {/* Background ambient glow shapes */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-primary-fixed-dim shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-primary tracking-wide">
                  100% Verified Government Schemes & Scholarships
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-[1.12] tracking-tight">
                {t('hero.title')}
              </h1>

              <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/opportunities?eligibility=true')}
                  className="w-full sm:w-auto shadow-[0px_10px_30px_rgba(26,35,126,0.22)]"
                  leftIcon={<span className="material-symbols-outlined text-[22px]">search_check</span>}
                >
                  {t('hero.primaryCta')}
                </Button>
                <Link to="/opportunities" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('hero.secondaryCta')}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-surface-variant/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-on-surface-variant font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                  <span>Tamil Nadu & Central Schemes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px] filled">lock</span>
                  <span>Direct Official Application Links</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] filled">school</span>
                  <span>Free for All Students</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card / Interactive Teaser */}
            <div className="w-full lg:w-[460px] flex-shrink-0">
              <div className="relative">
                {/* Decorative blob */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-25" />
                <div className="relative bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_20px_50px_rgba(26,35,126,0.15)] border border-surface-variant">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-variant mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                        🎯
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">Instant Eligibility Match</h4>
                        <p className="text-[11px] text-on-surface-variant">Check in under 2 minutes</p>
                      </div>
                    </div>
                    <Badge variant="cyan" size="sm">Rule-Based</Badge>
                  </div>

                  <div className="space-y-3 text-xs mb-5">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                      <span className="font-semibold text-on-surface-variant">Tamil Nadu Govt School Student?</span>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Eligible: Pudhumai Penn / Pudhalvan</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                      <span className="font-semibold text-on-surface-variant">First Graduate in Family?</span>
                      <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Eligible: Tuition Concession</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                      <span className="font-semibold text-on-surface-variant">SC/ST Family Income &lt; ₹2.5L?</span>
                      <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Eligible: 100% Post-Matric Fee</span>
                    </div>
                  </div>

                  <Button
                    size="md"
                    onClick={() => navigate('/opportunities?eligibility=true')}
                    className="w-full justify-center"
                    rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                  >
                    Check All Matching Schemes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full -mt-8 md:-mt-16">
        <div className="bg-primary text-white rounded-2xl p-6 md:p-8 shadow-[0px_20px_50px_rgba(0,6,102,0.25)] grid grid-cols-2 md:grid-cols-4 gap-6 border border-primary-container">
          <div className="text-center space-y-1">
            <p className="font-display text-3xl md:text-4xl font-extrabold text-tertiary-fixed">{t('stats.totalOpportunities')}</p>
            <p className="text-xs md:text-sm text-primary-fixed-dim">{t('stats.opportunitiesLabel')}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-display text-3xl md:text-4xl font-extrabold text-secondary-fixed">{t('stats.scholarshipsDisbursed')}</p>
            <p className="text-xs md:text-sm text-primary-fixed-dim">{t('stats.scholarshipsLabel')}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-display text-3xl md:text-4xl font-extrabold text-tertiary-fixed">{t('stats.expertMentors')}</p>
            <p className="text-xs md:text-sm text-primary-fixed-dim">{t('stats.mentorsLabel')}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-display text-3xl md:text-4xl font-extrabold text-emerald-400">{t('stats.successRate')}</p>
            <p className="text-xs md:text-sm text-primary-fixed-dim">{t('stats.successLabel')}</p>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary" size="md">Everything In One Place</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary">
            How ERE-TN Powers Your Student Journey
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            From discovering welfare benefits to 1-on-1 mentoring and structured career roadmaps, we support every step of your education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">policy</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Government Welfare Schemes</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Explore Tamil Nadu state welfare schemes (Pudhumai Penn, Tamil Pudhalvan, 7.5% Govt school quota, Free education) and Central schemes with direct official portal links.
            </p>
            <Link to="/opportunities" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1">
              Explore Schemes <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Card>

          {/* Pillar 2 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Rule-Based Eligibility Checker</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Evaluate 15+ student profile criteria including category, marks, family income, nativity, and govt school background to find your guaranteed matches.
            </p>
            <button
              onClick={() => navigate('/opportunities?eligibility=true')}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1"
            >
              Check My Eligibility <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </Card>

          {/* Pillar 3 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">route</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Visual Career Roadmaps</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Follow step-by-step verified learning paths for Data Analytics, Full-Stack Software Engineering, Cloud, and AI with checklist trackers.
            </p>
            <Link to="/career" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1">
              View Roadmaps <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Card>

          {/* Pillar 4 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">support_agent</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">1-on-1 Mentor Counselling</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Connect with verified industry mentors and alumni from IITs, Anna University, and top tech companies for personalized guidance and resume review.
            </p>
            <Link to="/mentors" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1">
              Browse Mentors <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Card>

          {/* Pillar 5 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">live_tv</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">ERE-TN Future Talks</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Monthly live interactive webinars conducted by industry leaders and scholars on AI, Emerging Tech, Higher Studies, and Placements.
            </p>
            <Link to="/future-talks" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1">
              Join Next Talk <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Card>

          {/* Pillar 6 */}
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">menu_book</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Skill Development Courses</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Self-paced practical courses in Python, SQL, Modern Web Development, and AI Tools designed specifically for college students.
            </p>
            <Link to="/learning" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary pt-1">
              Start Learning <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Card>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="bg-surface-container-low py-16 border-y border-surface-variant/60">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="cyan" size="md" className="mb-2">Verified Schemes</Badge>
              <h2 className="font-display text-3xl font-extrabold text-primary">
                Featured Government Welfare & Scholarships
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Verified official schemes for school-completed and college students in Tamil Nadu and India.
              </p>
            </div>
            <Link to="/opportunities">
              <Button variant="outline" size="sm">
                View All {MOCK_OPPORTUNITIES.length}+ Opportunities
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Spotlight: Next Future Talk */}
      {nextTalk && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl p-6 md:p-10 shadow-[0px_20px_50px_rgba(26,35,126,0.2)] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-tertiary-fixed text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                Next Upcoming Future Talk
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                {nextTalk.title}
              </h3>
              <p className="text-xs md:text-sm text-primary-fixed-dim leading-relaxed">
                {nextTalk.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/90 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  {nextTalk.speakerName} ({nextTalk.speakerRole})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  {nextTalk.date} at {nextTalk.time}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 text-center space-y-3 w-full sm:w-auto">
              <Link to="/future-talks">
                <Button
                  variant="apply"
                  size="lg"
                  className="w-full sm:w-auto"
                  leftIcon={<span className="material-symbols-outlined text-[20px]">how_to_reg</span>}
                >
                  Register Free for Event
                </Button>
              </Link>
              <p className="text-[11px] text-primary-fixed-dim">
                {nextTalk.registeredCount} / {nextTalk.maxParticipants} students registered
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 border-2 border-primary/20 shadow-[0px_10px_30px_rgba(26,35,126,0.08)] text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-4xl">🚀</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary">
            Ready to Unlock Opportunities Tailored for You?
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Join thousands of Indian students using ERE-TN to discover government schemes, scholarships, internships, and career guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/opportunities?eligibility=true')}
              leftIcon={<span className="material-symbols-outlined text-[22px]">search_check</span>}
            >
              {t('hero.primaryCta')}
            </Button>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Create Free Student Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
