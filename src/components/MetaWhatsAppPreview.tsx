import React from 'react';
import { MetaFlowScreen } from '../types/metaFlow';
import { Phone, Battery, Wifi, Signal, ArrowLeft, MoreVertical, Video, Plus, AlertTriangle } from 'lucide-react';

interface MetaWhatsAppPreviewProps {
  screen: MetaFlowScreen | undefined;
  selectedComponent?: string | null;
  validationErrors?: Record<string, string[]>;
  onSelectComponent?: (id: string | null) => void;
  onAddScreen?: (type?: 'regular' | 'success' | 'terminal') => void;
}

export function MetaWhatsAppPreview({ 
  screen, 
  selectedComponent, 
  validationErrors = {}, 
  onSelectComponent,
  onAddScreen 
}: MetaWhatsAppPreviewProps) {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
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

    const componentContent = (() => {
      switch (component.type) {
        case 'TextHeading':
          return (
            <h1 
              className={`text-sm font-bold text-gray-900 ${
                component['text-align'] === 'center' ? 'text-center' : 
                component['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
            >
              {component.text || 'Heading Text'}
            </h1>
          );
          
        case 'TextSubheading':
          return (
            <h2 
              className={`text-xs font-semibold text-gray-800 ${
                component['text-align'] === 'center' ? 'text-center' : 
                component['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
            >
              {component.text || 'Subheading Text'}
            </h2>
          );
          
        case 'TextBody':
          return (
            <p 
              className={`text-xs text-gray-700 ${
                component['text-align'] === 'center' ? 'text-center' : 
                component['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
            >
              {component.text || 'Body text content'}
            </p>
          );
          
        case 'TextCaption':
          return (
            <p 
              className={`text-xs text-gray-500 ${
                component['text-align'] === 'center' ? 'text-center' : 
                component['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
            >
              {component.text || 'Caption text'}
            </p>
          );
          
        case 'RichText':
          return (
            <div 
              className={`text-xs text-gray-700 ${
                component['text-align'] === 'center' ? 'text-center' : 
                component['text-align'] === 'right' ? 'text-right' : 'text-left'
              } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}
              dangerouslySetInnerHTML={{
                __html: (component.text || 'Rich text content')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/~(.*?)~/g, '<del>$1</del>')
              }}
            />
          );
          
        case 'Image':
          return (
            <img
              src={component.src || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={component['alt-text'] || 'Image'}
              className="w-full max-w-32 rounded"
              style={{ 
                maxHeight: '80px', 
                objectFit: component['scale-type'] === 'contain' ? 'contain' : 'cover',
                width: component.width ? `${Math.min(component.width, 128)}px` : 'auto',
                height: component.height ? `${Math.min(component.height, 80)}px` : 'auto'
              }}
            />
          );
          
        case 'TextInput':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'Input Label'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500">
                {component.placeholder || 'Enter text...'}
              </div>
            </div>
          );
          
        case 'TextArea':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'TextArea Label'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500 h-12">
                {component.placeholder || 'Enter text...'}
              </div>
            </div>
          );
          
        case 'DatePicker':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'Select Date'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500 flex items-center justify-between">
                <span>Select date</span>
                <span>📅</span>
              </div>
            </div>
          );
          
        case 'CheckboxGroup':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'Select Options'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-1">
                {(component['data-source'] || []).slice(0, 3).map((option: any, optIndex: number) => (
                  <div key={optIndex} className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-gray-300 rounded"></div>
                    <span className="text-xs text-gray-700">{option.title}</span>
                  </div>
                ))}
                {(component['data-source'] || []).length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{(component['data-source'] || []).length - 3} more options
                  </div>
                )}
              </div>
            </div>
          );
          
        case 'RadioButtonsGroup':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'Choose Option'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-1">
                {(component['data-source'] || []).slice(0, 3).map((option: any, optIndex: number) => (
                  <div key={optIndex} className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-700">{option.title}</span>
                  </div>
                ))}
                {(component['data-source'] || []).length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{(component['data-source'] || []).length - 3} more options
                  </div>
                )}
              </div>
            </div>
          );
          
        case 'Dropdown':
          return (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {component.label || 'Select Option'}
                {component.required && <span className="text-red-500">*</span>}
              </label>
              <div className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500 flex items-center justify-between">
                <span>Choose...</span>
                <span>▼</span>
              </div>
            </div>
          );
          
        case 'Footer':
          return (
            <div className="mt-4 pt-3 border-t border-gray-200 bg-gray-50 -mx-3 -mb-3 px-3 pb-3">
              <div className="flex justify-between items-center">
                {component['left-caption'] && (
                  <button className="px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                    {component['left-caption']}
                  </button>
                )}
                {component['center-caption'] && (
                  <span className="text-xs text-gray-500 font-medium">{component['center-caption']}</span>
                )}
                {component['right-caption'] && (
                  <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    {component['right-caption']}
                  </button>
                )}
              </div>
            </div>
          );
          
        case 'OptIn':
          return (
            <div className="flex items-start space-x-2">
              <div className="w-3 h-3 border border-gray-300 rounded mt-0.5"></div>
              <span className="text-xs text-gray-700">
                {component.label || 'I agree to the terms'}
                {component.required && <span className="text-red-500">*</span>}
              </span>
            </div>
          );
          
        case 'EmbeddedLink':
          return (
            <span className="text-xs text-blue-600 underline hover:text-blue-800">
              {component.text || 'Click here'}
            </span>
          );
          
        default:
          return (
            <div className="p-2 bg-gray-100 rounded text-xs text-gray-600 border border-dashed border-gray-300">
              <div className="flex items-center space-x-1">
                <AlertTriangle size={12} className="text-yellow-500" />
                <span>Unknown: {component.type}</span>
              </div>
            </div>
          );
      }
    })();

    return (
      <div
        key={index}
        onClick={handleClick}
        className={`relative mb-3 p-2 rounded cursor-pointer transition-all ${
          isSelected 
            ? 'ring-2 ring-blue-500 bg-blue-50' 
            : 'hover:bg-gray-50 hover:ring-1 hover:ring-gray-300'
        } ${hasErrors ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
      >
        {componentContent}
        
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
        )}
        
        {hasErrors && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center">
            <AlertTriangle size={8} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  if (!screen) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Flow Builder</h3>
          <p className="text-sm text-gray-500 mb-4">Create your first screen to start building</p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => onAddScreen?.('regular')}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Screen
            </button>
          </div>
        </div>
        
        {/* Empty Phone mockup */}
        <div className="mx-auto w-80 bg-black rounded-2xl p-2 shadow-2xl">
          <div className="bg-white rounded-xl h-96 overflow-hidden flex flex-col">
            <div className="bg-gray-900 text-white px-3 py-1 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Signal size={10} />
                <Wifi size={10} />
              </div>
              <div>{formatTime()}</div>
              <div className="flex items-center space-x-1">
                <Battery size={10} />
                <span>100%</span>
              </div>
            </div>
            <div className="bg-green-600 text-white px-3 py-2 flex items-center space-x-2">
              <ArrowLeft size={14} />
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">B</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Business</div>
                <div className="text-xs opacity-90">Flow Builder</div>
              </div>
              <div className="flex space-x-2">
                <Video size={12} />
                <Phone size={12} />
                <MoreVertical size={12} />
              </div>
            </div>
            <div className="flex-1 bg-gray-50 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <p className="text-sm">No screen available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">WhatsApp Flow Preview</h3>
        <p className="text-sm text-gray-500">Drag components here to build your flow</p>
        <div className="flex space-x-1 justify-center mt-2">
          <button
            onClick={() => onAddScreen?.('regular')}
            className="inline-flex items-center px-2 py-1 text-xs bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50 rounded transition-colors"
          >
            <Plus size={12} className="mr-1" />
            Screen
          </button>
          <button
            onClick={() => onAddScreen?.('success')}
            className="inline-flex items-center px-2 py-1 text-xs bg-white border border-green-300 text-green-700 hover:bg-green-50 rounded transition-colors"
          >
            <Plus size={12} className="mr-1" />
            Success
          </button>
          <button
            onClick={() => onAddScreen?.('terminal')}
            className="inline-flex items-center px-2 py-1 text-xs bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <Plus size={12} className="mr-1" />
            Terminal
          </button>
        </div>
      </div>
      
      {/* Phone mockup with direct editing */}
      <div className="mx-auto w-80 bg-black rounded-2xl p-2 shadow-2xl">
        <div className="bg-white rounded-xl h-[500px] overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="bg-gray-900 text-white px-3 py-1 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Signal size={10} />
              <Wifi size={10} />
            </div>
            <div>{formatTime()}</div>
            <div className="flex items-center space-x-1">
              <Battery size={10} />
              <span>100%</span>
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="bg-green-600 text-white px-3 py-2 flex items-center space-x-2">
            <ArrowLeft size={14} />
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">B</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Business</div>
              <div className="text-xs opacity-90">Flow Active</div>
            </div>
            <div className="flex space-x-2">
              <Video size={12} />
              <Phone size={12} />
              <MoreVertical size={12} />
            </div>
          </div>

          {/* Flow content - Direct editing area */}
          <div 
            className="flex-1 bg-gray-50 p-3 overflow-y-auto"
            onClick={() => onSelectComponent?.(null)}
          >
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-h-full">
              <div className="text-xs text-gray-500 mb-3 text-center">WhatsApp Flow</div>
              
              {screen.layout.children.map((component, index) => 
                renderFlowComponent(component, index)
              )}
              
              {screen.layout.children.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  <p className="text-sm mb-1">Drop components here</p>
                  <p className="text-xs">Drag from the sidebar to add components</p>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>✓ Add Footer component (required by Meta)</p>
                    <p>✓ Configure navigation actions</p>
                    <p>✓ Test with real data</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="bg-white border-t border-gray-200 px-3 py-2">
            <div className="text-center text-xs text-gray-500">
              WhatsApp Business • Meta v7.1 Compliant
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Live Preview • Click components to edit • Footer required</p>
      </div>
    </div>
  );
}