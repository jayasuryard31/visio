
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '../integrations/supabase/client';
import { 
  Menu, 
  Home, 
  Target, 
  BarChart3, 
  Heart, 
  BookOpen, 
  Calendar, 
  Focus, 
  Settings, 
  LogOut,
  Sparkles,
  Plus
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  showAddGoal?: boolean;
  onAddGoal?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showAddGoal = false, onAddGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Heart, label: 'Wellness', path: '/wellness' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Focus, label: 'Focus Mode', path: '/focus' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-visio-surface dark:bg-visio-surface">
      {/* Header */}
      <div className="p-6 border-b border-visio-surface-variant dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-visio-primary rounded-full flex items-center justify-center glossy-card">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-visio-primary dark:text-visio-primary">Visio</h2>
            <p className="text-sm text-visio-secondary dark:text-visio-secondary">Manifest your dreams</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-visio-primary text-white glossy-button'
                  : 'text-visio-primary dark:text-visio-primary hover:bg-visio-surface-variant dark:hover:bg-visio-surface-variant'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with Version */}
      <div className="p-4 border-t border-visio-surface-variant dark:border-gray-700">
        <div className="mb-3 text-center">
          <p className="text-xs text-visio-secondary dark:text-visio-secondary">Version 1.0.0</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full justify-start text-visio-secondary dark:text-visio-secondary border-visio-surface-variant dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-visio-surface-variant dark:bg-visio-surface">
      {/* Mobile Header */}
      <div className="md:hidden bg-visio-surface/90 dark:bg-visio-surface/90 backdrop-blur-lg border-b border-visio-surface-variant dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-visio-primary dark:text-visio-primary">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-visio-primary" />
            <h1 className="text-lg font-bold text-visio-primary dark:text-visio-primary">Visio</h1>
          </div>

          {showAddGoal && onAddGoal && (
            <Button
              onClick={onAddGoal}
              size="sm"
              className="glossy-button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-visio-surface/90 dark:bg-visio-surface/90 backdrop-blur-lg border-r border-visio-surface-variant dark:border-gray-700 sticky top-0 h-screen">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          {showAddGoal && onAddGoal && (
            <div className="absolute top-6 right-6 z-10">
              <Button
                onClick={onAddGoal}
                className="glossy-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
