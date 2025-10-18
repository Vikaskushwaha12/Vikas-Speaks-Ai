import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string, index: number) => {
    // Bold text: **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Headings: ## Heading
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: line.substring(4) }} />;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: line.substring(3) }} />;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-extrabold mt-8 mb-4" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
    }

    // List items: * item or - item
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={index} className="ml-5 list-disc" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
      );
    }
    
    // Empty line for spacing
    if (line.trim() === '') {
        return <br key={index} />;
    }

    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  };

  const lines = content.split('\n');
  const elements = lines.map(renderLine);
  
  // Group list items
  const groupedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  elements.forEach((el, index) => {
    if (React.isValidElement(el) && el.type === 'li') {
      currentList.push(el);
    } else {
      if (currentList.length > 0) {
        groupedElements.push(<ul key={`ul-${index}`} className="space-y-1 mb-4">{currentList}</ul>);
        currentList = [];
      }
      groupedElements.push(el);
    }
  });

  if (currentList.length > 0) {
    groupedElements.push(<ul key="ul-last" className="space-y-1 mb-4">{currentList}</ul>);
  }

  return <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{groupedElements}</div>;
};

export default MarkdownRenderer;
