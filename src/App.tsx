import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { SettingsPanel } from './components/SettingsPanel';
import { IngestionZone } from './components/IngestionZone';
import { ToolkitEditor } from './components/ToolkitEditor';
import { SkillEngine } from './components/SkillEngine';
import { WowFeatures } from './components/WowFeatures';
import { LiveLog } from './components/LiveLog';
import { InteractiveDashboard } from './components/InteractiveDashboard';
import { FollowUpQuestions } from './components/FollowUpQuestions';
import { Activity } from 'lucide-react';

const MainLayout = () => {
  const { theme, pantoneStyle } = useAppContext();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Remove old pantone classes
    root.className = root.className.replace(/\btheme-\S+/g, '');
    root.classList.add(`theme-${pantoneStyle}`);
  }, [theme, pantoneStyle]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SmartMed Review 3.0</h1>
          </div>
          <div className="text-sm text-muted-foreground hidden sm:block">
            AI Regulatory Toolkit & Agentic Skill Execution System
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 mt-4">
        {/* Top Row: Dashboard & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InteractiveDashboard />
          </div>
          <div className="lg:col-span-1">
            <SettingsPanel />
          </div>
        </div>

        {/* Middle Row: Ingestion & Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <IngestionZone />
            <LiveLog />
          </div>
          <div className="lg:col-span-2">
            <ToolkitEditor />
          </div>
        </div>

        {/* Bottom Row: Agentic Skills & WOW Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillEngine />
          <WowFeatures />
        </div>

        {/* Footer: Follow-up Questions */}
        <div className="pb-12">
          <FollowUpQuestions />
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
