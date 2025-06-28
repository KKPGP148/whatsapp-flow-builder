import React from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { MetaCanvasComponent } from './MetaCanvasComponent';
import { Plus, AlertTriangle } from 'lucide-react';

interface MetaCanvasProps {
  screen: MetaFlowScreen | undefined;
  selectedComponent: string | null;
  validationErrors: Record<string, string[]>;
  onSelectComponent: (id: string | null) => void;
  onDrop: (e: React.DragEvent, position: { x: number; y: number }) => void;
  onDragOver: (e: React.DragEvent) => void;
  onComponentUpdate: (componentIndex: number, updates: any) => void;
  onAddScreen: (type?: 'regular' | 'success' | 'terminal') => void;
}

export function MetaCanvas({
  screen,
  selectedComponent,
  validationErrors,
  onSelectComponent,
  onDrop,
  onDragOver,
  onComponentUpdate,
  onAddScreen
}: MetaCanvasProps) {
  const handleDrop = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    onDrop(e, position);
  };

  if (!screen) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Screen Selected</h3>
          <p className="text-sm text-gray-500 mb-4">Create your first screen to start building</p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => onAddScreen('regular')}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(validationErrors).some(key => key.startsWith(screen.id));

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-4">
        {/* Compact Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">{screen.title}</h2>
                {hasErrors && (
                  <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <AlertTriangle size={12} />
                    <span className="text-xs font-medium">Errors</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-xs text-gray-500">ID: {screen.id}</p>
                {screen.success && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Success Screen
                  </span>
                )}
                {screen.terminal && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Terminal Screen
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onAddScreen('regular')}
              className="inline-flex items-center px-2 py-1 text-xs bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50 rounded transition-colors"
            >
              <Plus size={12} className="mr-1" />
              Screen
            </button>
            <button
              onClick={() => onAddScreen('success')}
              className="inline-flex items-center px-2 py-1 text-xs bg-white border border-green-300 text-green-700 hover:bg-green-50 rounded transition-colors"
            >
              <Plus size={12} className="mr-1" />
              Success
            </button>
            <button
              onClick={() => onAddScreen('terminal')}
              className="inline-flex items-center px-2 py-1 text-xs bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <Plus size={12} className="mr-1" />
              Terminal
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className="relative min-h-96 bg-white rounded-lg border-2 border-dashed border-gray-200 p-4"
          onDrop={handleDrop}
          onDragOver={onDragOver}
          onClick={() => onSelectComponent(null)}
        >
          {screen.layout.children.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <p className="text-sm mb-1">Start building your WhatsApp Flow</p>
                <p className="text-xs">Drag components from the sidebar to create your flow</p>
                <div className="mt-3 text-xs text-gray-500">
                  <p>✓ Meta-compliant components</p>
                  <p>✓ Real-time validation</p>
                  <p>✓ Export-ready JSON</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {screen.layout.children.map((child, index) => {
                const componentId = `${screen.id}_${index}`;
                return (
                  <MetaCanvasComponent
                    key={index}
                    component={child}
                    componentIndex={index}
                    isSelected={selectedComponent === componentId}
                    hasErrors={validationErrors[componentId]?.length > 0}
                    errors={validationErrors[componentId] || []}
                    onSelect={() => onSelectComponent(componentId)}
                    onUpdate={(updates) => onComponentUpdate(index, updates)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Canvas footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Components: {screen.layout.children.length}</span>
            <span>Errors: {Object.keys(validationErrors).filter(key => key.startsWith(screen.id)).length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Meta WhatsApp Flows API v7.1 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}