
import React from 'react';
import type { HistoryEntry } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onClear }) => {
  const categoryMap: { [key: string]: string } = {
    'all': 'All Topics',
    'ai': '🤖 AI & Tech',
    'self-improvement': '📈 Self-Improvement',
    'productivity': '🧠 Productivity',
    'motivation': '🔥 Motivation',
  };
  
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generation History</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                <p>Your generation history is empty.</p>
                <p>Generated ideas will appear here.</p>
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(entry.date).toLocaleString()} - Category: <span className="font-semibold">{categoryMap[entry.category] || entry.category}</span>
                  </p>
                  <div className="space-y-2">
                    {entry.ideas.slice(0, 2).map((idea, index) => (
                      <p key={index} className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                        - {idea.title}
                      </p>
                    ))}
                    {entry.quickIdeas.slice(0, 3).map((idea, index) => (
                       <p key={index} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        - {idea}
                      </p>
                    ))}
                    {(entry.ideas.length > 2 || entry.quickIdeas.length > 3) && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">... and more</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClear}
                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
