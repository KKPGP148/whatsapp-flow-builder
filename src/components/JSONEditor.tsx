import React, { useState } from 'react';
import { WhatsAppFlow } from '../types/flow';
import { Copy, Download, Play } from 'lucide-react';

interface JSONEditorProps {
  flowJSON: WhatsAppFlow;
  onRunFlow: () => void;
}

export function JSONEditor({ flowJSON, onRunFlow }: JSONEditorProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(flowJSON, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp-flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Flow JSON</h2>
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Copy JSON"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={downloadJSON}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Download JSON"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        
        <button
          onClick={onRunFlow}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Play size={16} />
          <span>Run Flow</span>
        </button>
        
        {copied && (
          <p className="text-xs text-green-600 mt-2">JSON copied to clipboard!</p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 text-xs bg-gray-50 text-gray-800 font-mono leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}