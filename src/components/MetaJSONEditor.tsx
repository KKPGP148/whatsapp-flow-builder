import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { MetaFlow } from '../types/metaFlow';
import { metaFlowsAPI, flowCategories, type FlowCategory } from '../config/metaApi';
import { Copy, Download, Play, CheckCircle, AlertTriangle, Settings, RefreshCw, FileText, Zap, ExternalLink, Upload, Clipboard } from 'lucide-react';

interface MetaJSONEditorProps {
  flowJSON: MetaFlow;
  hasValidationErrors: boolean;
  onRunFlow: () => void;
  onUpdateJSON: (jsonString: string) => void;
}

export function MetaJSONEditor({ flowJSON, hasValidationErrors, onRunFlow, onUpdateJSON }: MetaJSONEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<FlowCategory>('OTHER');
  const [editorValue, setEditorValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const jsonString = JSON.stringify(flowJSON, null, 2);

  useEffect(() => {
    setEditorValue(jsonString);
  }, [jsonString]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editorValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([editorValue], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowJSON.screens[0]?.title?.replace(/\s+/g, '_').toLowerCase() || 'flow'}_meta_flow_v7.1.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setEditorValue(formatted);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
    }
  };

  const applyJSONChanges = () => {
    try {
      JSON.parse(editorValue); // Validate JSON
      onUpdateJSON(editorValue);
      alert('JSON changes applied successfully!');
    } catch (error) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEditorValue(text);
    } catch (err) {
      console.error('Failed to paste from clipboard:', err);
      alert('Failed to paste from clipboard. Please paste manually in the editor.');
    }
  };

  const handleDeployToMeta = async () => {
    if (hasValidationErrors) {
      alert('Please fix validation errors before deploying to Meta API');
      return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      const flowName = flowJSON.screens[0]?.title || 'Untitled Flow';
      
      const createFlowRequest = {
        name: flowName,
        categories: [selectedCategory],
        flow_json: editorValue,
        publish: true
      };

      console.log('Deploying flow to Meta API:', createFlowRequest);

      const result = await metaFlowsAPI.createFlow(createFlowRequest);
      
      setDeploymentResult({
        success: true,
        data: result,
        message: `Flow successfully deployed! Flow ID: ${result.id}`
      });

      alert(`🎉 Flow deployed successfully!\n\nFlow ID: ${result.id}\nStatus: ${result.status}\n\nYour WhatsApp Flow is now live and ready to use!`);

    } catch (error: any) {
      console.error('Deployment failed:', error);
      
      setDeploymentResult({
        success: false,
        error: error.message,
        message: 'Failed to deploy flow to Meta API'
      });

      alert(`❌ Deployment failed!\n\nError: ${error.message}\n\nCheck the detailed error information below.`);
    } finally {
      setIsDeploying(false);
    }
  };

  const validateJSON = () => {
    const requiredFields = ['version', 'data_api_version', 'screens'];
    const missingFields = requiredFields.filter(field => !flowJSON[field as keyof MetaFlow]);
    
    const isValidVersion = flowJSON.version === '7.1';
    const isValidDataApiVersion = flowJSON.data_api_version === '3.0';
    const hasValidRouting = flowJSON.routing_model && typeof flowJSON.routing_model === 'object';
    
    return {
      isValid: missingFields.length === 0 && !hasValidationErrors && isValidVersion && isValidDataApiVersion && hasValidRouting,
      missingFields,
      hasComponentErrors: hasValidationErrors,
      versionIssues: !isValidVersion ? ['Version must be 7.1'] : [],
      dataApiIssues: !isValidDataApiVersion ? ['Data API version must be 3.0'] : [],
      routingIssues: !hasValidRouting ? ['Routing model is required'] : []
    };
  };

  const validation = validateJSON();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">JSON Editor v7.1</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1 rounded transition-colors ${
                showSettings 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings size={12} />
            </button>
            <button
              onClick={pasteFromClipboard}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Paste from Clipboard"
            >
              <Clipboard size={12} />
            </button>
            <button
              onClick={formatJSON}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Format JSON"
            >
              <RefreshCw size={12} />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Copy JSON"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={downloadJSON}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Download JSON"
            >
              <Download size={12} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-2 p-2 bg-white rounded border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-gray-600 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as FlowCategory)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  {flowCategories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Status</label>
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  Connected
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Status */}
        <div className={`mb-2 p-2 rounded border text-xs ${
          validation.isValid 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-1">
            {validation.isValid ? (
              <CheckCircle size={12} />
            ) : (
              <AlertTriangle size={12} />
            )}
            <span className="font-medium">
              {validation.isValid ? 'Valid for v7.1' : 'Validation Issues'}
            </span>
          </div>
          {!validation.isValid && (
            <div className="mt-1 space-y-0.5">
              {validation.missingFields.length > 0 && (
                <p>Missing: {validation.missingFields.join(', ')}</p>
              )}
              {validation.versionIssues.map((issue, i) => (
                <p key={i}>• {issue}</p>
              ))}
              {validation.dataApiIssues.map((issue, i) => (
                <p key={i}>• {issue}</p>
              ))}
              {validation.routingIssues.map((issue, i) => (
                <p key={i}>• {issue}</p>
              ))}
              {validation.hasComponentErrors && (
                <p>• Component validation errors exist</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1">
          <button
            onClick={applyJSONChanges}
            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <FileText size={12} />
            <span>Apply</span>
          </button>
          <button
            onClick={handleDeployToMeta}
            disabled={!validation.isValid || isDeploying}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
              validation.isValid && !isDeploying
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Zap size={12} />
            <span>{isDeploying ? 'Deploying...' : 'Deploy'}</span>
          </button>
        </div>

        {/* Deployment Result */}
        {deploymentResult && (
          <div className={`mt-2 p-2 rounded border text-xs ${
            deploymentResult.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-1">
              {deploymentResult.success ? (
                <CheckCircle size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}
              <span className="font-medium">
                {deploymentResult.success ? 'Deployment Successful!' : 'Deployment Failed'}
              </span>
            </div>
            <p className="mt-1">{deploymentResult.message}</p>
            {deploymentResult.success && deploymentResult.data && (
              <div className="mt-1">
                <p>Flow ID: {deploymentResult.data.id}</p>
                <p>Status: {deploymentResult.data.status}</p>
              </div>
            )}
          </div>
        )}
        
        {copied && (
          <p className="text-xs text-green-600 mt-1">JSON copied to clipboard!</p>
        )}
      </div>

      {/* Full Height Monaco Editor */}
      <div className="flex-1 overflow-hidden min-h-0">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={editorValue}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 11,
            lineNumbers: 'on',
            folding: true,
            wordWrap: 'on',
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            renderLineHighlight: 'line',
            selectionHighlight: false,
            occurrencesHighlight: false,
            codeLens: false,
            contextmenu: true,
            mouseWheelZoom: true,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: false
          }}
        />
      </div>
    </div>
  );
}