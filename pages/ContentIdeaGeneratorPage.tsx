
import React, { useState, useEffect, useRef } from 'react';
import { generateContentIdeas, generateQuickIdeas } from '../services/geminiService';
import type { ContentIdea, HistoryEntry } from '../types';
import { CONTENT_CATEGORIES } from '../constants';
import GradientButton from '../components/GradientButton';
import { SkeletonCard, SkeletonListItem } from '../components/SkeletonLoader';
import { ClockIcon, LightbulbIcon, TrendingUpIcon, BoltIcon } from '../components/icons';
import HistorySidebar from '../components/HistorySidebar';

const ContentIdeaGeneratorPage: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [quickIdeas, setQuickIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuickLoading, setIsQuickLoading] = useState<boolean>(false);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [isMoreQuickLoading, setIsMoreQuickLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const ideasContainerRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('contentIdeaHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const saveToHistory = (newIdeas: ContentIdea[], newQuickIdeas: string[]) => {
    if (newIdeas.length === 0 && newQuickIdeas.length === 0) return;

    const newEntry: HistoryEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      category,
      ideas: newIdeas,
      quickIdeas: newQuickIdeas,
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory];
      try {
        localStorage.setItem('contentIdeaHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    if(window.confirm("Are you sure you want to clear your entire generation history? This cannot be undone.")) {
        setHistory([]);
        try {
            localStorage.removeItem('contentIdeaHistory');
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
        setIsHistoryOpen(false); // Close sidebar after clearing
    }
  };

  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await generateContentIdeas(category, []);
      setIdeas(newIdeas);
      saveToHistory(newIdeas, []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreIdeas = async () => {
    setIsMoreLoading(true);
    setError(null);
    try {
        const existingTitles = ideas.map(idea => idea.title);
        const newIdeas = await generateContentIdeas(category, existingTitles);
        setIdeas(prevIdeas => [...prevIdeas, ...newIdeas]);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsMoreLoading(false);
    }
  };

  const handleGenerateQuickIdeas = async () => {
    setIsQuickLoading(true);
    setError(null);
    try {
        const newQuickIdeas = await generateQuickIdeas(category, []);
        setQuickIdeas(newQuickIdeas);
        saveToHistory([], newQuickIdeas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsQuickLoading(false);
    }
  };

  const handleLoadMoreQuickIdeas = async () => {
    setIsMoreQuickLoading(true);
    setError(null);
    try {
        const newQuickIdeas = await generateQuickIdeas(category, quickIdeas);
        setQuickIdeas(prevQuickIdeas => [...prevQuickIdeas, ...newQuickIdeas]);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsMoreQuickLoading(false);
    }
  };


  useEffect(() => {
    setIdeas([]);
    setQuickIdeas([]);
    setError(null);
  }, [category]);


  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Content Idea Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get trending, high-interest topics powered by real-time data from Google.
          </p>
        </div>

        <div className="sticky top-[65px] bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-4 space-y-4">
          <div className="flex justify-center flex-wrap gap-2">
            {CONTENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                  category === cat.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-4 border-y border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex items-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 transition-all duration-300"
          >
            <ClockIcon />
            <span className="ml-2">View Generation History</span>
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Ideas Column */}
          <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detailed Content Blueprints</h2>
              <GradientButton onClick={handleGenerateIdeas} disabled={isLoading || isMoreLoading} className="w-full">
                  {isLoading ? 'Generating Ideas...' : '✨ Generate Detailed Ideas'}
              </GradientButton>
              <div ref={ideasContainerRef} className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)
                  ) : ideas.length > 0 ? (
                    ideas.map((idea, index) => (
                      <div 
                        key={index} 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Title */}
                        <div className="flex items-start space-x-4 mb-3">
                          <LightbulbIcon className="h-7 w-7 text-orange-400 flex-shrink-0 mt-0.5" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{idea.title}</h3>
                        </div>
                    
                        {/* Description */}
                        {idea.description && (
                          <div className="pl-11 mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{idea.description}</p>
                          </div>
                        )}
                    
                        {/* Bullet Points */}
                        {idea.bulletPoints && idea.bulletPoints.length > 0 && (
                          <div className="pl-11 mb-4">
                            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Talking Points</h4>
                            <ul className="space-y-2 text-sm">
                              {idea.bulletPoints.map((point, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-orange-500 mr-2 font-bold">›</span>
                                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    
                        {/* Relevance */}
                        {idea.relevance && (
                          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700/50 pl-11">
                            <TrendingUpIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <p className="text-xs italic text-gray-500 dark:text-gray-400">{idea.relevance}</p>
                          </div>
                        )}
                      </div>
                  ))
                  ) : (
                    <div className="text-center text-gray-500 py-10">Select a category and click generate.</div>
                  )}
                  {isMoreLoading && Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
              {ideas.length > 0 && !isLoading && (
                  <GradientButton onClick={handleLoadMoreIdeas} disabled={isMoreLoading} className="w-full">
                      {isMoreLoading ? 'Loading More...' : 'Load More Detailed Ideas'}
                  </GradientButton>
              )}
          </div>

          {/* Quick Ideas Column */}
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick-Fire Ideas</h2>
              <GradientButton onClick={handleGenerateQuickIdeas} disabled={isQuickLoading || isMoreQuickLoading} className="w-full">
                  {isQuickLoading ? 'Generating...' : '⚡ Generate Quick Ideas'}
              </GradientButton>
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full min-h-[200px]">
                  {isQuickLoading ? (
                     Array.from({ length: 10 }).map((_, index) => <SkeletonListItem key={index} />)
                  ) : quickIdeas.length > 0 ? (
                    <div className="space-y-1">
                      {quickIdeas.map((idea, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-3 py-3 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0 animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <BoltIcon className="h-5 w-5 text-orange-400 flex-shrink-0" />
                          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{idea}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="text-center text-gray-500 pt-10">Your quick ideas will appear here.</div>
                  )}
                  {isMoreQuickLoading && <div className="pt-3 space-y-3">{Array.from({ length: 5 }).map((_, index) => <SkeletonListItem key={index} />)}</div>}
              </div>
              {quickIdeas.length > 0 && !isQuickLoading && (
                  <GradientButton onClick={handleLoadMoreQuickIdeas} disabled={isMoreQuickLoading} className="w-full">
                      {isMoreQuickLoading ? 'Loading More...' : 'More Quick Ideas'}
                  </GradientButton>
              )}
          </div>
        </div>
      </div>
      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onClear={handleClearHistory} />
    </>
  );
};

export default ContentIdeaGeneratorPage;