import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import { performResearch } from '../services/geminiService';
import GradientButton from '../components/GradientButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ResearchSkeleton } from '../components/SkeletonLoader';
import { SearchIcon, LinkIcon, ExclamationTriangleIcon } from '../components/icons';

const AIResearchPage: React.FC = () => {
  const { topic, setTopic, result, setResult, isLoading, setIsLoading, error, setError } = useResearch();
  const [localTopic, setLocalTopic] = useState(topic || '');
  const navigate = useNavigate();

  const handleResearch = async () => {
    if (!localTopic.trim()) {
      setError('Please enter a topic to research.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const researchResult = await performResearch(localTopic);
      setTopic(localTopic);
      setResult(researchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AI Research Assistant</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Enter a topic and let our AI scour the web for the latest information, insights, and data.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localTopic}
              onChange={(e) => setLocalTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleResearch()}
              placeholder="e.g., The future of renewable energy"
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border-2 border-transparent focus:border-orange-500 rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200"
              disabled={isLoading}
            />
          </div>
          <GradientButton onClick={handleResearch} disabled={isLoading || !localTopic.trim()} className="w-full sm:w-auto">
            {isLoading ? 'Researching...' : 'Run AI Research'}
          </GradientButton>
        </div>
      </div>

      {isLoading && <ResearchSkeleton />}

      {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg flex items-center space-x-3">
              <ExclamationTriangleIcon />
              <p><strong>Error:</strong> {error}</p>
          </div>
      )}

      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">Research for: <span className="text-orange-500">{topic}</span></h2>
            <MarkdownRenderer content={result.summary} />
            <div className="text-center mt-8">
              <GradientButton onClick={() => navigate('/script-generator')}>
                  Generate Script from this Research
              </GradientButton>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Sources</h3>
              <ul className="space-y-3">
                  {result.sources.map((source, index) => source.web && (
                      <li key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                              <div className="flex-shrink-0">
                                <LinkIcon />
                              </div>
                              <span className="text-blue-600 dark:text-blue-400 group-hover:text-orange-500 group-hover:underline truncate transition-colors">
                                  {source.web.title}
                              </span>
                          </a>
                      </li>

                  ))}
              </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResearchPage;