import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const PricingPage: React.FC = () => {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">
          💎 Transparent Membership
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Always Free for Government Opportunities
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          We believe government welfare information and scholarships belong to every student. Access 100% of verified welfare schemes for free forever, or upgrade for 1-on-1 mentorship.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* FREE TIER */}
        <Card className="p-8 flex flex-col justify-between space-y-6 border-2 border-surface-variant">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface uppercase">
                Free Forever
              </span>
              <h3 className="font-display text-2xl font-bold text-primary">Student Essential</h3>
              <p className="text-xs text-on-surface-variant">
                Full access to all government scholarships, schemes, and basic career tools.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-primary">₹0</span>
              <span className="text-xs text-outline font-semibold">/ lifetime</span>
            </div>

            {/* Features list */}
            <ul className="space-y-3 text-xs text-on-surface">
              {[
                '100% Verified Government Schemes (Tamil Nadu & Central)',
                'Rule-Based Eligibility Checker (All 15+ Parameters)',
                'Save & Track Opportunity Deadlines',
                'Access to Public ERE-TN Future Talks Webinars',
                'Foundational Self-Paced Courses (Python, SQL)',
                'NOVA AI Scholarship Assistant',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 font-medium">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled mt-0.5">check_circle</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/register" className="block w-full">
            <Button variant="outline" size="lg" className="w-full justify-center">
              Get Started Free
            </Button>
          </Link>
        </Card>

        {/* PRO TIER */}
        <Card
          featured
          className="p-8 flex flex-col justify-between space-y-6 border-2 border-secondary shadow-[0px_20px_50px_rgba(132,58,180,0.15)] relative"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed uppercase">
                  ERE-TN Pro
                </span>
                <span className="text-[11px] font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">
                  Most Popular
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-primary">Career Accelerator</h3>
              <p className="text-xs text-on-surface-variant">
                For students who want 1-on-1 mentorship, resume reviews, and placement mock interviews.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-secondary">₹499</span>
              <span className="text-xs text-outline font-semibold">/ month</span>
            </div>

            {/* Features list */}
            <ul className="space-y-3 text-xs text-on-surface">
              {[
                'Everything included in Free Forever',
                '2 Monthly 1-on-1 Mentorship & Counselling Sessions',
                'Direct Student-Mentor Chat & Q&A Access',
                'Personalized Resume & GitHub Portfolio Review',
                'Full Access to Advanced Career Roadmaps & Code Projects',
                'Placement Mock Technical Interviews & Feedback',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 font-medium">
                  <span className="material-symbols-outlined text-secondary text-[18px] filled mt-0.5">check_circle</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/register" className="block w-full">
            <Button variant="primary" size="lg" className="w-full justify-center shadow-lg">
              Upgrade to ERE-TN Pro
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
