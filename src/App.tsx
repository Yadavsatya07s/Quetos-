import React, { useState, useEffect } from 'react';
import { RefreshCw, Quote, Heart, Share, History, Tag, ChevronRight, X } from 'lucide-react';

interface QuoteData {
  content: string;
  author: string;
  tags?: string[];
}

function App() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<QuoteData[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const tags = [
    'wisdom',
    'inspiration',
    'happiness',
    'success',
    'love',
    'life',
  ];

  const fetchQuote = async (tag?: string) => {
    setIsLoading(true);
    try {
      const url = tag 
        ? `https://api.quotable.io/random?tags=${tag}`
        : 'https://api.quotable.io/random';
      const response = await fetch(url);
      const data = await response.json();
      const newQuote = {
        content: data.content,
        author: data.author,
        tags: data.tags,
      };
      setQuote(newQuote);
      setQuoteHistory(prev => [newQuote, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleShare = () => {
    if (quote) {
      const shareText = `"${quote.content}" - ${quote.author}`;
      if (navigator.share) {
        navigator.share({
          text: shareText,
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Quote copied to clipboard!');
      }
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    fetchQuote(tag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Quote className="w-8 h-8 text-indigo-500" />
            Daily Quotes
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="View History"
            >
              <History className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => fetchQuote(selectedTag)}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`w-6 h-6 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-6 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {quote ? (
            <div className="space-y-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl">
              <blockquote className="text-2xl font-serif text-gray-700 leading-relaxed">
                "{quote.content}"
              </blockquote>
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-600">- {quote.author}</p>
                {quote.tags && (
                  <div className="flex gap-2">
                    {quote.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-4 mt-8">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-2 rounded-full transition-colors ${
              isFavorited ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <Share className="w-6 h-6" />
          </button>
        </div>

        {/* Quote History Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
            showHistory ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-500" />
                Quote History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              {quoteHistory.map((historyQuote, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setQuote(historyQuote);
                    setShowHistory(false);
                  }}
                >
                  <p className="text-gray-700 line-clamp-2">{historyQuote.content}</p>
                  <p className="text-sm text-gray-500 mt-2">- {historyQuote.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;