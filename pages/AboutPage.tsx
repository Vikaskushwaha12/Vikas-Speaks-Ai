import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <img
          src="https://i.ibb.co/3kC2g2m/profile-pic.png"
          alt="Vikas"
          className="w-36 h-36 rounded-full mx-auto mb-8 shadow-xl border-4 border-orange-500/50 transform transition-transform duration-500 hover:scale-105"
        />
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          About Vikas Speaks AI
        </h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          <p>
            Vikas Speaks AI is an all-in-one suite of AI-powered tools designed to supercharge content creation for YouTubers, marketers, and writers. Our mission is to streamline the creative process, from initial research to final script, allowing creators to focus on what they do best: creating amazing content.
          </p>
          <p>
            This application is built using the power of Google's Gemini API, leveraging its advanced capabilities for search grounding, text generation, and content ideation. We've combined cutting-edge AI with a user-friendly interface to make content production faster, smarter, and more efficient.
          </p>
          <h2 className="text-2xl font-bold mt-6 mb-3">Core Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>AI Research Assistant:</strong> Get up-to-the-minute, summarized information on any topic, complete with sources, powered by Google Search grounding.
            </li>
            <li>
              <strong>YouTube Script Generator:</strong> Instantly transform your research into a well-structured and engaging video script tailored to your audience.
            </li>
            <li>
              <strong>Content Idea Generator:</strong> Discover trending and high-interest content ideas to keep your channel fresh and your audience engaged.
            </li>
          </ul>
          <p>
            This project was developed to showcase the practical applications of large language models in real-world workflows. We hope you find these tools valuable in your content creation journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;