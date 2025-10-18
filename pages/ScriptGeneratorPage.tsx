import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import { generateScript } from '../services/geminiService';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { DownloadIcon, CopyIcon } from '../components/icons';
import MarkdownRenderer from '../components/MarkdownRenderer';

const ScriptGeneratorPage: React.FC = () => {
  const { topic, result, script, setScript, isLoading, setIsLoading, error, setError } = useResearch();
  const [wordLimit, setWordLimit] = useState<number>(500);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // This check can remain to handle direct navigation attempts
    if (!topic || !result) {
      // Allow navigation but the component will render the "no data" state
    }
  }, [topic, result]);
  
  const handleGenerateScript = async () => {
    if (!result) return;
    setIsLoading(true);
    setError(null);
    setScript('');

    try {
      const generatedScript = await generateScript(result.summary, topic, wordLimit);
      setScript(generatedScript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!script) return;
    navigator.clipboard.writeText(script).then(() => {
      setCopySuccess('Script copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy script.');
    });
  };

  const handleDownload = () => {
    if (!script) return;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!result || !topic) {
    return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">No Research Data Available</h2>
            <p className="text-gray-600 dark:text-gray-300 my-4">
              Please start by researching a topic first. Your research findings will appear here, ready to be turned into a script.
            </p>
            <GradientButton onClick={() => navigate('/ai-research')}>Go to AI Research</GradientButton>
        </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Research & Controls */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Research Summary</h2>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">{topic}</h3>
                <div className="max-h-96 overflow-y-auto pr-2">
                  <MarkdownRenderer content={result.summary} />
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Sources</h3>
                <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                    {result.sources.map((source, index) => source.web && (
                        <li key={index}>
                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-orange-500 hover:underline truncate block transition-colors">
                                {source.web.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-20">
                <h3 className="text-xl font-bold mb-4">Script Controls</h3>
                <div className="space-y-4">
                    <label htmlFor="word-limit" className="block font-medium text-gray-700 dark:text-gray-300">Select Word Limit:</label>
                    <select id="word-limit" value={wordLimit} onChange={(e) => setWordLimit(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400 dark:hover:border-orange-500">
                        <option value="300">~300 Words</option>
                        <option value="500">~500 Words</option>
                        <option value="1000">~1000 Words</option>
                    </select>
                    <GradientButton onClick={handleGenerateScript} disabled={isLoading} className="w-full">
                        {isLoading ? 'Generating...' : 'Generate Script'}
                    </GradientButton>
                </div>
            </div>
        </div>

        {/* Right Column: Script Output */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h2 className="text-2xl font-bold">Generated Script</h2>
                    {script && !isLoading && (
                        <div className="flex items-center space-x-2">
                            <button onClick={handleCopyToClipboard} className="flex items-center text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-all duration-200 transform hover:scale-105">
                                <CopyIcon /> Copy
                            </button>
                            <button onClick={handleDownload} className="flex items-center text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-all duration-200 transform hover:scale-105">
                                <DownloadIcon /> Download
                            </button>
                        </div>
                    )}
                </div>
                {copySuccess && <div className="mb-4 text-green-600 dark:text-green-400 text-sm animate-pulse">{copySuccess}</div>}

                <div className="flex-grow">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full pt-16">
                            <LoadingSpinner />
                            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Crafting your script based on the research data...</p>
                        </div>
                    )}
                    {error && <div className="text-red-500 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}

                    {!isLoading && !script && !error && (
                        <div className="flex flex-col items-center justify-center h-full pt-16 text-center text-gray-500 dark:text-gray-400">
                            <p className="text-xl">Your script will appear here.</p>
                            <p>Adjust the settings on the left and click "Generate Script".</p>
                        </div>
                    )}

                    {script && (
                         <div className="overflow-y-auto max-h-[60vh] pr-2">
                           <MarkdownRenderer content={script} />
                         </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScriptGeneratorPage;