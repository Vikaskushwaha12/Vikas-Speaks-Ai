import type { Dispatch, SetStateAction } from 'react';

export interface Source {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ResearchResult {
  summary: string;
  sources: Source[];
}

export interface ContentIdea {
  title: string;
  bulletPoints: string[];
  description: string;
  relevance?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  category: string;
  ideas: ContentIdea[];
  quickIdeas: string[];
}

export interface ResearchContextType {
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  result: ResearchResult | null;
  setResult: Dispatch<SetStateAction<ResearchResult | null>>;
  script: string;
  setScript: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}