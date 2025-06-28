import React from 'react';
import { FlowComponent, FlowScreen } from '../types/flow';
import { CanvasComponent } from './CanvasComponent';
import { Plus } from 'lucide-react';

interface CanvasProps {
  screen: FlowScreen | undefined;
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onDrop: (e: React.DragEvent, position: { x: number; y: number }) => void;
  onDragOver: (e: React.DragEvent) => void;
  onComponentUpdate: (id: string, updates: Partial<FlowComponent>) => void;
  onAddScreen: () => void;
}

export function Canvas({
  screen,
  selectedComponent,
  onSelectComponent,
  onDrop,
  onDragOver,
  onComponentUpdate,
  onAddScreen
}: CanvasProps) {
  if (!screen) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No screen selected</p>
          <button
            onClick={onAddScreen}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Screen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{screen.title}</h2>
            <p className="text-sm text-gray-500">Screen ID: {screen.id}</p>
          </div>
          <button
            onClick={onAddScreen}
            className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-300 hover:border-green-300 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus size={14} className="mr-1" />
            Add Screen
          </button>
        </div>

        <div
          className="relative min-h-[600px] bg-white rounded-lg border-2 border-dashed border-gray-200 p-6"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => onSelectComponent(null)}
        >
          {screen.components.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Drop components here</p>
                <p className="text-sm">Drag components from the sidebar to start building your flow</p>
              </div>
            </div>
          ) : (
            screen.components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent === component.id}
                onSelect={() => onSelectComponent(component.id)}
                onUpdate={(updates) => onComponentUpdate(component.id, updates)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}