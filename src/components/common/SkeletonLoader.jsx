import React from 'react';

export const SkeletonCard = ({ rows = 3 }) => {
  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/10 dark:border-white/5 rounded-2xl p-4 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-forest-100 dark:bg-white/10 rounded-md w-1/3"></div>
        <div className="h-4 bg-forest-100 dark:bg-white/10 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-forest-100/60 dark:bg-white/5 rounded-md w-3/4"></div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="h-10 bg-forest-50 dark:bg-white/5 rounded-xl"></div>
        <div className="h-10 bg-forest-50 dark:bg-white/5 rounded-xl"></div>
        <div className="h-10 bg-forest-50 dark:bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/10 dark:border-white/5 rounded-2xl p-4 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-5 bg-forest-100 dark:bg-white/10 rounded-md w-1/4"></div>
        <div className="h-5 bg-forest-100 dark:bg-white/10 rounded-md w-16"></div>
      </div>
      <div className="h-40 bg-forest-50 dark:bg-white/5 rounded-xl flex items-end justify-between p-3 gap-2">
        <div className="w-full bg-forest-200/50 dark:bg-white/10 rounded h-1/3"></div>
        <div className="w-full bg-forest-200/50 dark:bg-white/10 rounded h-1/2"></div>
        <div className="w-full bg-forest-200/50 dark:bg-white/10 rounded h-4/5"></div>
        <div className="w-full bg-forest-200/50 dark:bg-white/10 rounded h-3/5"></div>
        <div className="w-full bg-forest-200/50 dark:bg-white/10 rounded h-1/4"></div>
      </div>
    </div>
  );
};
