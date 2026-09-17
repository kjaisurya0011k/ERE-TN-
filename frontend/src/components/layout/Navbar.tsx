import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-[0px_4px_20px_rgba(26,35,126,0.06)]">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="ERE-TN - Education Revolution & Evolution – Tamil Nadu">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-primary tracking-tight block leading-tight">
              ERE-TN
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-secondary -mt-0.5 tracking-wide">
              Education Revolution &amp; Evolution – Tamil Nadu
            </span>
            <span className="sm:hidden text-[9px] font-semibold text-secondary -mt-0.5 tracking-wider uppercase">
              Discover • Apply • Achieve
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links - Role Driven */}
        <nav className="hidden xl:flex items-center gap-1">
          {/* Public Visitor Navigation */}
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Home
              </Link>
              <Link
                to="/opportunities"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/opportunities')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Opportunity
              </Link>
              <Link
                to="/sessions"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/sessions') || isActive('/meetings')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Sessions
              </Link>
              <Link
                to="/mentors"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/mentors')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Mentors
              </Link>
            </>
          )}

          {/* Student Navigation */}
          {user?.role === 'STUDENT' && (
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Home
              </Link>
              <Link
                to="/student/opportunities"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/student/opportunities')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Opportunity
              </Link>
              <Link
                to="/student/sessions"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/student/sessions') || isActive('/sessions')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Sessions
              </Link>
              <Link
                to="/student/courses"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/student/courses') || isActive('/learning')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Courses
              </Link>
            </>
          )}

          {/* Mentor Navigation */}
          {user?.role === 'MENTOR' && (
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Home
              </Link>
              <Link
                to="/opportunities"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/opportunities')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Opportunity
              </Link>
              <Link
                to="/sessions"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/sessions') || isActive('/mentor/dashboard')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Sessions
              </Link>
              <Link
                to="/learning"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/learning')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Courses
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Home
              </Link>
              <Link
                to="/admin/opportunities"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/opportunities')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Opportunity
              </Link>
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/dashboard')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Sessions
              </Link>
              <Link
                to="/learning"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/learning')
                    ? 'text-primary bg-primary-fixed/60 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Courses
              </Link>
            </>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <LanguageSelector />

          {/* Primary CTA for Visitors / Students */}
          <Button
            size="sm"
            onClick={() => navigate('/opportunities?eligibility=true')}
            className="hidden sm:inline-flex shadow-[0px_4px_15px_rgba(26,35,126,0.18)]"
            leftIcon={<span className="material-symbols-outlined text-[18px]">search_check</span>}
          >
            {t('nav.checkEligibility')}
          </Button>

          {/* Auth State / Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-surface-variant hover:bg-surface-container transition-all"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-lg object-cover border border-primary/20"
                />
                <span className="hidden md:inline text-xs font-bold text-primary max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-[0px_10px_30px_rgba(26,35,126,0.15)] border border-surface-variant py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-surface-variant">
                    <p className="text-xs font-bold text-on-surface">{user.fullName}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-secondary-fixed text-on-secondary-fixed uppercase">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'STUDENT' && (
                    <>
                      <Link
                        to="/student/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                        <span>Student Dashboard</span>
                      </Link>
                      <Link
                        to="/student/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-indigo-600">bookmark</span>
                        <span>Saved Opportunities</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'MENTOR' && (
                    <>
                      <Link
                        to="/mentor/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
                        <span>Mentor Dashboard</span>
                      </Link>
                      <Link
                        to="/mentor/availability"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-blue-600">schedule</span>
                        <span>Manage Availability</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'ADMIN' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary-fixed/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        <span>Admin Console</span>
                      </Link>
                      <Link
                        to="/admin/opportunities"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_search</span>
                        <span>Opportunity Manager</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-surface-variant mt-1 text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register/student" className="hidden sm:inline-block">
                <Button variant="outline" size="sm">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-variant px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1 mb-4">
            {/* Student Navigation */}
            {user?.role === 'STUDENT' && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Home
                </Link>
                <Link
                  to="/student/opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Opportunity
                </Link>
                <Link
                  to="/student/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Sessions
                </Link>
                <Link
                  to="/student/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Courses
                </Link>
              </>
            )}

            {/* Mentor Navigation */}
            {user?.role === 'MENTOR' && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Home
                </Link>
                <Link
                  to="/opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Opportunity
                </Link>
                <Link
                  to="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Sessions
                </Link>
                <Link
                  to="/learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Courses
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Home
                </Link>
                <Link
                  to="/admin/opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Opportunity
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Sessions
                </Link>
                <Link
                  to="/learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Courses
                </Link>
              </>
            )}

            {/* Public Visitor Mobile Navigation */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Home
                </Link>
                <Link
                  to="/opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Opportunity
                </Link>
                <Link
                  to="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Sessions
                </Link>
                <Link
                  to="/mentors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Mentors
                </Link>
              </>
            )}
          </div>
          <Button
            size="md"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/opportunities?eligibility=true');
            }}
            className="w-full justify-center"
            leftIcon={<span className="material-symbols-outlined text-[18px]">search_check</span>}
          >
            {t('nav.checkEligibility')}
          </Button>
        </div>
      )}
    </header>
  );
};
export default Navbar;
