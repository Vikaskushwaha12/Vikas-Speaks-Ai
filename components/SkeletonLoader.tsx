import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50 animate-pulse">
    <div className="flex items-start space-x-4 mb-4">
      <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 mt-0.5"></div>
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
    <div className="pl-11 mb-4 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="pl-11 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
    </div>
  </div>
);


export const SkeletonListItem: React.FC = () => (
    <div className="flex items-center space-x-3 w-full">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
);

export const ResearchSkeleton: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);