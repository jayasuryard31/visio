
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Target, 
  Brain, 
  Calendar, 
  BarChart3, 
  Smartphone, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { isInstallable, installPWA } = usePWA();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set, track, and achieve your goals with intelligent progress monitoring",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Brain,
      title: "Focus Mode",
      description: "Boost productivity with Pomodoro technique and distraction-free sessions",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Daily Check-ins",
      description: "Track your mood, energy, and daily reflections for better self-awareness",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Visualize your progress with beautiful charts and insights",
      color: "from-green-400 to-emerald-500"
    }
  ];

  const stats = [
    { number: "10k+", label: "Goals Achieved", icon: CheckCircle },
    { number: "50k+", label: "Focus Sessions", icon: Clock },
    { number: "99%", label: "User Satisfaction", icon: Heart },
    { number: "5x", label: "Productivity Boost", icon: TrendingUp }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold mb-6">
                <Sparkles size={20} />
                Transform Your Life Today
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                Visio
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-light">
                Your Personal Growth Companion
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Achieve your goals, boost productivity, and transform your daily habits with our intelligent tracking system and beautiful analytics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Start Your Journey
                <ArrowRight className="ml-2" size={20} />
              </Button>
              
              {isInstallable && (
                <Button 
                  onClick={installPWA}
                  variant="outline"
                  size="lg"
                  className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Smartphone className="mr-2" size={20} />
                  Install App
                </Button>
              )}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-4">
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent"> Success</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to achieve your goals and build lasting habits
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 border-0 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already started their journey to success with Visio.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started Now
              <Zap className="ml-2" size={20} />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
