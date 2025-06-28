import React from 'react';
import { Undo, Redo, MessageSquare, Save, FolderOpen, AlertTriangle, CheckCircle, Plus, Layers } from 'lucide-react';

interface MetaHeaderProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentScreen: string;
  screens: Array<{ id: string; title: string; success?: boolean; terminal?: boolean }>;
  onScreenChange: (screenId: string) => void;
  hasValidationErrors: boolean;
  onSave: () => void;
  onLoad: () => void;
}

export function MetaHeader({ 
  flowName,
  onFlowNameChange,
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  currentScreen, 
  screens, 
  onScreenChange,
  hasValidationErrors,
  onSave,
  onLoad
}: MetaHeaderProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-green-600" size={20} />
            <h1 className="text-lg font-semibold text-gray-900">Meta Flow Builder</h1>
          </div>
          
          {hasValidationErrors ? (
            <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <AlertTriangle size={12} />
              <span className="text-xs font-medium">Errors</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle size={12} />
              <span className="text-xs font-medium">Valid</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo 
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo 
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Flow Name */}
        <input
          type="text"
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-48 bg-white"
          placeholder="Flow name..."
        />

        {/* Screen Management */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Layers size={14} className="text-gray-500" />
            <select
              value={currentScreen}
              onChange={(e) => onScreenChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white min-w-32"
            >
              {screens.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.title}
                  {screen.success && ' (Success)'}
                  {screen.terminal && ' (Terminal)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={onSave}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
          <button 
            onClick={onLoad}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FolderOpen size={14} />
            <span>Load</span>
          </button>
        </div>
      </div>
    </div>
  );
}