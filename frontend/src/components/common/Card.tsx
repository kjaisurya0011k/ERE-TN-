import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  featured = false,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface-container-lowest rounded-xl p-stack-md transition-all duration-300 border border-surface-variant/70 shadow-[0px_4px_20px_rgba(26,35,126,0.05)] relative overflow-hidden',
          hoverEffect && 'hover:shadow-[0px_10px_30px_rgba(26,35,126,0.12)] hover:-translate-y-0.5',
          featured && 'border-t-4 border-t-primary',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
