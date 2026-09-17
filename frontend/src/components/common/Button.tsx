import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'apply' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-semibold tracking-wide',
    md: 'text-sm px-4 py-2.5 rounded-lg gap-2 font-semibold',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-bold tracking-tight',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 shadow-[0px_4px_20px_rgba(26,35,126,0.15)] hover:shadow-[0px_8px_25px_rgba(26,35,126,0.25)] focus:ring-primary',
    apply: 'bg-[#00B8D4] text-[#000666] font-bold hover:bg-[#00a6bf] hover:text-white shadow-sm focus:ring-[#00B8D4]',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary focus:ring-primary',
    danger: 'bg-error text-white hover:opacity-90 focus:ring-error',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
