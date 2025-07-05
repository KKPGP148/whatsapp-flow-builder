import React, { useState } from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { X, Battery, MoreVertical, Plus, AlertTriangle, Trash2, Camera, Paperclip } from 'lucide-react';

interface MetaWhatsAppPreviewProps {
  screen: MetaFlowScreen | undefined;
  selectedComponent?: string | null;
  validationErrors?: Record<string, string[]>;
  onSelectComponent?: (id: string | null) => void;
  onDeleteComponent?: (componentIndex: number) => void;
  onAddScreen?: (type?: 'regular' | 'success' | 'terminal') => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

export function MetaWhatsAppPreview({ 
  screen, 
  selectedComponent, 
  validationErrors = {}, 
  onSelectComponent,
  onDeleteComponent,
  onAddScreen,
  onDrop,
  onDragOver
}: MetaWhatsAppPreviewProps) {
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
    
    // Move props definition to the beginning of renderFlowComponent function
    const props = component.props || component;
    
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
            <h1 className={`text-lg font-bold text-gray-900 leading-tight mb-3 ${
              props['text-align'] === 'center' ? 'text-center' : 
              props['text-align'] === 'right' ? 'text-right' : 'text-left'
            }`}>
              {props.text || 'Heading Text'}
            </h1>
          );
          
        case 'TextSubheading':
          return (
            <h2 className={`text-base font-semibold text-gray-800 leading-tight mb-2 ${
              props['text-align'] === 'center' ? 'text-center' : 
              props['text-align'] === 'right' ? 'text-right' : 'text-left'
            }`}>
              {props.text || 'Subheading Text'}
            </h2>
          );
          
        case 'TextBody':
          return (
            <p className={`text-sm text-gray-700 leading-relaxed mb-3 ${
              props['text-align'] === 'center' ? 'text-center' : 
              props['text-align'] === 'right' ? 'text-right' : 'text-left'
            } ${props['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}>
              {props.text || 'Body text content'}
            </p>
          );
          
        case 'TextCaption':
          return (
            <p className={`text-xs text-gray-500 leading-relaxed mb-2 ${
              props['text-align'] === 'center' ? 'text-center' : 
              props['text-align'] === 'right' ? 'text-right' : 'text-left'
            }`}>
              {props.text || 'Caption text'}
            </p>
          );
          
        case 'RichText':
          return (
            <div className={`text-sm text-gray-700 leading-relaxed mb-3 ${
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
          );
          
        case 'Image':
          return (
            <div className="mb-4">
              <img
                src={props.src || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={props['alt-text'] || 'Image'}
                className="rounded-lg max-w-full max-h-[200px] w-full"
                style={{ 
                  objectFit: props['scale-type'] === 'contain' ? 'contain' : 'cover'
                }}
              />
              {props['alt-text'] && (
                <p className="text-xs text-gray-500 mt-1">{props['alt-text']}</p>
              )}
            </div>
          );
          
        case 'TextInput':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Input Label'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={props['input-type'] || 'text'}
                placeholder={props.placeholder || 'Enter text...'}
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm bg-white"
              />
              {props['helper-text'] && (
                <p className="text-xs text-gray-500">{props['helper-text']}</p>
              )}
            </div>
          );
          
        case 'TextArea':
          const currentLength = (formData[props.name] || '').length;
          const maxLength = props['max-length'] || 1000;
          
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'TextArea Label'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                placeholder={props.placeholder || 'Enter text...'}
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                maxLength={maxLength}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm bg-white resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center">
                {props['helper-text'] && (
                  <p className="text-xs text-gray-500">{props['helper-text']}</p>
                )}
                <p className="text-xs text-gray-400 ml-auto">
                  {currentLength} / {maxLength}
                </p>
              </div>
            </div>
          );
          
        case 'DatePicker':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Date'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm bg-white"
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
            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Options'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <label key={optIndex} className="flex items-start space-x-3 cursor-pointer">
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
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
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
              {(props['min-selected-items'] || props['max-selected-items']) && (
                <p className="text-xs text-gray-500">
                  Select {props['min-selected-items'] || 0} to {props['max-selected-items'] || 'unlimited'} options
                </p>
              )}
            </div>
          );
          
        case 'RadioButtonsGroup':
          return (
            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Choose Option'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <label key={optIndex} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={props.name}
                      value={option.id}
                      checked={formData[props.name] === option.id}
                      onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                      disabled={!props.enabled}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
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
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Option'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm bg-white"
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

        case 'ChipSelector':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label || 'Select Tags'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <span
                    key={optIndex}
                    className={`px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors ${
                      props['chip-style'] === 'secondary'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {option.title}
                  </span>
                ))}
              </div>
              {props['max-selected-items'] && (
                <p className="text-xs text-gray-500">
                  Max {props['max-selected-items']} selections
                </p>
              )}
            </div>
          );

        case 'NavigationList':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label || 'Choose Option'}
              </label>
              <div className="space-y-2">
                {(props['list-items'] || []).map((item: any, itemIndex: number) => (
                  <div
                    key={itemIndex}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {item['image-src'] && (
                      <img
                        src={item['image-src']}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'PhotoPicker':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label || 'Upload Photos'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <Camera size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {props['photo-source'] === 'camera' ? 'Take Photo' :
                   props['photo-source'] === 'gallery' ? 'Choose from Gallery' :
                   'Camera or Gallery'}
                </p>
                {props['max-photos'] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max {props['max-photos']} photos
                  </p>
                )}
              </div>
            </div>
          );

        case 'DocumentPicker':
          return (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label || 'Upload Document'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <Paperclip size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Choose Document</p>
                {props['allowed-types'] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Allowed: {props['allowed-types'].join(', ')}
                  </p>
                )}
                {props['max-file-size'] && (
                  <p className="text-xs text-gray-500">
                    Max size: {Math.round(props['max-file-size'] / 1024 / 1024)}MB
                  </p>
                )}
              </div>
            </div>
          );
          
        case 'OptIn':
          return (
            <div className="space-y-2 mb-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[props.name] || false}
                  onChange={(e) => handleFormInputChange(props.name, e.target.checked)}
                  disabled={!props.enabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-700">{props.label || 'I agree to the terms'}</span>
              </label>
            </div>
          );
          
        case 'EmbeddedLink':
          return (
            <div className="text-center mb-4">
              <a 
                href={props.href || '#'} 
                className="text-sm text-blue-600 hover:text-blue-700 underline inline-flex items-center space-x-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{props.text || 'Visit our website'}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );

        case 'If':
          return (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-yellow-800 mb-1">Conditional Logic</p>
              <p className="text-xs text-yellow-700">
                If {props.condition?.variable} {props.condition?.operator} "{props.condition?.value}"
              </p>
              <div className="mt-2 text-xs text-yellow-600">
                <p>✓ True → {props['true-action']?.next?.name || 'Next Screen'}</p>
                <p>✗ False → {props['false-action']?.next?.name || 'Fallback Screen'}</p>
              </div>
            </div>
          );

        case 'Switch':
          return (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-purple-800 mb-1">Multi-Case Logic</p>
              <p className="text-xs text-purple-700 mb-2">
                Switch on: {props['switch-on']}
              </p>
              <div className="text-xs text-purple-600 space-y-1">
                {(props.cases || []).slice(0, 2).map((case_: any, index: number) => (
                  <p key={index}>• {case_.value} → {case_.action?.next?.name}</p>
                ))}
                {(props.cases || []).length > 2 && (
                  <p>... +{(props.cases || []).length - 2} more cases</p>
                )}
                <p>Default → {props['default-action']?.next?.name}</p>
              </div>
            </div>
          );

        case 'DataExchange':
          return (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-blue-800 mb-1">API Call</p>
              <p className="text-xs text-blue-700 mb-1">
                {props.method} {props.endpoint?.split('/').pop()}
              </p>
              <div className="text-xs text-blue-600">
                <p>• Headers: {Object.keys(props.headers || {}).length}</p>
                <p>• Payload: {Object.keys(props.payload || {}).length} fields</p>
                <p>• Retry: {props['error-handling']?.['retry-count'] || 0}x</p>
              </div>
            </div>
          );

        case 'FlowCompletion':
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-green-800 mb-1">
                {props['completion-type'] === 'success' ? 'Success' : 'Error'} Completion
              </p>
              <p className="text-xs text-green-700">
                {props['completion-message']?.substring(0, 50)}...
              </p>
              {props['return-data'] && (
                <p className="text-xs text-green-600 mt-1">
                  Return data: {Object.keys(props['return-data']).length} fields
                </p>
              )}
            </div>
          );
          
        default:
          return (
            <div className="text-center text-gray-500 text-sm mb-4">
              {component.type} component
            </div>
          );
      }
    };

    const isFooter = component.type === 'Footer';

    return (
      <div 
        className={`relative transition-all cursor-pointer group ${
          isSelected && !isFooter ? 'ring-2 ring-blue-400 ring-opacity-75 rounded-lg' : ''
        } ${hasErrors && !isFooter ? 'ring-2 ring-red-400 ring-opacity-75 rounded-lg' : ''}`}
        onClick={handleClick}
      >
        {/* Delete button for non-footer components */}
        {!isFooter && (
          <button
            onClick={handleDelete}
            className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Delete component"
          >
            <Trash2 size={12} />
          </button>
        )}
        
        {/* Error indicator */}
        {hasErrors && !isFooter && (
          <div className="absolute top-1 left-1 p-1 text-red-500 z-10">
            <AlertTriangle size={12} />
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

  // Separate footer from other components
  const footerComponent = screen.layout.children.find(child => child.type === 'Footer');
  const nonFooterComponents = screen.layout.children.filter(child => child.type !== 'Footer');

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Device Frame - Adjusted to match Meta preview dimensions */}
      <div className="relative w-[280px]">
        {/* Device Frame - iOS-like design with adjusted proportions */}
        <div className="relative mx-auto w-[280px] bg-black rounded-[2rem] p-1 shadow-2xl">
          <div className="w-full h-[560px] bg-white rounded-[1.75rem] overflow-hidden flex flex-col">
            
            {/* Status Bar - iOS style with exact time format */}
            <div className="bg-white text-black px-4 py-2 flex items-center justify-between text-xs flex-shrink-0">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              </div>
              <div className="font-medium">{formatTime()}</div>
              <div className="flex items-center space-x-1">
                <Battery size={12} />
                <span>100%</span>
              </div>
            </div>

            {/* WhatsApp Header - Refined to match Meta preview */}
            <div className="bg-[#25D366] text-white px-4 py-3 flex items-center space-x-3 flex-shrink-0 shadow-sm">
              <X size={18} className="text-white" />
              <div className="w-8 h-8 bg-[#128c7e] rounded-full flex items-center justify-center">
                {/* Solid green circle without nested elements */}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {screen.title}
                </div>
                <div className="text-xs opacity-90">
                  WhatsApp Business
                </div>
              </div>
              <MoreVertical size={18} className="text-white" />
            </div>

            {/* Chat Background with scrollable content - Removed extra container styling */}
            <div 
              className="flex-1 overflow-y-auto min-h-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%)
                `,
                backgroundColor: '#e5ddd5'
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => onSelectComponent?.(null)}
            >
              <div className="p-3">
                {nonFooterComponents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                      <Plus size={20} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">No components yet</p>
                    <p className="text-xs text-gray-500">Drag components from the sidebar</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                    {nonFooterComponents.map((child, index) => (
                      <div key={index} className="group">
                        {renderFlowComponent(child, index)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer - Styled with green color palette */}
            {footerComponent && (
              <div className="bg-[#075e54] border-t border-[#075e54] p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {footerComponent.props?.['left-caption'] && (
                    <button className="text-sm font-medium text-white hover:text-gray-200 transition-colors">
                      {footerComponent.props['left-caption']}
                    </button>
                  )}
                  
                  {footerComponent.props?.['center-caption'] && (
                    <span className="text-xs text-white font-medium">
                      {footerComponent.props['center-caption']}
                    </span>
                  )}
                  
                  {footerComponent.props?.['right-caption'] && (
                    <button className="px-4 py-2 bg-[#25D366] hover:bg-[#128c7e] text-white rounded-full text-sm font-medium transition-colors">
                      {footerComponent.props['right-caption']}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screen Info - Compact */}
        <div className="mt-3 text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <h3 className="text-xs font-medium text-gray-900 mb-1">{screen.title}</h3>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
              <span>Components: {screen.layout.children.length}</span>
              <span>•</span>
              <span>Max: 10</span>
              {screen.success && (
                <>
                  <span>•</span>
                  <span className="text-green-600">Success</span>
                </>
              )}
              {screen.terminal && (
                <>
                  <span>•</span>
                  <span className="text-red-600">Terminal</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}