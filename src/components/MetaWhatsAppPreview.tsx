import React, { useState } from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { Phone, Battery, Wifi, Signal, MoreVertical, Plus, AlertTriangle, Trash2 } from 'lucide-react';

interface MetaWhatsAppPreviewProps {
  screen: MetaFlowScreen | undefined;
  selectedComponent?: string | null;
  validationErrors?: Record<string, string[]>;
  onSelectComponent?: (id: string | null) => void;
  onAddScreen?: (type?: 'regular' | 'success' | 'terminal') => void;
  onDeleteComponent?: (componentIndex: number) => void;
  onDeleteScreen?: (screenId: string) => void;
  onAddComponent?: (componentType: string) => void;
}

export function MetaWhatsAppPreview({ 
  screen, 
  selectedComponent, 
  validationErrors = {}, 
  onSelectComponent,
  onAddScreen,
  onDeleteComponent,
  onDeleteScreen,
  onAddComponent
}: MetaWhatsAppPreviewProps) {
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

  const renderFlowComponent = (component: any, index: number) => {
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

    const componentContent = (() => {
      const props = component.props || component; // Handle both new and old format
      
      switch (component.type) {
        case 'TextHeading':
          return (
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {props.text || 'Heading Text'}
              </h1>
            </div>
          );
          
        case 'TextSubheading':
          return (
            <div className="text-center">
              <h2 className="text-base font-semibold text-gray-800 leading-tight">
                {props.text || 'Subheading Text'}
              </h2>
            </div>
          );
          
        case 'TextBody':
          return (
            <div className="text-center">
              <p className={`text-sm text-gray-700 leading-relaxed ${
                props['text-align'] === 'center' ? 'text-center' : 
                props['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${props['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}>
                {props.text || 'Body text content'}
              </p>
            </div>
          );
          
        case 'TextCaption':
          return (
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                {props.text || 'Caption text'}
              </p>
            </div>
          );
          
        case 'RichText':
          return (
            <div className="text-center">
              <div className={`text-sm text-gray-700 leading-relaxed ${
                props['text-align'] === 'center' ? 'text-center' : 
                props['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${props['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
                dangerouslySetInnerHTML={{
                  __html: (props.text || 'Rich text content')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/~(.*?)~/g, '<del>$1</del>')
                }}
              />
            </div>
          );
          
        case 'Image':
          return (
            <div className="flex justify-center">
              <img
                src={props.src || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={props['alt-text'] || 'Image'}
                className="rounded-lg max-w-full"
                style={{ 
                  maxHeight: '200px',
                  objectFit: props['scale-type'] === 'contain' ? 'contain' : 'cover'
                }}
              />
            </div>
          );
          
        case 'TextInput':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Input Label'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={props['input-type'] || 'text'}
                placeholder={props.placeholder || 'Enter text...'}
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              />
              {props['helper-text'] && (
                <p className="text-xs text-gray-500">{props['helper-text']}</p>
              )}
            </div>
          );
          
        case 'TextArea':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'TextArea Label'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                placeholder={props.placeholder || 'Enter text...'}
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                maxLength={props['max-length'] || 1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
                rows={3}
              />
              {props['helper-text'] && (
                <p className="text-xs text-gray-500">{props['helper-text']}</p>
              )}
            </div>
          );
          
        case 'DatePicker':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Date'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              />
              {props['availability-selector']?.enabled && (
                <p className="text-xs text-gray-500">
                  Available for next {props['availability-selector']['num-days']} days
                </p>
              )}
            </div>
          );
          
        case 'CheckboxGroup':
          return (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Options'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[props.name]?.includes(option.id) || false}
                      onChange={(e) => {
                        const currentValues = formData[props.name] || [];
                        const newValues = e.target.checked 
                          ? [...currentValues, option.id]
                          : currentValues.filter((id: string) => id !== option.id);
                        handleFormInputChange(props.name, newValues);
                      }}
                      disabled={!props.enabled}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{option.title}</span>
                      {option.description && (
                        <p className="text-xs text-gray-500">{option.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
          
        case 'RadioButtonsGroup':
          return (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Choose Option'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={props.name}
                      value={option.id}
                      checked={formData[props.name] === option.id}
                      onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                      disabled={!props.enabled}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{option.title}</span>
                      {option.description && (
                        <p className="text-xs text-gray-500">{option.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
          
        case 'Dropdown':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Option'}
                {props.required && <span className="text-red-500">*</span>}
              </label>
              <select
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              >
                <option value="">Select an option</option>
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <option key={optIndex} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          );
          
        case 'Footer':
          return (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="text-xs text-gray-500">{props['left-caption'] || ''}</span>
              <span className="text-xs text-gray-500">{props['center-caption'] || ''}</span>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                {props['right-caption'] || 'Continue'}
              </button>
            </div>
          );
          
        case 'OptIn':
          return (
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[props.name] || false}
                  onChange={(e) => handleFormInputChange(props.name, e.target.checked)}
                  disabled={!props.enabled}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                />
                <span className="text-sm text-gray-700">{props.label || 'Opt-in text'}</span>
              </label>
            </div>
          );
          
        case 'EmbeddedLink':
          return (
            <div className="text-center">
              <a 
                href={props.href || '#'} 
                className="text-sm text-green-600 hover:text-green-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.text || 'Visit our website'}
              </a>
            </div>
          );
          
        default:
          return (
            <div className="text-center text-gray-500 text-sm">
              {component.type} component
            </div>
          );
      }
    })();

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
        
        {componentContent}
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
          <p className="text-sm text-gray-500 mb-6">Create your first screen to start building your WhatsApp Flow</p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => onAddScreen?.('regular')}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus size={16} className="mr-2" />
              Create Screen
            </button>
          </div>
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
      <div className={`relative ${deviceType === 'ios' ? 'w-80' : 'w-80'}`}>
        {/* Device Frame */}
        <div className={`relative mx-auto ${deviceType === 'ios' ? 'w-80 h-[600px]' : 'w-80 h-[600px]'} bg-black rounded-3xl p-2 shadow-2xl`}>
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
                      {renderFlowComponent(child, index)}
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
              {screen.success && (
                <>
                  <span>•</span>
                  <span className="text-green-600">Success Screen</span>
                </>
              )}
              {screen.terminal && (
                <>
                  <span>•</span>
                  <span className="text-red-600">Terminal Screen</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}