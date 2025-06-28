import React from 'react';
import { FlowComponent } from '../types/flow';
import { Trash2, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  component: FlowComponent | null;
  onUpdate: (updates: Partial<FlowComponent>) => void;
  onDelete: () => void;
}

export function PropertiesPanel({ component, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          </div>
          <div className="text-center text-gray-500">
            <p>Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdate({
      properties: {
        ...component.properties,
        [property]: value
      }
    });
  };

  const handleLabelChange = (value: string) => {
    onUpdate({ label: value });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          </div>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Type
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 capitalize">
              {component.type}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {(component.type === 'heading' || component.type === 'text' || component.type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <textarea
                value={component.properties.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
              />
            </div>
          )}

          {component.type === 'input' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={component.properties.placeholder || ''}
                  onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={component.properties.required || false}
                  onChange={(e) => handlePropertyChange('required', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                  Required field
                </label>
              </div>
            </>
          )}

          {component.type === 'choice' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={component.properties.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={(component.properties.options || []).join('\n')}
                  onChange={(e) => handlePropertyChange('options', e.target.value.split('\n').filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                />
              </div>
            </>
          )}

          {(component.type === 'image' || component.type === 'video' || component.type === 'document') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={component.properties.url || ''}
                onChange={(e) => handlePropertyChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {component.type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <select
                  value={component.properties.action || 'next'}
                  onChange={(e) => handlePropertyChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="next">Next Screen</option>
                  <option value="submit">Submit Form</option>
                  <option value="url">Open URL</option>
                  <option value="end">End Flow</option>
                </select>
              </div>
              
              {component.properties.action === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={component.properties.url || ''}
                    onChange={(e) => handlePropertyChange('url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              {component.properties.action === 'next' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Screen ID
                  </label>
                  <input
                    type="text"
                    value={component.properties.nextScreen || ''}
                    onChange={(e) => handlePropertyChange('nextScreen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="screen-2"
                  />
                </div>
              )}
            </>
          )}

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Position</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  value={component.position.x}
                  onChange={(e) => onUpdate({ position: { ...component.position, x: parseInt(e.target.value) || 0 } })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  value={component.position.y}
                  onChange={(e) => onUpdate({ position: { ...component.position, y: parseInt(e.target.value) || 0 } })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}