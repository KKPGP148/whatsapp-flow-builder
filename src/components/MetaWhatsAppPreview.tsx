import React, { useState } from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { Phone, Battery, Wifi, Signal, MoreVertical, Plus, AlertTriangle, Trash2, MessageCircle, ArrowLeft, Video, PhoneCall } from 'lucide-react';

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
  const [deviceType, setDeviceType] = useState<'android' | 'ios'>('android');
  const [isFormMode, setIsFormMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const formatTime = () => {
    const now = new Date();
    if (deviceType === 'ios') {
      return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  };

  const handleFormInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderBusinessMessage = (content: React.ReactNode, isFooter: boolean = false) => {
    if (isFooter) {
      return content;
    }
    
    return (
      <div className="flex justify-start mb-3">
        <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm border border-gray-200">
          <div className="text-gray-800">
            {content}
          </div>
        </div>
      </div>
    );
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

    const getComponentContent = () => {
      const props = component.props || component;
      
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
            <div className="mb-2">
              <img
                src={props.src || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={props['alt-text'] || 'Image'}
                className="rounded-lg max-w-full"
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
            <div className="space-y-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              />
              {props['helper-text'] && (
                <p className="text-sm text-gray-500">{props['helper-text']}</p>
              )}
            </div>
          );
          
        case 'TextArea':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'TextArea Label'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
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
                <p className="text-sm text-gray-500">{props['helper-text']}</p>
              )}
            </div>
          );
          
        case 'DatePicker':
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Date'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                value={formData[props.name] || ''}
                onChange={(e) => handleFormInputChange(props.name, e.target.value)}
                disabled={!props.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 text-sm"
              />
              {props['availability-selector']?.enabled && (
                <p className="text-sm text-gray-500">
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
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-3">
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
                      <span className="text-base text-gray-700 font-medium">{option.title}</span>
                      {option.description && (
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
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
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Choose Option'}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-3">
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
                      <span className="text-base text-gray-700 font-medium">{option.title}</span>
                      {option.description && (
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
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
                {props.required && <span className="text-red-500 ml-1">*</span>}
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

        case 'ChipSelector':
          return (
            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {props.label || 'Select Tags'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(props['data-source'] || []).map((option: any, optIndex: number) => (
                  <span
                    key={optIndex}
                    className={`px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors ${
                      props['chip-style'] === 'secondary'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
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
            <div className="space-y-2 mb-3">
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
            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label || 'Upload Photos'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                />
                <span className="text-sm text-gray-700">{props.label || 'Opt-in text'}</span>
              </label>
            </div>
          );
          
        case 'EmbeddedLink':
          return (
            <div className="text-center mb-2">
              <a 
                href={props.href || '#'} 
                className="text-sm text-green-600 hover:text-green-700 underline"
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
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
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
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-3">
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
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
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
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
            <div className="text-center text-gray-500 text-sm">
              {component.type} component
            </div>
          );
      }
    };

    const isFooter = component.type === 'Footer';

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

  // Separate footer from other components
  const footerComponent = screen.layout.children.find(child => child.type === 'Footer');
  const nonFooterComponents = screen.layout.children.filter(child => child.type !== 'Footer');

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
      {/* Device Selector */}
      <div className="absolute top-4 left-4 flex space-x-2 bg-white rounded-lg p-1 shadow-sm z-10">
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
      <div className="absolute top-4 right-4 flex space-x-2 bg-white rounded-lg p-1 shadow-sm z-10">
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
                {deviceType === 'ios' ? (
                  <>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Signal size={12} />
                    <Wifi size={12} />
                  </>
                )}
              </div>
              <div className="font-medium">{formatTime()}</div>
              <div className="flex items-center space-x-1">
                <Battery size={12} />
                <span>100%</span>
              </div>
            </div>

            {/* WhatsApp Header - Platform specific */}
            <div className={`bg-green-600 text-white px-4 py-3 flex items-center space-x-3 flex-shrink-0 ${
              deviceType === 'ios' ? 'shadow-sm' : ''
            }`}>
              <ArrowLeft size={20} className="text-white" />
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${deviceType === 'ios' ? 'text-base' : 'text-sm'}`}>
                  Business
                </div>
                <div className="text-xs opacity-90">
                  {deviceType === 'ios' ? 'WhatsApp Business' : 'online'}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Video size={20} className="text-white" />
                <PhoneCall size={20} className="text-white" />
                <MoreVertical size={20} className="text-white" />
              </div>
            </div>

            {/* Chat Background */}
            <div 
              className="flex-1 overflow-y-auto min-h-0"
              style={{
                backgroundImage: deviceType === 'ios' 
                  ? 'linear-gradient(to bottom, #e5ddd5, #e5ddd5)'
                  : 'linear-gradient(to bottom, #e5ddd5, #e5ddd5)',
                backgroundSize: '100% 100%'
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => onSelectComponent?.(null)}
            >
              <div className="p-4">
                {nonFooterComponents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                      <Plus size={20} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">No components yet</p>
                    <p className="text-xs text-gray-500">Drag components from the sidebar</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {nonFooterComponents.map((child, index) => (
                      <div key={index} className="group">
                        {renderFlowComponent(child, index)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - WhatsApp style input area */}
            {footerComponent && (
              <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {footerComponent.props?.['left-caption'] && (
                    <button className={`text-sm font-medium transition-colors ${
                      deviceType === 'ios' 
                        ? 'text-blue-600 hover:text-blue-700' 
                        : 'text-green-600 hover:text-green-700'
                    }`}>
                      {footerComponent.props['left-caption']}
                    </button>
                  )}
                  
                  {footerComponent.props?.['center-caption'] && (
                    <span className="text-xs text-gray-500 font-medium">
                      {footerComponent.props['center-caption']}
                    </span>
                  )}
                  
                  {footerComponent.props?.['right-caption'] && (
                    <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      deviceType === 'ios'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}>
                      {footerComponent.props['right-caption']}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screen Info */}
        <div className="mt-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{screen.title}</h3>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Components: {screen.layout.children.length}</span>
              <span>•</span>
              <span>Platform: {deviceType === 'ios' ? 'iOS' : 'Android'}</span>
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