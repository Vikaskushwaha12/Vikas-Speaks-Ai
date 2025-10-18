
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { ResearchContextType, ResearchResult } from '../types';

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topic, setTopic] = useState<string>('');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    topic,
    setTopic,
    result,
    setResult,
    script,
    setScript,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = (): ResearchContextType => {
  const context = useContext(ResearchContext);
  if (context === undefined) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
