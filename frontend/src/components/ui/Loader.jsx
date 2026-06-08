import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3'
  };
  return (
    <div
      className={`${sizes[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin ${className}`}
    />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

export const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <Spinner size="md" />
  </div>
);
