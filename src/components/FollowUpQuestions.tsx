import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const QUESTIONS = [
  "PDF Parsing Fidelity: When handling PDFs that contain complex, multi-column tables or scanned images (rather than native text), should we rely purely on client-side text extraction libraries, or should we pass the raw PDF directly to the Gemini 3.1 multimodal API for superior structural comprehension?",
  "Model Fallback Mechanisms: If a user selects gemini-3.1-pro-preview for a massive document and hits an API rate limit or token threshold, should the system automatically implement a fallback routing to gemini-3-flash-preview, or should it halt and prompt the user?",
  "Skill Execution Memory: When a user executes multiple custom \"skills\" sequentially on the same document, should the AI possess conversational memory of previous skill outputs within that session, or should each skill execution be treated as an isolated, stateless event?",
  "Template Customization Limits: The system currently injects the orthopedic base template. Should we build a dedicated UI component allowing RA managers to create, save, and manage a library of custom templates (e.g., Software, IVD, Dental) to replace the default orthopedic baseline?",
  "Data Sanitization & PII: Before uploading regulatory texts to the Gemini API, do we need to implement a local, regex-based pre-processing filter to scrub identifiable manufacturer names, proprietary material codes, or patient data (if clinical trials are included)?",
  "Translation Accuracy vs. Speed: For the Traditional Chinese output, should we instruct the LLM to generate directly in Chinese, which might impact reasoning quality, or should we implement a two-pass pipeline where the AI reasons and generates the toolkit in English first, and a secondary agent translates it into localized Traditional Chinese?",
  "Markdown Editor Integration: For the \"Raw View\" editor, is a standard HTML textarea sufficient, or should we integrate a robust code editor library like Monaco Editor to provide syntax highlighting, line numbers, and search/replace functionality for Markdown?",
  "PDF Export Styling: When exporting the rendered HTML to PDF, do we need to implement custom CSS print media queries to ensure strict adherence to corporate branding guidelines (e.g., specific margins, proprietary fonts, watermark injection)?",
  "Mermaid Diagram Complexity: AI-generated Mermaid code can occasionally contain syntax errors, causing rendering failures. How should the application handle these errors—should it display the raw code, or automatically trigger a hidden LLM retry loop to correct the syntax?",
  "Prompt Version Control: If users are permitted to modify the base prompts for the features, do we need to implement a local version control system (saved in LocalStorage) so they can revert to the factory default prompts if their custom instructions degrade the output quality?",
  "Skill Library Sharing: If a reviewer creates a highly effective \"Skill Description\" (e.g., a perfect prompt for analyzing MRI compatibility), should there be a mechanism to export and share these skills as JSON configurations with other reviewers on the team?",
  "Token Cost Tracking: Since allowing users to choose models and execute unlimited skills can rapidly consume API quotas, should we implement a client-side token accumulator to display estimated API costs per session to the user?",
  "Checklist State Management: After generating the Markdown checklist, do users need the ability to interact with the checkboxes directly in the UI (checking them off, adding notes) and have those interactive states persist across page reloads, or is static generation sufficient?",
  "Cross-Referencing Accuracy: When the \"Global Standards Cross-Referencer\" (WOW 2) links a local regulation to an FDA Product Code, should the system be required to provide a confidence score or a direct web link to the FDA database to mitigate the risk of AI hallucination?",
  "Context Window Saturation: If a user uploads a 500-page PDF, it may exceed even Gemini's massive context window. Should we implement a chunking mechanism to summarize the document in parts, or strictly enforce a file size/page limit prior to upload?",
  "Concurrent Generation: During Skill Execution, can the user run two distinct skills simultaneously (e.g., one agent checking Biological Safety, another checking Mechanical Testing), or must the UI enforce a strict, synchronous queue to prevent state conflicts in the editor?",
  "Localization of Regulatory Terms: Traditional Chinese medical device terminology can vary significantly between Taiwan (TFDA) and other regions. Should the language selector include specific regional dialects (e.g., zh-TW for TFDA vs. zh-HK) to ensure precise legal phrasing?",
  "Offline Degradation: If the user loses internet connectivity while modifying the toolkit in the Markdown editor, should the system implement service workers to cache their edits locally, ensuring no manual work is lost during an outage?",
  "Report Pagination Strategy: A 3000-word toolkit will span many pages. In the UI rendered view, should the document be displayed as one continuous infinite scroll, or should we implement artificial pagination (e.g., tabbed navigation per section) to improve readability?",
  "Audit Trail Requirements: For ISO 13485 or FDA 21 CFR Part 11 compliance environments, is there a future requirement to log which LLM model generated which specific paragraph, creating a verifiable audit trail distinguishing human-edited text from AI-generated text in the final downloaded PDF?"
];

export const FollowUpQuestions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border-b pb-2 hover:text-primary transition-colors"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          20 Comprehensive Follow-up Questions
        </h2>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
          {QUESTIONS.map((q, i) => {
            const [title, ...rest] = q.split(': ');
            return (
              <div key={i} className="p-3 bg-muted rounded-md border text-sm">
                <strong className="text-primary block mb-1">{i + 1}. {title}</strong>
                <span className="text-muted-foreground">{rest.join(': ')}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
