import React from 'react';
import { YouTubeIcon, TwitterIcon, LinkedInIcon } from './components/icons';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'AI Research', path: '/ai-research' },
  { name: 'Script Generator', path: '/script-generator' },
  { name: 'Content Ideas', path: '/content-ideas' },
  { name: 'About', path: '/about' },
];

export const SOCIAL_LINKS = [
  { name: 'YouTube', url: 'https://youtube.com/@vikasspeaks45', icon: <YouTubeIcon /> },
  { name: 'Twitter', url: '#', icon: <TwitterIcon /> },
  { name: 'LinkedIn', url: '#', icon: <LinkedInIcon /> },
];

export const CONTENT_CATEGORIES = [
  { id: 'all', name: 'All Topics' },
  { id: 'ai', name: '🤖 AI & Tech' },
  { id: 'self-improvement', name: '📈 Self-Improvement' },
  { id: 'productivity', name: '🧠 Productivity' },
  { id: 'motivation', name: '🔥 Motivation' },
];