import React from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

const HomePage: React.FC = () => {
  const features = [
    { name: 'AI Research Assistant', description: 'Leverage Google Search to get up-to-the-minute information on any topic, summarized and organized for you.', path: '/ai-research', icon: '🔎' },
    { name: 'YouTube Script Generator', description: 'Turn your research into an engaging, well-structured YouTube script with a single click. Customize word count and tone.', path: '/script-generator', icon: '✍️' },
    { name: 'Content Idea Generator', description: 'Never run out of ideas. Get a list of trending, high-interest topics relevant to your niche, powered by real-time data.', path: '/content-ideas', icon: '💡' },
  ];

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Supercharge Your Content Creation with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mt-2">
            Vikas Speaks AI
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          An all-in-one suite of AI-powered tools designed to help you research, write, and ideate faster and smarter. Built with the power of Google's Gemini API.
        </p>
        <div className="mt-8">
          <Link to="/ai-research">
            <GradientButton>Get Started for Free</GradientButton>
          </Link>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Link key={feature.name} to={feature.path} className="block p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </>
  );
};

export default HomePage;