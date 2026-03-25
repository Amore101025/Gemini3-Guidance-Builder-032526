import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Sparkles, Loader2, Globe, AlertTriangle, ListChecks, HelpCircle, FileCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const WowFeatures = () => {
  const { generatedToolkit, setGeneratedToolkit, skillModel, addLog } = useAppContext();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [featureOutput, setFeatureOutput] = useState('');

  const executeFeature = async (featureName: string, promptInstruction: string) => {
    if (!generatedToolkit) {
      addLog(`Error: Cannot execute ${featureName} without an existing toolkit.`);
      return;
    }

    setActiveFeature(featureName);
    setFeatureOutput('');
    addLog(`Executing WOW Feature: ${featureName}...`);

    const prompt = `You are an expert Medical Device Regulatory Agent.
Task: ${promptInstruction}

Current Toolkit Content:
---
${generatedToolkit}
---

Output ONLY the new markdown content that should be appended to the toolkit.`;

    try {
      const result = await generateContent(skillModel, prompt);
      setFeatureOutput(result);
      addLog(`${featureName} execution completed.`);
    } catch (error: any) {
      addLog(`${featureName} Error: ${error.message}`);
    } finally {
      setActiveFeature(null);
    }
  };

  const appendOutput = () => {
    setGeneratedToolkit(generatedToolkit + '\n\n' + featureOutput);
    setFeatureOutput('');
    addLog('Appended WOW feature output to toolkit.');
  };

  const features = [
    {
      id: 'wow2',
      name: 'Global Standards Cross-Referencer',
      icon: <Globe className="w-4 h-4" />,
      prompt: 'Scan the regulatory text and automatically map it to international equivalents (e.g., US FDA Product Codes, EU MDR classifications). Create a new section titled "Global Standards Mapping".'
    },
    {
      id: 'wow3',
      name: 'Mock Review Risk Predictor',
      icon: <AlertTriangle className="w-4 h-4" />,
      prompt: 'Simulate a "Strict Senior Reviewer". Append a section titled "Top 3 Critical Failures" identifying the fatal flaws most likely to result in a submission rejection for this specific device category.'
    },
    {
      id: 'wow4',
      name: 'Regulatory Traceability Heatmap',
      icon: <ListChecks className="w-4 h-4" />,
      prompt: 'Output a dense Markdown table cross-referencing every checklist item with the exact clause or page number from the uploaded guidance. Title it "Regulatory Traceability Heatmap".'
    },
    {
      id: 'wow5',
      name: 'Auto-Generated Clarification Q&A',
      icon: <HelpCircle className="w-4 h-4" />,
      prompt: 'Detect ambiguities in the guidance and draft 3 to 5 professionally worded clarification questions ready to be sent to the manufacturer or regulatory sponsor. Title it "Clarification Q&A".'
    },
    {
      id: 'wow6',
      name: 'Tone & Compliance Analyzer',
      icon: <FileCheck className="w-4 h-4" />,
      prompt: 'Evaluate the generated toolkit. Verify that the document maintains an objective, authoritative regulatory tone, ensuring no subjective biases or non-compliant terminology were introduced. Title it "Tone & Compliance Analysis".'
    }
  ];

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Legacy WOW Features
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => executeFeature(feature.name, feature.prompt)}
            disabled={!generatedToolkit || activeFeature !== null}
            className="flex items-center gap-2 p-2 text-sm text-left border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          >
            {activeFeature === feature.name ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : feature.icon}
            <span className="truncate">{feature.name}</span>
          </button>
        ))}
      </div>

      {featureOutput && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-muted p-2 flex justify-between items-center border-b">
            <span className="text-sm font-medium">Feature Output</span>
            <div className="flex gap-2">
              <button onClick={() => setFeatureOutput('')} className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded">Discard</button>
              <button onClick={appendOutput} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">Append to Toolkit</button>
            </div>
          </div>
          <div className="p-4 bg-background max-h-60 overflow-y-auto prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{featureOutput}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
