
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
  Clock,
  Users,
  Shield,
  Star,
  Play,
  Download,
  Trophy,
  Globe,
  Lightbulb
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
      description: "Set, track, and achieve your goals with intelligent progress monitoring and personalized insights",
      color: "from-orange-400 to-amber-500"
    },
    {
      icon: Brain,
      title: "Focus Mode",
      description: "Boost productivity with Pomodoro technique, distraction-free sessions, and deep work analytics",
      color: "from-amber-400 to-yellow-400"
    },
    {
      icon: Calendar,
      title: "Daily Check-ins",
      description: "Track your mood, energy, and daily reflections for better self-awareness and growth",
      color: "from-orange-500 to-red-400"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Visualize your progress with beautiful charts, insights, and data-driven recommendations",
      color: "from-yellow-400 to-orange-400"
    }
  ];

  const stats = [
    { number: "50k+", label: "Goals Achieved", icon: CheckCircle },
    { number: "1M+", label: "Focus Sessions", icon: Clock },
    { number: "99%", label: "User Satisfaction", icon: Heart },
    { number: "10x", label: "Productivity Boost", icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "Visio transformed how I approach my goals. The analytics are incredible!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Entrepreneur",
      content: "The focus mode is a game-changer. I've never been more productive.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Student",
      content: "Daily check-ins helped me understand my patterns and improve my habits.",
      rating: 5
    }
  ];

  const benefits = [
    { icon: Trophy, title: "Achieve More", description: "Turn your dreams into achievable milestones" },
    { icon: Lightbulb, title: "Smart Insights", description: "Get personalized recommendations based on your data" },
    { icon: Shield, title: "Privacy First", description: "Your data is secure and belongs to you" },
    { icon: Globe, title: "Works Everywhere", description: "Access your goals from any device, anywhere" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-amber-900/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -left-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold mb-6">
                <Sparkles size={20} />
                Transform Your Life Today
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-orange-600 mb-6">
                Visio
              </h1>
              
              <p className="text-2xl md:text-3xl text-orange-700 dark:text-orange-300 mb-4 font-light">
                Your Personal Growth Companion
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Achieve your goals, boost productivity, and transform your daily habits with our intelligent tracking system and beautiful analytics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                
                {isInstallable && (
                  <Button 
                    onClick={installPWA}
                    variant="outline"
                    size="lg"
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg rounded-full"
                  >
                    <Download className="mr-2" size={20} />
                    Install App
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-3">
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Mobile Animations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center items-center"
            >
              <div className="relative">
                {/* Main Phone */}
                <motion.div
                  className="w-64 h-[500px] bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden animate-phone-float"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                  
                  {/* Screen Content */}
                  <div className="mt-16 px-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Target className="text-white" size={32} />
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-white">Goal Progress</h3>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Fitness</span>
                          <span className="text-orange-500">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-orange-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 2, delay: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Learning</span>
                          <span className="text-amber-500">70%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-amber-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 2, delay: 1.5 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Career</span>
                          <span className="text-yellow-500">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-yellow-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 2, delay: 2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-8 -right-8 w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  <Zap className="text-white" size={24} />
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 -left-8 w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Star className="text-white" size={24} />
                </motion.div>
              </div>
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
            <span className="text-orange-600"> Success</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to achieve your goals and build lasting habits
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-8 h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
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
      </div>

      {/* Benefits Section */}
      <div className="bg-orange-500 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Visio?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join thousands who have transformed their lives with our platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                  <benefit.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/90">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Loved by <span className="text-orange-600">Thousands</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See what our users say about their transformation journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Final Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
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
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 pb-20"
      >
        <Card className="p-12 bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-2xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to success with Visio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started Now
              <Zap className="ml-2" size={20} />
            </Button>
            {isInstallable && (
              <Button 
                onClick={installPWA}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg rounded-full"
              >
                <Download className="mr-2" size={20} />
                Install App
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LandingPage;
