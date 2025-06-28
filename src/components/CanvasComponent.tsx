import React from 'react';
import { FlowComponent } from '../types/flow';
import * as Icons from 'lucide-react';

interface CanvasComponentProps {
  component: FlowComponent;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FlowComponent>) => void;
}

export function CanvasComponent({ component, isSelected, onSelect, onUpdate }: CanvasComponentProps) {
  const handleDrag = (e: React.DragEvent) => {
    e.dataTransfer.setData('component-id', component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <h2 className="text-xl font-semibold text-gray-900">
            {component.properties.text || 'Heading'}
          </h2>
        );
      case 'text':
        return (
          <p className="text-gray-700">
            {component.properties.text || 'Text content'}
          </p>
        );
      case 'input':
        return (
          <div className="space-y-1">
            {component.label && (
              <label className="block text-sm font-medium text-gray-700">
                {component.label}
              </label>
            )}
            <input
              type="text"
              placeholder={component.properties.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              readOnly
            />
          </div>
        );
      case 'choice':
        return (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {component.properties.text || 'Select an option:'}
            </p>
            {(component.properties.options || ['Option 1', 'Option 2']).map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`choice-${component.id}`}
                  className="text-green-600 focus:ring-green-500"
                  readOnly
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'button':
        return (
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            {component.properties.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <img
              src={component.properties.url || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt="Component image"
              className="w-full max-w-xs rounded-lg"
            />
          </div>
        );
      case 'video':
        return (
          <div className="w-full max-w-xs bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <Icons.Video className="text-gray-400" size={32} />
            <span className="ml-2 text-sm text-gray-500">Video Component</span>
          </div>
        );
      case 'document':
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
            <Icons.FileText className="text-gray-400" size={20} />
            <span className="text-sm text-gray-700">
              {component.properties.text || 'Document'}
            </span>
          </div>
        );
      default:
        return <div className="p-4 bg-gray-100 rounded">Unknown component</div>;
    }
  };

  return (
    <div
      className={`absolute cursor-pointer p-2 rounded-lg transition-all ${
        isSelected 
          ? 'ring-2 ring-green-500 bg-green-50' 
          : 'hover:ring-1 hover:ring-gray-300 hover:bg-gray-50'
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDrag={handleDrag}
    >
      {renderComponent()}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}