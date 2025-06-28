import React, { useState } from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { Phone, Battery, Wifi, Signal, ArrowLeft, MoreVertical, Trash2, Plus, AlertTriangle } from 'lucide-react';

interface WhatsAppFlowPreviewProps {
  screen: MetaFlowScreen | undefined;
  selectedComponent?: string | null;
  validationErrors?: Record<string, string[]>;
  onSelectComponent?: (id: string | null) => void;
  onDeleteComponent?: (componentIndex: number) => void;
  onAddScreen?: (type?: 'regular' | 'success' | 'terminal') => void;
}

export function WhatsAppFlowPreview({ 
  screen, 
  selectedComponent, 
  validationErrors = {}, 
  onSelectComponent,
  onDeleteComponent,
  onAddScreen
}: WhatsAppFlowPreviewProps) {
  const [deviceType, setDeviceType] = useState<'android' | 'ios'>('android');
  const [isFormMode, setIsFormMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleFormInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderComponent = (component: any, index: number) => {
    const componentId = screen ? `${screen.id}_${index}` : '';
    const isSelected = selectedComponent === componentId;
    const hasErrors = validationErrors[componentId]?.length > 0;
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectComponent) {
        onSelectComponent(componentId);
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteComponent) {
        onDeleteComponent(index);
      }
    };

    const getComponentContent = () => {
      switch (component.type) {
        case 'TextHeading':
          return (
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {component.text || 'Heading Text'}
              </h1>
            </div>
          );
          
        case 'TextBody':
          return (
            <div className="text-center">
              <p className="text-sm text-gray-700 leading-relaxed">
                {component.text || 'Body text content'}
              </p>
            </div>
          );
          
        case 'TextInput':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {component.label || 'Input Label'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={component['input-type'] || 'text'}
                placeholder={component.placeholder || 'Enter text...'}
                value={formData[component.name] || ''}
                onChange={(e) => handleFormInputChange(component.name, e.target.value)}
                disabled={!component.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              />
            </div>
          );
          
        case 'TextArea':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {component.label || 'TextArea Label'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                placeholder={component.placeholder || 'Enter text...'}
                value={formData[component.name] || ''}
                onChange={(e) => handleFormInputChange(component.name, e.target.value)}
                disabled={!component.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
                rows={3}
              />
            </div>
          );
          
        case 'CheckboxGroup':
          return (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {component.label || 'Select Options'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-2">
                {(component['data-source'] || []).map((option: any, optIndex: number) => (
                  <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[component.name]?.includes(option.id) || false}
                      onChange={(e) => {
                        const currentValues = formData[component.name] || [];
                        const newValues = e.target.checked 
                          ? [...currentValues, option.id]
                          : currentValues.filter((id: string) => id !== option.id);
                        handleFormInputChange(component.name, newValues);
                      }}
                      disabled={!component.enabled}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.title}</span>
                  </label>
                ))}
              </div>
            </div>
          );
          
        case 'Footer':
          return (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="text-xs text-gray-500">{component['left-caption'] || ''}</span>
              <span className="text-xs text-gray-500">{component['center-caption'] || ''}</span>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                {component['right-caption'] || 'Continue'}
              </button>
            </div>
          );
          
        default:
          return (
            <div className="text-center text-gray-500 text-sm">
              {component.type} component
            </div>
          );
      }
    };

    return (
      <div 
        className={`relative p-4 border rounded-lg transition-all cursor-pointer ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        } ${hasErrors ? 'border-red-300 bg-red-50' : ''}`}
        onClick={handleClick}
      >
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete component"
        >
          <Trash2 size={14} />
        </button>
        
        {/* Error indicator */}
        {hasErrors && (
          <div className="absolute top-2 left-2 p-1 text-red-500">
            <AlertTriangle size={14} />
          </div>
        )}
        
        {getComponentContent()}
      </div>
    );
  };

  if (!screen) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Screen Selected</h3>
          <p className="text-sm text-gray-500 mb-6">Create your first screen to start building</p>
          <button
            onClick={() => onAddScreen?.('regular')}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={16} className="mr-2" />
            Create Screen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
      {/* Device Selector */}
      <div className="absolute top-4 left-4 flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setDeviceType('android')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            deviceType === 'android' 
              ? 'bg-green-100 text-green-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Android
        </button>
        <button
          onClick={() => setDeviceType('ios')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            deviceType === 'ios' 
              ? 'bg-green-100 text-green-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          iOS
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="absolute top-4 right-4 flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setIsFormMode(false)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            !isFormMode 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setIsFormMode(true)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            isFormMode 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Fill Form
        </button>
      </div>

      {/* Mobile Device Frame */}
      <div className="relative w-80">
        <div className="relative mx-auto w-80 h-[600px] bg-black rounded-3xl p-2 shadow-2xl">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
            {/* Status Bar */}
            <div className={`${deviceType === 'ios' ? 'bg-black' : 'bg-green-600'} text-white px-4 py-2 flex items-center justify-between text-xs`}>
              <div className="flex items-center space-x-1">
                <Signal size={12} />
                <Wifi size={12} />
              </div>
              <div className="font-medium">{formatTime()}</div>
              <div className="flex items-center space-x-1">
                <Battery size={12} />
                <span>100%</span>
              </div>
            </div>

            {/* WhatsApp Header */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Business Flow</div>
                <div className="text-xs opacity-90">Interactive Form</div>
              </div>
              <button className="p-1 hover:bg-green-700 rounded">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Flow Content */}
            <div className="flex-1 bg-gray-50 p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
              {screen.layout.children.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">No components yet</p>
                  <p className="text-xs text-gray-400">Drag components from the sidebar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {screen.layout.children.map((child, index) => (
                    <div key={index} className="group">
                      {renderComponent(child, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Screen Info */}
        <div className="mt-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{screen.title}</h3>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Components: {screen.layout.children.length}</span>
              <span>•</span>
              <span>ID: {screen.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 