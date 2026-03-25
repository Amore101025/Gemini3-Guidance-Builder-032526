import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Moon, Sun, Languages, Palette, Cpu } from 'lucide-react';

const PANTONE_STYLES = [
  { id: 'classic-blue', name: 'Classic Blue', hex: '#0F4C81' },
  { id: 'living-coral', name: 'Living Coral', hex: '#FF6F61' },
  { id: 'ultra-violet', name: 'Ultra Violet', hex: '#5F4B8B' },
  { id: 'greenery', name: 'Greenery', hex: '#88B04B' },
  { id: 'rose-quartz', name: 'Rose Quartz', hex: '#F7CAC9' },
  { id: 'serenity', name: 'Serenity', hex: '#91A8D0' },
  { id: 'marsala', name: 'Marsala', hex: '#955251' },
  { id: 'radiant-orchid', name: 'Radiant Orchid', hex: '#B565A7' },
  { id: 'emerald', name: 'Emerald', hex: '#009473' },
  { id: 'tangerine-tango', name: 'Tangerine Tango', hex: '#DD4124' },
] as const;

export const SettingsPanel = () => {
  const {
    language, setLanguage,
    theme, setTheme,
    pantoneStyle, setPantoneStyle,
    toolkitModel, setToolkitModel,
    skillModel, setSkillModel
  } = useAppContext();

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b pb-2">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Settings & Tuning</h2>
      </div>

      <div className="space-y-4">
        {/* Theme & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>} Theme
            </label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full p-2 rounded border bg-background text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Languages className="w-4 h-4"/> Language
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-2 rounded border bg-background text-sm"
            >
              <option value="en">English</option>
              <option value="zh-TW">Traditional Chinese</option>
            </select>
          </div>
        </div>

        {/* Pantone Palette */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4"/> Pantone Style
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PANTONE_STYLES.map((style) => (
              <button
                key={style.id}
                title={style.name}
                onClick={() => setPantoneStyle(style.id)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  pantoneStyle === style.id ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: style.hex }}
              />
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4"/> Toolkit Generator Model
            </label>
            <select 
              value={toolkitModel} 
              onChange={(e) => setToolkitModel(e.target.value as any)}
              className="w-full p-2 rounded border bg-background text-sm"
            >
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Deep Reasoning)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4"/> Skill Execution Model
            </label>
            <select 
              value={skillModel} 
              onChange={(e) => setSkillModel(e.target.value as any)}
              className="w-full p-2 rounded border bg-background text-sm"
            >
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
