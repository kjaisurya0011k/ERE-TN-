import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VerificationStatus, DeadlineStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cyan' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  icon,
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-medium rounded-full';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  const variantStyles = {
    primary: 'bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim',
    cyan: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim',
    success: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    error: 'bg-error-container text-on-error-container border border-red-300',
    neutral: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const VerificationBadge: React.FC<{ status: VerificationStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
            className
          )}
        >
          <span className="material-symbols-outlined text-emerald-600 text-[16px] filled">verified</span>
          VERIFIED OFFICIAL
        </span>
      );
    case 'DEMO_DATA':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm',
            className
          )}
          title="Demo Data — not for actual application"
        >
          <span className="material-symbols-outlined text-amber-600 text-[16px]">info</span>
          DEMO DATA
        </span>
      );
    case 'NEEDS_VERIFICATION':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200',
            className
          )}
        >
          <span className="material-symbols-outlined text-blue-600 text-[16px]">pending</span>
          PENDING VERIFICATION
        </span>
      );
    case 'EXPIRED_CLOSED':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300',
            className
          )}
        >
          <span className="material-symbols-outlined text-gray-500 text-[16px]">cancel</span>
          EXPIRED / CLOSED
        </span>
      );
  }
};

export const DeadlineTrafficBadge: React.FC<{
  deadline: string;
  isOngoing?: boolean;
  status?: DeadlineStatus;
  className?: string;
}> = ({ deadline, isOngoing, status = 'OPEN', className }) => {
  if (isOngoing) {
    return (
      <span className={twMerge('inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200', className)}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Always Open (Rolling)
      </span>
    );
  }

  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
        status === 'CLOSING_SOON' && 'text-red-700 bg-red-50 border-red-200',
        status === 'CLOSING_THIS_MONTH' && 'text-amber-700 bg-amber-50 border-amber-200',
        status === 'OPEN' && 'text-blue-700 bg-blue-50 border-blue-200',
        status === 'EXPIRED' && 'text-gray-600 bg-gray-50 border-gray-200',
        className
      )}
    >
      <span
        className={clsx(
          'w-2 h-2 rounded-full',
          status === 'CLOSING_SOON' && 'bg-red-500 animate-ping',
          status === 'CLOSING_THIS_MONTH' && 'bg-amber-500',
          status === 'OPEN' && 'bg-blue-500',
          status === 'EXPIRED' && 'bg-gray-400'
        )}
      ></span>
      <span>Deadline: {deadline}</span>
    </span>
  );
};
