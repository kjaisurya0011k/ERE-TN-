import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-tertiary text-on-tertiary mt-auto pt-16 pb-24 md:pb-12 border-t border-tertiary-container">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-400 flex items-center justify-center text-primary font-bold shadow">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <div>
                  <span className="font-display text-2xl font-extrabold text-white tracking-tight block leading-tight">
                    ERE-TN
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-300 block">
                    Education Revolution &amp; Evolution – Tamil Nadu
                  </span>
                </div>
              </div>
              <p className="text-sm text-on-tertiary/80 leading-relaxed max-w-sm">
              Empowering students across Tamil Nadu and India to discover verified scholarships, government welfare schemes, career roadmaps, and verified mentors.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Verified Official Data
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                100% Free Schemes
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-on-tertiary/80">
              <li>
                <Link to="/opportunities" className="hover:text-tertiary-fixed transition-colors">
                  All Opportunities
                </Link>
              </li>
              <li>
                <Link to="/opportunities?state=Tamil+Nadu" className="hover:text-tertiary-fixed transition-colors">
                  Tamil Nadu Schemes
                </Link>
              </li>
              <li>
                <Link to="/opportunities?state=Central" className="hover:text-tertiary-fixed transition-colors">
                  Central Scholarships
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-tertiary-fixed transition-colors">
                  Career Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-tertiary-fixed transition-colors">
                  Find a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Key TN Schemes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
              Top TN Welfare Schemes
            </h4>
            <ul className="space-y-2 text-sm text-on-tertiary/80">
              <li>
                <Link to="/opportunities/tn-pudhumai-penn-2024" className="hover:text-tertiary-fixed transition-colors">
                  Pudhumai Penn Scheme
                </Link>
              </li>
              <li>
                <Link to="/opportunities/tn-tamil-pudhalvan-2024" className="hover:text-tertiary-fixed transition-colors">
                  Tamil Pudhalvan Scheme
                </Link>
              </li>
              <li>
                <Link to="/opportunities/tn-first-graduate-concession" className="hover:text-tertiary-fixed transition-colors">
                  First Graduate Concession
                </Link>
              </li>
              <li>
                <Link to="/opportunities/tn-post-matric-sc-st" className="hover:text-tertiary-fixed transition-colors">
                  Post-Matric SC/ST Support
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
              Portals & Support
            </h4>
            <ul className="space-y-2 text-sm text-on-tertiary/80">
              <li>
                <Link to="/login" className="hover:text-tertiary-fixed transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/mentor/login" className="hover:text-tertiary-fixed transition-colors">
                  Mentor Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-tertiary-fixed transition-colors">
                  Admin Verification Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-tertiary-fixed transition-colors">
                  Data Accuracy & Trust Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Official Disclaimer */}
        <div className="border-t border-tertiary-container pt-8 pb-6">
          <div className="bg-tertiary-container/60 rounded-xl p-4 border border-tertiary-fixed/20 mb-6">
            <p className="text-xs text-on-tertiary/90 leading-relaxed">
              <strong className="text-tertiary-fixed">Important Notice & Disclaimer:</strong> {t('disclaimer.official')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-tertiary/60">
            <p>© {new Date().getFullYear()} ERE-TN • Education Revolution &amp; Evolution – Tamil Nadu. Discover. Apply. Achieve.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                Verification Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
