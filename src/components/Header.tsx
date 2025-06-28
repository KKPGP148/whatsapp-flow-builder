import React from 'react';
import { Undo, Redo, MessageSquare, Save, FolderOpen } from 'lucide-react';

interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentScreen: string;
  screens: any[];
  onScreenChange: (screenId: string) => void;
}

export function Header({ 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  currentScreen, 
  screens, 
  onScreenChange 
}: HeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-green-600" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">WhatsApp Flow Builder</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo 
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo 
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={currentScreen}
          onChange={(e) => onScreenChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {screens.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.title}
            </option>
          ))}
        </select>

        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
            <Save size={14} />
            <span>Save</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
            <FolderOpen size={14} />
            <span>Load</span>
          </button>
        </div>
      </div>
    </div>
  );
}