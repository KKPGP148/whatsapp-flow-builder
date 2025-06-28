import React from 'react';
import { MetaFlowComponent } from '../types/metaFlow';
import * as Icons from 'lucide-react';

interface MetaCanvasComponentProps {
  component: any;
  componentIndex: number;
  isSelected: boolean;
  hasErrors: boolean;
  errors: string[];
  onSelect: () => void;
  onUpdate: (updates: Partial<MetaFlowComponent>) => void;
}

export function MetaCanvasComponent({ 
  component, 
  componentIndex,
  isSelected, 
  hasErrors, 
  errors, 
  onSelect, 
  onUpdate 
}: MetaCanvasComponentProps) {
  const renderComponent = () => {
    switch (component.type) {
      case 'TextHeading':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Heading1 size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Text Heading</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {component.text || 'Heading Text'}
            </h1>
          </div>
        );

      case 'TextSubheading':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Heading2 size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Text Subheading</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {component.text || 'Subheading Text'}
            </h2>
          </div>
        );

      case 'TextBody':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Type size={16} className="text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Text Body</span>
            </div>
            <p className={`text-base ${
              component['text-align'] === 'center' ? 'text-center' : 
              component['text-align'] === 'right' ? 'text-right' : 'text-left'
            } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}>
              {component.text || 'Body text content'}
            </p>
          </div>
        );

      case 'TextCaption':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.FileText size={16} className="text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Text Caption</span>
            </div>
            <p className="text-sm text-gray-600">
              {component.text || 'Caption text'}
            </p>
          </div>
        );

      case 'RichText':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Bold size={16} className="text-purple-600" />
              <span className="text-xs font-medium text-gray-600">Rich Text</span>
            </div>
            <div className={`text-base ${
              component['text-align'] === 'center' ? 'text-center' : 
              component['text-align'] === 'right' ? 'text-right' : 'text-left'
            } ${component['font-weight'] === 'bold' ? 'font-bold' : 'font-normal'}`}>
              <div dangerouslySetInnerHTML={{
                __html: (component.text || 'Rich text content')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/~(.*?)~/g, '<del>$1</del>')
              }} />
            </div>
          </div>
        );

      case 'Image':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Image size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-600">Image</span>
            </div>
            <div className="max-w-xs">
              <img
                src={component.src || 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={component['alt-text'] || 'Image'}
                className={`rounded-lg ${component['scale-type'] === 'contain' ? 'object-contain' : 'object-cover'}`}
                style={{ 
                  width: component.width || 200, 
                  height: component.height || 150 
                }}
              />
              {component['alt-text'] && (
                <p className="text-xs text-gray-500 mt-1">{component['alt-text']}</p>
              )}
            </div>
          </div>
        );

      case 'TextInput':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Edit3 size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Text Input</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.label || 'Input Label'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={component['input-type'] || 'text'}
                placeholder={component.placeholder || 'Enter text...'}
                disabled={!component.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                readOnly
              />
              {component['helper-text'] && (
                <p className="text-xs text-gray-500 mt-1">{component['helper-text']}</p>
              )}
            </div>
          </div>
        );

      case 'TextArea':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.AlignLeft size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Text Area</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.label || 'TextArea Label'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                placeholder={component.placeholder || 'Enter text...'}
                disabled={!component.enabled}
                maxLength={component['max-length'] || 1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                rows={3}
                readOnly
              />
              {component['helper-text'] && (
                <p className="text-xs text-gray-500 mt-1">{component['helper-text']}</p>
              )}
            </div>
          </div>
        );

      case 'DatePicker':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Calendar size={16} className="text-indigo-600" />
              <span className="text-xs font-medium text-gray-600">Date Picker</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.label || 'Select Date'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                disabled={!component.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                readOnly
              />
              {component['availability-selector']?.enabled && (
                <p className="text-xs text-gray-500 mt-1">
                  Available for next {component['availability-selector']['num-days']} days
                </p>
              )}
            </div>
          </div>
        );

      case 'CheckboxGroup':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.CheckSquare size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-600">Checkbox Group</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Select Options'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {(component['data-source'] || []).map((option: any, index: number) => (
                  <label key={option.id || index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      disabled={!option.enabled}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      readOnly
                    />
                    <span className="text-sm text-gray-700">{option.title}</span>
                    {option.description && (
                      <span className="text-xs text-gray-500">({option.description})</span>
                    )}
                  </label>
                ))}
              </div>
              {(component['min-selected-items'] || component['max-selected-items']) && (
                <p className="text-xs text-gray-500 mt-1">
                  Select {component['min-selected-items'] || 0} to {component['max-selected-items'] || 'unlimited'} options
                </p>
              )}
            </div>
          </div>
        );

      case 'RadioButtonsGroup':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Circle size={16} className="text-orange-600" />
              <span className="text-xs font-medium text-gray-600">Radio Buttons</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Choose Option'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {(component['data-source'] || []).map((option: any, index: number) => (
                  <label key={option.id || index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`radio-${componentIndex}`}
                      disabled={!option.enabled}
                      className="border-gray-300 text-orange-600 focus:ring-orange-500"
                      readOnly
                    />
                    <span className="text-sm text-gray-700">{option.title}</span>
                    {option.description && (
                      <span className="text-xs text-gray-500">({option.description})</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Dropdown':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.ChevronDown size={16} className="text-purple-600" />
              <span className="text-xs font-medium text-gray-600">Dropdown</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.label || 'Select Option'}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                disabled={!component.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
              >
                <option value="">Choose...</option>
                {(component['data-source'] || []).map((option: any, index: number) => (
                  <option key={option.id || index} value={option.id} disabled={!option.enabled}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'ChipSelector':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Tag size={16} className="text-pink-600" />
              <span className="text-xs font-medium text-gray-600">Chip Selector</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Select Tags'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(component['data-source'] || []).map((option: any, index: number) => (
                  <span
                    key={option.id || index}
                    className={`px-3 py-1 rounded-full text-xs border cursor-pointer ${
                      component['chip-style'] === 'secondary'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {option.title}
                  </span>
                ))}
              </div>
              {component['max-selected-items'] && (
                <p className="text-xs text-gray-500 mt-1">
                  Max {component['max-selected-items']} selections
                </p>
              )}
            </div>
          </div>
        );

      case 'NavigationList':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.List size={16} className="text-indigo-600" />
              <span className="text-xs font-medium text-gray-600">Navigation List</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Choose Option'}
              </label>
              <div className="space-y-2">
                {(component['list-items'] || []).map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
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
                    <Icons.ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'PhotoPicker':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Camera size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-600">Photo Picker</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Upload Photos'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Icons.Camera size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {component['photo-source'] === 'camera' ? 'Take Photo' :
                   component['photo-source'] === 'gallery' ? 'Choose from Gallery' :
                   'Camera or Gallery'}
                </p>
                {component['max-photos'] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max {component['max-photos']} photos
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'DocumentPicker':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.FileText size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Document Picker</span>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.label || 'Upload Document'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Icons.FileText size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Choose Document</p>
                {component['allowed-types'] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Allowed: {component['allowed-types'].join(', ')}
                  </p>
                )}
                {component['max-file-size'] && (
                  <p className="text-xs text-gray-500">
                    Max size: {Math.round(component['max-file-size'] / 1024 / 1024)}MB
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'If':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.GitBranch size={16} className="text-yellow-600" />
              <span className="text-xs font-medium text-gray-600">If Condition</span>
            </div>
            <div className="max-w-xs p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">Conditional Logic</p>
              <p className="text-xs text-yellow-700">
                If {component.condition?.variable} {component.condition?.operator} "{component.condition?.value}"
              </p>
              <div className="mt-2 text-xs text-yellow-600">
                <p>✓ True → {component['true-action']?.next?.name || 'Next Screen'}</p>
                <p>✗ False → {component['false-action']?.next?.name || 'Fallback Screen'}</p>
              </div>
            </div>
          </div>
        );

      case 'Switch':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Shuffle size={16} className="text-purple-600" />
              <span className="text-xs font-medium text-gray-600">Switch Statement</span>
            </div>
            <div className="max-w-xs p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-1">Multi-Case Logic</p>
              <p className="text-xs text-purple-700 mb-2">
                Switch on: {component['switch-on']}
              </p>
              <div className="text-xs text-purple-600 space-y-1">
                {(component.cases || []).slice(0, 2).map((case_: any, index: number) => (
                  <p key={index}>• {case_.value} → {case_.action?.next?.name}</p>
                ))}
                {(component.cases || []).length > 2 && (
                  <p>... +{(component.cases || []).length - 2} more cases</p>
                )}
                <p>Default → {component['default-action']?.next?.name}</p>
              </div>
            </div>
          </div>
        );

      case 'DataExchange':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Database size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">API Call</span>
            </div>
            <div className="max-w-xs p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Data Exchange</p>
              <p className="text-xs text-blue-700 mb-1">
                {component.method} {component.endpoint?.split('/').pop()}
              </p>
              <div className="text-xs text-blue-600">
                <p>• Headers: {Object.keys(component.headers || {}).length}</p>
                <p>• Payload: {Object.keys(component.payload || {}).length} fields</p>
                <p>• Retry: {component['error-handling']?.['retry-count'] || 0}x</p>
              </div>
            </div>
          </div>
        );

      case 'Footer':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.Layout size={16} className="text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Footer (Required by Meta)</span>
            </div>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                {component['left-caption'] && (
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-600">
                    {component['left-caption']}
                  </button>
                )}
                {component['center-caption'] && (
                  <span className="text-sm text-gray-600 font-medium">{component['center-caption']}</span>
                )}
                {component['right-caption'] && (
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    {component['right-caption']}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'OptIn':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.UserCheck size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-600">Opt In</span>
            </div>
            <div className="max-w-xs">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  disabled={!component.enabled}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  readOnly
                />
                <span className="text-sm text-gray-700">
                  {component.label || 'I agree to the terms'}
                  {component.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
            </div>
          </div>
        );

      case 'EmbeddedLink':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.ExternalLink size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Embedded Link</span>
            </div>
            <a
              href={component.href || '#'}
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{component.text || 'Click here'}</span>
              <Icons.ExternalLink size={12} />
            </a>
          </div>
        );

      case 'FlowCompletion':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icons.CheckCircle size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-600">Flow Completion</span>
            </div>
            <div className="max-w-xs p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">
                {component['completion-type'] === 'success' ? 'Success' : 'Error'} Completion
              </p>
              <p className="text-xs text-green-700">
                {component['completion-message']?.substring(0, 50)}...
              </p>
              {component['return-data'] && (
                <p className="text-xs text-green-600 mt-1">
                  Return data: {Object.keys(component['return-data']).length} fields
                </p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Unknown component: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`cursor-pointer transition-all border-2 rounded-lg p-4 m-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${hasErrors ? 'border-red-500 bg-red-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderComponent()}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
      )}
      
      {hasErrors && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <Icons.AlertTriangle size={10} className="text-white" />
        </div>
      )}

      {/* Error tooltip */}
      {hasErrors && isSelected && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-600 text-white text-xs rounded shadow-lg max-w-xs z-20">
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}