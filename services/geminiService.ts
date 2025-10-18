import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ResearchResult, ContentIdea, Video } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const performResearch = async (topic: string): Promise<ResearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Act as a professional AI research assistant. I need you to research the following topic:

"${topic}"

Search for the latest (2024-2025) real-world, accurate, non-biased information from reputable online sources. Provide:

- A brief summary
- 5-7 key points with headings
- 2-3 important statistics or trends
- Real use cases (if possible)
- Include URLs or sources if available

Keep it informative and concise.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { summary, sources };
  } catch (error) {
    console.error("Error performing research:", error);
    throw new Error("Failed to fetch research data from Gemini API.");
  }
};

export const generateScript = async (
  researchData: string,
  topic: string,
  wordLimit: number
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a scriptwriter for a YouTube educational channel.

Based on this research input:

${researchData}

Write an engaging script in clear, motivating tone. Include:

- Quick intro to hook the audience
- Clear body structure with transitions
- A strong closing call-to-action
- Make tone suitable for a Self-growth and AI Productivity YouTube audience

Restrict output to about ${wordLimit} words.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script from Gemini API.");
  }
};

export const generateContentIdeas = async (category: string = 'all', existingTitles: string[] = []): Promise<ContentIdea[]> => {
  try {
    const model = 'gemini-2.5-flash';

    const categoryMap: { [key: string]: string } = {
        'ai': 'AI & Tech Tutorials',
        'self-improvement': 'Self-Improvement',
        'productivity': 'Productivity',
        'motivation': 'Motivation & Mindset'
    };

    const categoryInstruction = category === 'all'
      ? 'one or more of the pillars listed below'
      : `the "${categoryMap[category]}" pillar`;
    
    const existingIdeasInstruction = existingTitles.length > 0
        ? `
---
IMPORTANT: You have already provided the following list of titles. DO NOT repeat these ideas or similar concepts. Generate completely fresh content.
Existing Titles:
${existingTitles.map(t => `- "${t}"`).join('\n')}
---
`
        : '';


    const prompt = `You are an expert content strategist and creative assistant.  
You help create **highly clickable, valuable, real-time content ideas** for a multimedia channel (YouTube, short videos, blogs, courses, etc.).

Your task is to generate ideas for ${categoryInstruction}.

🧩 Channel Niche + Topics:
Create across 4 main pillars of content:

1. 🤖 AI & Tech Tutorials
   - AI tools and use cases (e.g., Gemini, GPT, Midjourney, Runway ML)
   - Comparisons, how-to's, walkthroughs
   - Future-of-tech discussions
   - Automation/No-code tools for creators and professionals

2. 📈 Self-Improvement
   - Mental clarity, self-discipline, long-term growth
   - Challenge videos, life experiments
   - Dopamine detox, digital minimalism
   - Concepts from books like Atomic Habits, Deep Work

3. 🧠 Productivity
   - Study smarter (for students), work smarter (for professionals)
   - Time-blocking, time management frameworks
   - Use of Notion, calendar systems, AI daily planners
   - Combos like "AI + Productivity Hacks"

4. 🔥 Motivation & Mindset
   - Growth mindset topics
   - Morning routines, journaling, visualization
   - Reels that make people get up & act
   - Gym/work motivation with voiceover scripts and story-based ideas

---

🎯 Audience:
Your ideas must appeal to motivated digital-age learners like:
- Students
- Digital creators / new YouTubers
- Tech lovers
- Productivity hackers
- Self-growth enthusiasts
- Remote workers

They are ambitious, curious, self-driven but need clear ideas to execute.

${existingIdeasInstruction}

---

💻 HIGH-QUALITY EXAMPLES (Follow this style and format for your JSON output):

**Example 1 for AI & Tech:**
{
  "title": "Gemini vs GPT-4 Turbo – Which AI Should You Use in 2025?",
  "bulletPoints": [
    "Side-by-side prompt comparison",
    "Performance test + UI analysis",
    "Beginner-friendly walkthrough with real use cases"
  ],
  "description": "This comparison is exploding on Twitter: creators are ditching one tool for another. Why?",
  "relevance": "Trending on Twitter and in tech creator communities."
}

**Example 2 for AI & Tech:**
{
  "title": "5 AI Chrome Extensions That Work Smarter Than You",
  "bulletPoints": [
    "Covers writing, research, and coding assistants.",
    "Focuses on free or freemium tools.",
    "Includes a controversial pick that might surprise viewers."
  ],
  "description": "Stop manually doing tasks that your browser can automate for you. Here are 5 extensions that feel like cheating.",
  "relevance": "Trending on r/ChromeExtensions and LinkedIn this week."
}

**Example 3 for Self-Improvement:**
{
  "title": "I Tried Andrew Huberman’s Dopamine Detox + AI Stack – My Productivity Jumped 🔥",
  "bulletPoints": [
    "Combines neuroscience + digital detox for a 7-day challenge.",
    "How I used AI to automate goal planning and tracking.",
    "Actionable steps for students & entrepreneurs."
  ],
  "description": "A 7-day challenge video combining popular neuroscience trends with practical AI automation for measurable results.",
  "relevance": "Connects two high-interest topics: Huberman's protocols and AI tools."
}

**Example 4 for Productivity:**
{
  "title": "Daily Systems That Actually Beat Procrastination (Not Just Talk About It)",
  "bulletPoints": [
    "Focuses on actionable systems, not just motivation.",
    "Provides templates for Notion or other tools.",
    "Appeals to anyone struggling with focus in the digital age."
  ],
  "description": "Not another motivational video — this is about raw systems that beat dopamine loops. Includes free tool templates.",
  "relevance": "Addresses a timeless, highly relatable problem with a practical, 'no-fluff' angle."
}

**Example 5 for Motivation:**
{
  "title": "No One’s Coming to Save You – And That’s Good.",
  "bulletPoints": [
    "Uses a build-up → punchline script format.",
    "Emotion-first, story-based narrative.",
    "Ends with a powerful message about self-reliance."
  ],
  "description": "This format has gone viral on Short-form Reels. It's an emotion-first, story-based script that ends with a powerful punchline about self-awareness.",
  "relevance": "Taps into a viral script format popular on Reels and TikTok."
}

**Example 6 for Motivation:**
{
  "title": "Wake Up at 5 AM or Be Average. But Here’s the REAL Reason Why.",
  "bulletPoints": [
    "Presents a controversial take on a popular topic.",
    "Features an 'anti-hustle' twist for a unique angle.",
    "Focuses on realistic, sustainable motivation."
  ],
  "description": "This isn't another generic hustle-culture video. It challenges the '5 AM club' with a surprising twist, offering a more sustainable approach to building discipline.",
  "relevance": "Subverts a popular and often-debated topic, creating high potential for engagement and discussion."
}

---

IMPORTANT FINAL INSTRUCTION:
Your response MUST be a single, valid JSON array containing exactly 10 new and different content idea objects.
- Do not include any text, explanations, or markdown formatting like \`\`\`json outside of the main JSON array.
- Each object in the array MUST be separated by a comma.
- Do not add a comma after the final object.
- Each object MUST have the following keys:
  - "title": (string) A short, clickable, viral-style headline.
  - "bulletPoints": (array of strings) 2 to 3 unique insights or talking points.
  - "description": (string) A 1 or 2 sentence teaser or summary.
  - "relevance": (string, optional) A brief note on why it's trending or a source (e.g., Reddit, Google Trends).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonText = response.text.trim();
    
    // More robustly find the JSON part of the response by looking for the first '[' and last ']'
    const startIndex = jsonText.indexOf('[');
    const endIndex = jsonText.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      console.error("Invalid response structure. Raw text:", jsonText);
      throw new Error("AI response did not contain a valid JSON array structure. Please try again.");
    }
    
    // Extract only the array part.
    jsonText = jsonText.substring(startIndex, endIndex + 1);
    
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse JSON. Extracted text:", jsonText);
      console.error("Original error:", e);
      // Re-throw with a more user-friendly message, but also log the technical details.
      throw new Error("The AI returned data in an unexpected format. Please try generating again.");
    }

  } catch (error) {
    console.error("Error generating content ideas:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate content ideas: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating content ideas.");
  }
};

export const generateQuickIdeas = async (category: string, existingIdeas: string[] = []): Promise<string[]> => {
  try {
    const model = 'gemini-2.5-flash';

    const categoryMap: { [key: string]: string } = {
        'ai': 'AI tools, tutorials, and future tech trends',
        'self-improvement': 'Self-help and personal + professional growth strategies',
        'productivity': 'Productivity hacks and smarter study routines',
        'motivation': 'Motivation, mindset, discipline, and habit-building'
    };
    
    const categoryFocus = category === 'all'
      ? 'AI, Self-Improvement, Productivity, and Motivation'
      : categoryMap[category];

    const existingIdeasInstruction = existingIdeas.length > 0
        ? `
---
IMPORTANT: You have already provided the following list of ideas. DO NOT repeat these ideas or similar concepts. Generate completely fresh content.
Existing Ideas:
${existingIdeas.map(idea => `- "${idea}"`).join('\n')}
---
`
        : '';

    const prompt = `You are assisting a content creator who needs fast, high-value content ideas.

Their current focus topic is: **${categoryFocus}**

They want short, clear, bullet-point content ideas based on:
- Current online trends
- Popular discussions from Google Trends, Reddit, YouTube, and Twitter (X)
- hot topics only

Please skip long paragraphs or titles.

${existingIdeasInstruction}

Your goal:
🔥 Generate **10 fresh ideas**, each as a bullet line

🚨 Bullet Format Example:
- "Gemini vs ChatGPT: When to Choose What?"
- "AI Tools for Digital Creators – 2025 Edition"
- "The 'Atomic Habits + AI' Morning Routine"
- "Reddit’s #1 Productivity Hack Now Used by Startups"

📌 Do not include extra text, categories, or formatting — just straight bullet points.

Make the bullets:
✔ Short (10–15 words max)  
✔ Trendy (reflecting current conversations)  
✔ Actionable (tutorials, comparisons, how-to’s, lists, or controversial topics)
✔ Targeted to creators, students, professionals, or digital learners

Return output as simple markdown-friendly bullets.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    const ideas = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- ') || line.startsWith('* '))
      .map(line => line.substring(2).trim().replace(/^"|"$/g, ''));

    if (ideas.length === 0) {
        throw new Error("The AI didn't return any ideas in the expected format. Please try again.");
    }

    return ideas;

  } catch (error) {
    console.error("Error generating quick ideas:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate quick ideas: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating quick ideas.");
  }
};


export const fetchLatestVideos = async (apiKey: string, channelId: string): Promise<Video[]> => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.error?.message || 'An unknown API error occurred.';

      if (message.includes('API keys are not supported')) {
        throw new Error('The provided API Key is invalid or not authorized for the YouTube Data API. Please generate a valid key from the Google Cloud Console.');
      }
      throw new Error(message);
    }

    const data = await response.json();

    if (!data.items) {
      throw new Error("No videos found or unexpected API response.");
    }

    return data.items.map((item: any): Video => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching videos.");
  }
};
