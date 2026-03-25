import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, BarChart3, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const InteractiveDashboard = () => {
  const { uploadedText, generatedToolkit, logs } = useAppContext();

  const wordCount = generatedToolkit.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = uploadedText.length;
  const hasChecklist = generatedToolkit.includes('查驗登記審查清單') || generatedToolkit.includes('Review Checklist');
  const hasMermaid = generatedToolkit.includes('```mermaid');
  const errorCount = logs.filter(log => log.toLowerCase().includes('error')).length;

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          WOW Interactive Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Source Stats */}
        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
          <FileText className="w-6 h-6 text-primary mb-2" />
          <span className="text-2xl font-bold">{charCount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Source Chars</span>
        </div>

        {/* Output Stats */}
        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
          <Activity className="w-6 h-6 text-primary mb-2" />
          <span className="text-2xl font-bold">{wordCount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Toolkit Words</span>
        </div>

        {/* WOW Interactive Indicator: Health */}
        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
          {errorCount === 0 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
          ) : (
            <AlertCircle className="w-6 h-6 text-destructive mb-2" />
          )}
          <span className="text-2xl font-bold">{errorCount === 0 ? '100%' : `${Math.max(0, 100 - errorCount * 10)}%`}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">System Health</span>
        </div>

        {/* WOW Interactive Indicator: Completeness */}
        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
          <div className="flex gap-1 mb-2">
            <div className={`w-3 h-3 rounded-full ${hasChecklist ? 'bg-emerald-500' : 'bg-gray-300'}`} title="Checklist Generated" />
            <div className={`w-3 h-3 rounded-full ${hasMermaid ? 'bg-blue-500' : 'bg-gray-300'}`} title="Mermaid Flowchart Generated" />
            <div className={`w-3 h-3 rounded-full ${wordCount > 2000 ? 'bg-purple-500' : 'bg-gray-300'}`} title="Length > 2000 words" />
          </div>
          <span className="text-2xl font-bold">
            {((hasChecklist ? 1 : 0) + (hasMermaid ? 1 : 0) + (wordCount > 2000 ? 1 : 0)) * 33}%
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Completeness</span>
        </div>
      </div>
    </div>
  );
};
