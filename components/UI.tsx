import React from 'react';

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-sm ${className}`}>
    <div className={`${noPadding ? '' : 'p-6'}`}>
      {children}
    </div>
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 border border-transparent shadow-sm",
    secondary: "bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{label}</label>}
    <input 
      className={`bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border text-gray-900 dark:text-white text-sm rounded-md p-2.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all ${className}`}
      {...props}
    />
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; type?: 'success' | 'danger' | 'neutral' }> = ({ children, type = 'neutral' }) => {
  const styles = {
    success: "text-trade-up bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30",
    danger: "text-trade-down bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30",
    neutral: "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium border rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
};