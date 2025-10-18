
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ResearchProvider } from './context/ResearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AIResearchPage from './pages/AIResearchPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import ContentIdeaGeneratorPage from './pages/ContentIdeaGeneratorPage';
import AboutPage from './pages/AboutPage';
import MarkdownRenderer from './components/MarkdownRenderer'; // Ensure component is part of build

const App: React.FC = () => {
  return (
    <ResearchProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ai-research" element={<AIResearchPage />} />
              <Route path="/script-generator" element={<ScriptGeneratorPage />} />
              <Route path="/content-ideas" element={<ContentIdeaGeneratorPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ResearchProvider>
  );
};

export default App;