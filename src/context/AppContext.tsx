import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh-TW';
export type Theme = 'light' | 'dark';
export type PantoneStyle = 
  | 'classic-blue' | 'living-coral' | 'ultra-violet' | 'greenery' | 'rose-quartz'
  | 'serenity' | 'marsala' | 'radiant-orchid' | 'emerald' | 'tangerine-tango';

export type ModelType = 'gemini-3.1-pro-preview' | 'gemini-2.5-flash';

interface AppState {
  language: Language;
  theme: Theme;
  pantoneStyle: PantoneStyle;
  toolkitModel: ModelType;
  skillModel: ModelType;
  uploadedText: string;
  generatedToolkit: string;
  logs: string[];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setPantoneStyle: (style: PantoneStyle) => void;
  setToolkitModel: (model: ModelType) => void;
  setSkillModel: (model: ModelType) => void;
  setUploadedText: (text: string) => void;
  setGeneratedToolkit: (text: string) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [pantoneStyle, setPantoneStyle] = useState<PantoneStyle>('classic-blue');
  const [toolkitModel, setToolkitModel] = useState<ModelType>('gemini-3.1-pro-preview');
  const [skillModel, setSkillModel] = useState<ModelType>('gemini-2.5-flash');
  const [uploadedText, setUploadedText] = useState('');
  const [generatedToolkit, setGeneratedToolkit] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        pantoneStyle,
        toolkitModel,
        skillModel,
        uploadedText,
        generatedToolkit,
        logs,
        setLanguage,
        setTheme,
        setPantoneStyle,
        setToolkitModel,
        setSkillModel,
        setUploadedText,
        setGeneratedToolkit,
        addLog,
        clearLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
