import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { BrainCircuit, Play, Loader2, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const SkillEngine = () => {
  const { generatedToolkit, setGeneratedToolkit, skillModel, addLog } = useAppContext();
  const [skillDescription, setSkillDescription] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [proposedChanges, setProposedChanges] = useState('');

  const executeSkill = async () => {
    if (!skillDescription.trim() || !generatedToolkit) {
      addLog('Error: Need both a skill description and an existing toolkit.');
      return;
    }

    setIsExecuting(true);
    setProposedChanges('');
    addLog(`Executing custom skill: "${skillDescription}" using ${skillModel}...`);

    const prompt = `You are an expert Medical Device Regulatory Agent executing a custom skill.
Skill Description: ${skillDescription}

Current Toolkit Content:
---
${generatedToolkit}
---

Execute the skill and provide the proposed modifications or additions. Output ONLY the new markdown content that should be appended or replaced. If you are suggesting changes, clearly indicate them. If you are appending a new section, just output the new section.`;

    try {
      const result = await generateContent(skillModel, prompt);
      setProposedChanges(result);
      addLog('Skill execution completed. Review proposed changes.');
    } catch (error: any) {
      addLog(`Skill Execution Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const acceptChanges = () => {
    setGeneratedToolkit(generatedToolkit + '\n\n' + proposedChanges);
    setProposedChanges('');
    addLog('Accepted proposed changes and appended to toolkit.');
  };

  const rejectChanges = () => {
    setProposedChanges('');
    addLog('Rejected proposed changes.');
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Agentic Skill Execution Engine
        </h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Define Custom Skill</label>
        <textarea
          className="w-full h-24 p-3 rounded-md border bg-background text-sm resize-none focus:ring-2 focus:ring-primary outline-none"
          placeholder="e.g., Regulatory Gap Analyzer: Read the generated toolkit. Cross-reference it against EU MDR 2017/745 Annex I. Highlight areas that fall short and suggest additions."
          value={skillDescription}
          onChange={(e) => setSkillDescription(e.target.value)}
        />
        <button
          onClick={executeSkill}
          disabled={!skillDescription.trim() || !generatedToolkit || isExecuting}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {isExecuting ? 'Executing Skill...' : 'Execute Skill'}
        </button>
      </div>

      {proposedChanges && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-muted p-2 flex justify-between items-center border-b">
            <span className="text-sm font-medium">Proposed Modifications</span>
            <div className="flex gap-2">
              <button onClick={rejectChanges} className="p-1 text-destructive hover:bg-destructive/10 rounded"><X className="w-4 h-4"/></button>
              <button onClick={acceptChanges} className="p-1 text-emerald-600 hover:bg-emerald-600/10 rounded"><Check className="w-4 h-4"/></button>
            </div>
          </div>
          <div className="p-4 bg-background max-h-60 overflow-y-auto prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposedChanges}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
