import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContentStream } from '../lib/gemini';
import { FileEdit, Eye, Code, Download, FileText, Play, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

mermaid.initialize({ startOnLoad: false, theme: 'default' });

const MermaidBlock = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, code).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      }).catch(e => console.error(e));
    }
  }, [code]);

  return <div ref={ref} className="flex justify-center my-4 overflow-x-auto" />;
};

export const ToolkitEditor = () => {
  const { uploadedText, generatedToolkit, setGeneratedToolkit, toolkitModel, language, addLog } = useAppContext();
  const [viewMode, setViewMode] = useState<'split' | 'raw' | 'rendered'>('rendered');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!uploadedText) {
      addLog('Error: No text ingested. Please upload or paste content first.');
      return;
    }

    setIsGenerating(true);
    setGeneratedToolkit('');
    addLog(`Initializing Toolkit Generation using ${toolkitModel}...`);
    
    abortControllerRef.current = new AbortController();

    const systemInstruction = `You are a Senior Regulatory Affairs Specialist.
Your task is to generate a comprehensive, 2000 to 3000-word Medical Device Review Toolkit based on the provided text.
You MUST output in ${language === 'en' ? 'English' : 'Traditional Chinese (zh-TW)'}.
You MUST use the following structure:
第一部分：臨床前審查指引 (Review Guidance)
1. 產品規格要求 (Product Specifications)
2. 生物相容性評估 (Biocompatibility)
3. 滅菌確效 (Sterilization)
4. 機械性質評估 (Mechanical Testing)
5. 特定風險與額外評估 (Special Risks and Additional Evaluations)
第二部分：查驗登記審查清單 (Review Checklist)
(Generate a markdown table with columns: 審查項目, 審查重點 / 具備文件, 審查結果, 備註說明)

Include Mermaid.js flowcharts where appropriate to visualize review pathways or system components. Use \`\`\`mermaid code blocks.`;

    try {
      const stream = generateContentStream(toolkitModel, `Here is the raw regulatory guidance text:\n\n${uploadedText}`, systemInstruction);
      let fullText = '';
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          addLog('Generation aborted by user.');
          break;
        }
        fullText += chunk;
        setGeneratedToolkit(fullText);
      }
      if (!abortControllerRef.current?.signal.aborted) {
        addLog('Toolkit generation completed successfully.');
      }
    } catch (error: any) {
      addLog(`Generation Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedToolkit], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartMed_Toolkit.txt';
    a.click();
    URL.revokeObjectURL(url);
    addLog('Exported as TXT.');
  };

  const downloadMd = () => {
    const blob = new Blob([generatedToolkit], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartMed_Toolkit.md';
    a.click();
    URL.revokeObjectURL(url);
    addLog('Exported as MD.');
  };

  const downloadPdf = async () => {
    if (!renderRef.current) return;
    addLog('Generating PDF... This may take a moment.');
    try {
      const canvas = await html2canvas(renderRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('SmartMed_Toolkit.pdf');
      addLog('Exported as PDF.');
    } catch (error: any) {
      addLog(`PDF Export Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm flex flex-col h-[800px]">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-primary" />
          Review Toolkit Editor
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-muted p-1 rounded-md">
            <button onClick={() => setViewMode('raw')} className={`p-1.5 rounded transition-colors ${viewMode === 'raw' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Raw View"><Code className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('split')} className={`p-1.5 rounded transition-colors ${viewMode === 'split' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Split View"><FileText className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('rendered')} className={`p-1.5 rounded transition-colors ${viewMode === 'rendered' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Rendered View"><Eye className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadTxt} disabled={!generatedToolkit} className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 transition-colors flex items-center gap-1"><Download className="w-4 h-4"/> TXT</button>
            <button onClick={downloadMd} disabled={!generatedToolkit} className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 transition-colors flex items-center gap-1"><Download className="w-4 h-4"/> MD</button>
            <button onClick={downloadPdf} disabled={!generatedToolkit} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md disabled:opacity-50 transition-colors flex items-center gap-1"><Download className="w-4 h-4"/> PDF</button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {uploadedText ? `Ready to generate. Source: ${uploadedText.length} chars.` : 'Awaiting ingestion...'}
        </p>
        {isGenerating ? (
          <button onClick={handleStop} className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:bg-destructive/90 transition-colors">
            <Square className="w-4 h-4 fill-current" /> Stop Generation
          </button>
        ) : (
          <button onClick={handleGenerate} disabled={!uploadedText} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Play className="w-4 h-4 fill-current" /> Generate Toolkit
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'raw' || viewMode === 'split') && (
          <textarea
            className={`p-4 bg-background text-foreground resize-none outline-none font-mono text-sm leading-relaxed ${viewMode === 'split' ? 'w-1/2 border-r' : 'w-full'}`}
            value={generatedToolkit}
            onChange={(e) => setGeneratedToolkit(e.target.value)}
            placeholder="Generated markdown will appear here..."
          />
        )}
        {(viewMode === 'rendered' || viewMode === 'split') && (
          <div className={`p-6 overflow-y-auto bg-card text-card-foreground prose prose-sm dark:prose-invert max-w-none ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`} ref={renderRef}>
            {generatedToolkit ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match && match[1] === 'mermaid') {
                      return <MermaidBlock code={String(children).replace(/\n$/, '')} />;
                    }
                    return <code className={className} {...props}>{children}</code>;
                  }
                }}
              >
                {generatedToolkit}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic">
                Rendered output will appear here...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
