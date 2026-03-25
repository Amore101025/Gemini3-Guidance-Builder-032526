import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { UploadCloud, FileText, File as FileIcon, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export const IngestionZone = () => {
  const { setUploadedText, addLog } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteContent, setPasteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsParsing(true);
    addLog(`Parsing file: ${file.name}...`);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setUploadedText(fullText);
        addLog(`Successfully extracted ${fullText.length} characters from PDF.`);
      } else if (file.type === 'text/markdown' || file.type === 'text/plain' || file.name.endsWith('.md')) {
        const text = await file.text();
        setUploadedText(text);
        addLog(`Successfully read text file: ${file.name}`);
      } else {
        addLog(`Unsupported file type: ${file.type}. Please upload PDF, MD, or TXT.`);
      }
    } catch (error: any) {
      addLog(`Error parsing file: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (pasteContent.trim()) {
      setUploadedText(pasteContent);
      addLog(`Loaded pasted content (${pasteContent.length} characters).`);
    }
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Multimodal Ingestion
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          >
            File Upload
          </button>
          <button 
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'paste' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          >
            Text Paste
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.md,.txt"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />
          {isParsing ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Extracting text...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer">
              <FileIcon className="w-8 h-8 mb-2" />
              <p className="font-medium text-foreground">Click or drag file to this area to upload</p>
              <p className="text-sm">Support for a single or bulk upload. Strictly PDF, MD, or TXT.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea 
            className="w-full h-32 p-3 rounded-md border bg-background text-sm resize-none focus:ring-2 focus:ring-primary outline-none"
            placeholder="Paste raw regulatory text or markdown here..."
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
          />
          <button 
            onClick={handlePasteSubmit}
            disabled={!pasteContent.trim()}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 transition-opacity"
          >
            Ingest Content
          </button>
        </div>
      )}
    </div>
  );
};
