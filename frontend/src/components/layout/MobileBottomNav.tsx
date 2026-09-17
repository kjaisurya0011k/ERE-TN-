import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const items = [
    { label: t('nav.home'), icon: 'home', path: '/' },
    { label: 'Explore', icon: 'explore', path: '/opportunities' },
    { label: 'Eligibility', icon: 'verified', path: '/opportunities?eligibility=true', isSpecial: true },
    { label: t('nav.counselling'), icon: 'support_agent', path: '/mentors' },
    { label: isAuthenticated ? 'Profile' : 'Login', icon: 'account_circle', path: isAuthenticated ? '/about' : '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant/80 shadow-[0px_-4px_20px_rgba(26,35,126,0.06)] px-2 py-1">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const active =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path.split('?')[0]);

          if (item.isSpecial) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined text-[22px] filled">search_check</span>
                </div>
                <span className="text-[10px] font-bold text-primary mt-0.5">Eligibility</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${active ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
