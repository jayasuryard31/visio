
import React, { useEffect, useState } from 'react';
import { Quote } from '../types';
import { fetchRandomQuote } from '../services/quoteService';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteSplashProps {
  onComplete: () => void;
}

const QuoteSplash: React.FC<QuoteSplashProps> = ({ onComplete }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const fetchedQuote = await fetchRandomQuote();
        setQuote(fetchedQuote);
      } catch (error) {
        console.error('Failed to load quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuote();
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 animate-fade-in">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <div className="mb-16 animate-scale-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-300 mr-4 animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              ManifestMate
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Transform Your Dreams Into Reality
          </p>
        </div>

        {/* Quote Section */}
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-32 bg-white/20 rounded-xl mb-8"></div>
            <div className="h-8 bg-white/20 rounded-lg w-1/2 mx-auto"></div>
          </div>
        ) : quote ? (
          <div className="glass-effect rounded-3xl p-12 mb-12 backdrop-blur-xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-8">
              "{quote.content}"
            </blockquote>
            <cite className="text-lg md:text-xl text-white/80 font-medium">
              — {quote.author}
            </cite>
          </div>
        ) : null}

        {/* Continue Button */}
        <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50 backdrop-blur-xl px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Start Your Journey
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <p className="text-white/60 text-sm">
            Daily motivation • Goal tracking • Dream manifestation
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteSplash;
