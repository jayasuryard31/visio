
import React, { useState, useEffect } from 'react';
import QuoteSplash from '../components/QuoteSplash';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplashToday, setHasSeenSplashToday] = useState(false);

  useEffect(() => {
    // Check if user has seen splash today
    const today = new Date().toDateString();
    const lastSplashDate = localStorage.getItem('lastSplashDate');
    
    if (lastSplashDate === today) {
      setHasSeenSplashToday(true);
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    // Mark that user has seen splash today
    const today = new Date().toDateString();
    localStorage.setItem('lastSplashDate', today);
    setShowSplash(false);
    setHasSeenSplashToday(true);
  };

  if (showSplash && !hasSeenSplashToday) {
    return <QuoteSplash onComplete={handleSplashComplete} />;
  }

  return <Dashboard />;
};

export default Index;
