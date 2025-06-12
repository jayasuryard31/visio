
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import QuoteSplash from '../components/QuoteSplash';
import Dashboard from '../components/Dashboard';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplashToday, setHasSeenSplashToday] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);

      if (!session) {
        // Not authenticated, show splash and then redirect to auth
        const today = new Date().toDateString();
        const lastSplashDate = localStorage.getItem('lastSplashDate');
        
        if (lastSplashDate === today) {
          setHasSeenSplashToday(true);
          setShowSplash(false);
          navigate('/auth');
        }
      } else {
        // Authenticated, check if should show splash
        const today = new Date().toDateString();
        const lastSplashDate = localStorage.getItem('lastSplashDate');
        
        if (lastSplashDate === today) {
          setHasSeenSplashToday(true);
          setShowSplash(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session && !showSplash) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showSplash]);

  const handleSplashComplete = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastSplashDate', today);
    setShowSplash(false);
    setHasSeenSplashToday(true);

    if (!isAuthenticated) {
      navigate('/auth');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showSplash && !hasSeenSplashToday) {
    return <QuoteSplash onComplete={handleSplashComplete} />;
  }

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return <Dashboard />;
};

export default Index;
