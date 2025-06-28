import React from 'react';
import { MetaFlowComponent } from '../types/metaFlow';
import { metaComponentLibrary } from '../data/metaComponentLibrary';
import { Trash2, Settings, AlertTriangle, Shield, Info } from 'lucide-react';

interface MetaPropertiesPanelProps {
  component: any | null;
  componentIndex: number | null;
  validationErrors: string[];
  onUpdate: (componentIndex: number, updates: Partial<MetaFlowComponent>) => void;
  onDelete: () => void;
  availableScreens: Array<{ id: string; title: string }>;
}

export function MetaPropertiesPanel({ 
  component, 
  componentIndex,
  validationErrors, 
  onUpdate, 
  onDelete, 
  availableScreens 
}: MetaPropertiesPanelProps) {
  if (!component || componentIndex === null) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
              <p className="text-xs text-gray-500">Configure component settings</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings size={20} className="text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No Component Selected</h4>
            <p className="text-xs text-gray-500">
              Select a component to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const componentDef = metaComponentLibrary.find(def => def.type === component.type);
  const hasErrors = validationErrors.length > 0;

  const handlePropertyChange = (property: string, value: any) => {
    onUpdate(componentIndex, {
      properties: {
        [property]: value
      }
    });
  };

  const handleDataSourceChange = (index: number, field: string, value: string) => {
    const dataSource = [...(component['data-source'] || [])];
    dataSource[index] = { ...dataSource[index], [field]: value };
    handlePropertyChange('data-source', dataSource);
  };

  const addDataSourceItem = () => {
    const dataSource = [...(component['data-source'] || [])];
    dataSource.push({ id: `item_${Date.now()}`, title: 'New Option', enabled: true });
    handlePropertyChange('data-source', dataSource);
  };

  const removeDataSourceItem = (index: number) => {
    const dataSource = [...(component['data-source'] || [])];
    dataSource.splice(index, 1);
    handlePropertyChange('data-source', dataSource);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
              <p className="text-xs text-gray-500">{component.type}</p>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Delete Component"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {hasErrors && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={12} />
              <div className="flex-1">
                <h4 className="text-xs font-medium text-red-900 mb-1">Validation Errors</h4>
                <ul className="text-xs text-red-700 space-y-0.5">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Component Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start space-x-2">
              <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={12} />
              <div className="flex-1">
                <h4 className="text-xs font-medium text-blue-900 mb-1">Component Type</h4>
                <p className="text-xs text-blue-700 font-mono">{component.type}</p>
                {componentDef && (
                  <p className="text-xs text-blue-600 mt-1">{componentDef.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Text Components Properties - ONLY TextBody and RichText get formatting */}
          {['TextHeading', 'TextSubheading', 'TextBody', 'TextCaption', 'RichText'].includes(component.type) && (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Text Content
                  <span className="text-xs text-gray-500 ml-2">
                    ({(component.text || '').length}/{componentDef?.meta_compliance.character_limits.text || 4096})
                  </span>
                </label>
                <textarea
                  value={component.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-xs resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  maxLength={componentDef?.meta_compliance.character_limits.text || 4096}
                  placeholder="Enter your text content..."
                />
              </div>

              {/* Text Formatting - ONLY for TextBody and RichText */}
              {['TextBody', 'RichText'].includes(component.type) && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Text Alignment
                    </label>
                    <select
                      value={component['text-align'] || 'left'}
                      onChange={(e) => handlePropertyChange('text-align', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Font Weight
                    </label>
                    <select
                      value={component['font-weight'] || 'normal'}
                      onChange={(e) => handlePropertyChange('font-weight', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Additional formatting for RichText */}
              {component.type === 'RichText' && (
                <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                  <h5 className="text-xs font-medium text-purple-900 mb-1">Rich Text Formatting</h5>
                  <div className="text-xs text-purple-700 space-y-0.5">
                    <p>• **bold text** for bold formatting</p>
                    <p>• *italic text* for italic formatting</p>
                    <p>• ~strikethrough~ for strikethrough</p>
                  </div>
                </div>
              )}

              {/* Note for heading components */}
              {['TextHeading', 'TextSubheading', 'TextCaption'].includes(component.type) && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="text-xs font-medium text-yellow-900 mb-1">Meta Guidelines</h5>
                  <p className="text-xs text-yellow-700">
                    {component.type} components only support plain text without formatting options.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Image Component Properties */}
          {component.type === 'Image' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Image URL (HTTPS required)
                </label>
                <input
                  type="url"
                  value={component.src || ''}
                  onChange={(e) => handlePropertyChange('src', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={component['alt-text'] || ''}
                  onChange={(e) => handlePropertyChange('alt-text', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    value={component.width || 200}
                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    value={component.height || 150}
                    onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Scale Type
                </label>
                <select
                  value={component['scale-type'] || 'cover'}
                  onChange={(e) => handlePropertyChange('scale-type', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </div>
            </>
          )}

          {/* Input Components Properties */}
          {['TextInput', 'TextArea', 'DatePicker'].includes(component.type) && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={component.label || ''}
                    onChange={(e) => handlePropertyChange('label', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={20}
                    placeholder="Field label"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={component.name || ''}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="field_name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={component.placeholder || ''}
                  onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                  placeholder="Enter placeholder text..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={component.required || false}
                    onChange={(e) => handlePropertyChange('required', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Required</span>
                </label>

                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={component.enabled !== false}
                    onChange={(e) => handlePropertyChange('enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Enabled</span>
                </label>
              </div>

              {/* TextInput specific */}
              {component.type === 'TextInput' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Input Type
                  </label>
                  <select
                    value={component['input-type'] || 'text'}
                    onChange={(e) => handlePropertyChange('input-type', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              )}

              {/* TextArea specific */}
              {component.type === 'TextArea' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={component['max-length'] || 1000}
                    onChange={(e) => handlePropertyChange('max-length', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="4096"
                  />
                </div>
              )}
            </>
          )}

          {/* Selection Components Properties */}
          {['CheckboxGroup', 'RadioButtonsGroup', 'Dropdown'].includes(component.type) && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={component.label || ''}
                    onChange={(e) => handlePropertyChange('label', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={20}
                    placeholder="Selection label"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={component.name || ''}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="field_name"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Options *
                  </label>
                  <button
                    onClick={addDataSourceItem}
                    className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {(component['data-source'] || []).map((option: any, index: number) => (
                    <div key={index} className="p-2 border border-gray-200 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Option {index + 1}</span>
                        <button
                          onClick={() => removeDataSourceItem(index)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Option title"
                        value={option.title || ''}
                        onChange={(e) => handleDataSourceChange(index, 'title', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-1"
                        maxLength={30}
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={option.description || ''}
                        onChange={(e) => handleDataSourceChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-1"
                        maxLength={80}
                      />
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={option.enabled !== false}
                          onChange={(e) => handleDataSourceChange(index, 'enabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700">Enabled</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection limits for CheckboxGroup */}
              {component.type === 'CheckboxGroup' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Selected</label>
                    <input
                      type="number"
                      value={component['min-selected-items'] || 0}
                      onChange={(e) => handlePropertyChange('min-selected-items', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Selected</label>
                    <input
                      type="number"
                      value={component['max-selected-items'] || 10}
                      onChange={(e) => handlePropertyChange('max-selected-items', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Properties */}
          {component.type === 'Footer' && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={12} />
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-yellow-900 mb-1">Footer Required</h4>
                    <p className="text-xs text-yellow-700">Meta requires a Footer component on every screen for navigation.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Left Caption (Back/Cancel)
                </label>
                <input
                  type="text"
                  value={component['left-caption'] || ''}
                  onChange={(e) => handlePropertyChange('left-caption', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                  placeholder="Back"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Center Caption (Progress)
                </label>
                <input
                  type="text"
                  value={component['center-caption'] || ''}
                  onChange={(e) => handlePropertyChange('center-caption', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                  placeholder="Step 1 of 3"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Right Caption (Continue/Submit)
                </label>
                <input
                  type="text"
                  value={component['right-caption'] || ''}
                  onChange={(e) => handlePropertyChange('right-caption', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                  placeholder="Continue"
                />
              </div>
            </>
          )}

          {/* OptIn Properties */}
          {component.type === 'OptIn' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Consent Text *
                </label>
                <textarea
                  value={component.label || ''}
                  onChange={(e) => handlePropertyChange('label', e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-xs resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  maxLength={80}
                  placeholder="I agree to receive marketing communications..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field Name *
                </label>
                <input
                  type="text"
                  value={component.name || ''}
                  onChange={(e) => handlePropertyChange('name', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="consent_field"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={component.required || false}
                    onChange={(e) => handlePropertyChange('required', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Required</span>
                </label>
              </div>
            </>
          )}

          {/* EmbeddedLink Properties */}
          {component.type === 'EmbeddedLink' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Link Text *
                </label>
                <input
                  type="text"
                  value={component.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={30}
                  placeholder="Click here"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL (HTTPS required) *
                </label>
                <input
                  type="url"
                  value={component.href || ''}
                  onChange={(e) => handlePropertyChange('href', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
            <h4 className="text-xs font-medium text-gray-700">Navigation & Actions</h4>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                On Click Action
              </label>
              <select
                value={component['on-click-action']?.name || ''}
                onChange={(e) => {
                  const actionName = e.target.value;
                  if (actionName) {
                    handlePropertyChange('on-click-action', {
                      name: actionName,
                      next: actionName === 'navigate' ? { type: 'screen', name: '' } : undefined
                    });
                  } else {
                    handlePropertyChange('on-click-action', undefined);
                  }
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
              >
                <option value="">No action</option>
                <option value="navigate">Navigate to screen</option>
                <option value="complete">Complete flow</option>
                <option value="data_exchange">Data exchange</option>
              </select>

              {component['on-click-action']?.name === 'navigate' && (
                <select
                  value={component['on-click-action']?.next?.name || ''}
                  onChange={(e) => {
                    handlePropertyChange('on-click-action', {
                      ...component['on-click-action'],
                      next: { type: 'screen', name: e.target.value }
                    });
                  }}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select screen...</option>
                  {availableScreens.map((screen) => (
                    <option key={screen.id} value={screen.id}>
                      {screen.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Meta Compliance Info */}
          {componentDef && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-start space-x-2">
                <Shield className="text-green-600 mt-0.5 flex-shrink-0" size={12} />
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-green-900 mb-1">Meta Compliance v7.1</h4>
                  <div className="text-xs text-green-700 space-y-0.5">
                    {Object.entries(componentDef.meta_compliance.character_limits).map(([field, limit]) => (
                      <p key={field}>
                        <span className="font-medium">{field.replace('_', ' ')}:</span> {limit} chars max
                      </p>
                    ))}
                    {componentDef.meta_compliance.restrictions.slice(0, 2).map((restriction, index) => (
                      <p key={index}>• {restriction}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}