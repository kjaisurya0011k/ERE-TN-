import React from 'react';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">
          🏛️ About ERE-TN
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          “Discover. Apply. Achieve.”
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          ERE-TN (Education Revolution &amp; Evolution – Tamil Nadu) is built to empower Indian students—beginning with school-completed and college students across Tamil Nadu and expanding nationwide—by providing transparent, verified access to government welfare, scholarships, and career mentorship.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-primary">Uncompromising Trust</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Every official scheme is rigorously verified against state gazettes and official department websites. We never fabricate eligibility rules, benefits, or deadlines.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">equalizer</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-primary">Equal Educational Access</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Prioritizing first-generation graduates, rural students, government school alumni, and underprivileged communities to ensure no talent goes unsupported.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">psychology</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-primary">Holistic Student Growth</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Beyond scholarships, we provide visual career roadmaps, 1-on-1 industry mentorship, practical skill courses, and monthly Future Talks.
          </p>
        </Card>
      </div>

      {/* Verification Policy Block */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-surface-variant shadow-sm space-y-4 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">gavel</span>
          Our Data Accuracy & Official Source Guarantee
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
          ERE-TN partners strictly with official government publications and trusted institutional portals. Every opportunity listed as <strong className="text-emerald-700">VERIFIED OFFICIAL</strong> contains:
        </p>
        <ul className="list-disc list-inside text-xs text-on-surface space-y-1.5 pl-2 font-medium">
          <li>Direct link to the official state or central department portal (e.g. NSP, TNeGA, ADW).</li>
          <li>Accurate eligibility criteria vetted against current official notifications.</li>
          <li>Last verification timestamp indicating when our team audited the record.</li>
          <li>Clear distinction for demo records marked as <strong>DEMO DATA — NOT FOR ACTUAL APPLICATION</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
