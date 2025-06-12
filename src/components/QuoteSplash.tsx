
import React, { useEffect, useState } from 'react';
import { Quote } from '../types';
import { fetchRandomQuote } from '../services/quoteService';
import { Sparkles } from 'lucide-react';
import { Typography, Box, CircularProgress, Fade } from '@mui/material';

interface QuoteSplashProps {
  onComplete: () => void;
}

const QuoteSplash: React.FC<QuoteSplashProps> = ({ onComplete }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const fetchedQuote = await fetchRandomQuote();
        setQuote(fetchedQuote);
        setIsLoading(false);
        
        // Start fade-in animations
        setTimeout(() => setShowQuote(true), 500);
        setTimeout(() => setShowAuthor(true), 1500);
        
        // Calculate timeout based on quote length (3-5 seconds)
        const quoteLength = fetchedQuote.content.length;
        const timeoutDuration = Math.min(Math.max(3000, quoteLength * 50), 5000);
        
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, timeoutDuration + 2000);
      } catch (error) {
        console.error('Failed to load quote:', error);
        setIsLoading(false);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 3000);
      }
    };

    loadQuote();
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ffd23f 50%, #ff6b35 75%, #e74c3c 100%)',
        animation: 'gradientShift 6s ease infinite',
        '@keyframes gradientShift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        backgroundSize: '200% 200%',
      }}
    >
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 4s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: 150,
          height: 150,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 5s ease-in-out infinite reverse',
        }}
      />

      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          px: 4,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <Sparkles 
                size={48} 
                style={{ 
                  color: '#000', 
                  marginRight: 16,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }} 
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  color: '#000',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                }}
              >
                Visio
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: '#000',
                fontWeight: 300,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Transform Your Dreams Into Reality
            </Typography>
          </Box>
        </Fade>

        {/* Quote Section */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#000' }} size={60} />
          </Box>
        ) : quote ? (
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 4,
              p: 6,
              mb: 6,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Fade in={showQuote} timeout={1500}>
              <Typography
                variant="h4"
                sx={{
                  color: '#000',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  mb: 4,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontStyle: 'italic',
                }}
              >
                "{quote.content}"
              </Typography>
            </Fade>
            <Fade in={showAuthor} timeout={1500}>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                — {quote.author}
              </Typography>
            </Fade>
          </Box>
        ) : null}

        {/* Bottom tagline */}
        <Fade in={showAuthor} timeout={2000}>
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              opacity: 0.8,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Daily motivation • Goal tracking • Dream manifestation
          </Typography>
        </Fade>
      </Box>
    </Box>
  );
};

export default QuoteSplash;
