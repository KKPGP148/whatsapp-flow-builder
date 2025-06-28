import React, { useState } from 'react';
import { MetaHeader } from './components/MetaHeader';
import { MetaSidebar } from './components/MetaSidebar';
import { MetaPropertiesPanel } from './components/MetaPropertiesPanel';
import { MetaWhatsAppPreview } from './components/MetaWhatsAppPreview';
import { MetaJSONEditor } from './components/MetaJSONEditor';
import { useMetaFlowBuilder } from './hooks/useMetaFlowBuilder';
import { MetaFlowComponent, MetaFlow } from './types/metaFlow';
import { metaComponentLibrary } from './data/metaComponentLibrary';
import { Code, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [rightPanelView, setRightPanelView] = useState<'properties' | 'json'>('properties');
  const {
    flowId,
    flowName,
    setFlowName,
    screens,
    currentScreen,
    selectedComponent,
    validationErrors,
    setCurrentScreen,
    setSelectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    addScreen,
    undo,
    redo,
    generateMetaFlowJSON,
    getCurrentScreen,
    validateFlow,
    exportFlow,
    importFlow,
    canUndo,
    canRedo,
    hasValidationErrors,
    updateFlowFromJSON
  } = useMetaFlowBuilder();

  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);

  const handleDragStart = (componentType: string) => {
    setDraggedComponentType(componentType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedComponentType) {
      const componentDef = metaComponentLibrary.find(comp => comp.type === draggedComponentType);
      if (componentDef) {
        const newComponent: MetaFlowComponent = {
          id: uuidv4(),
          type: componentDef.type,
          label: componentDef.label,
          properties: { ...componentDef.defaultProperties },
          position: { x: 0, y: 0 }
        };
        addComponent(newComponent);
        
        // Select the newly added component
        const currentScreenData = getCurrentScreen();
        if (currentScreenData) {
          const componentIndex = currentScreenData.layout.children.length - 1;
          setSelectedComponent(`${currentScreen}_${componentIndex}`);
        }
      }
      setDraggedComponentType(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleComponentUpdate = (componentIndex: number, updates: any) => {
    updateComponent(componentIndex, updates);
  };

  const handleDeleteComponent = () => {
    if (selectedComponent) {
      const componentIndex = parseInt(selectedComponent.split('_').pop() || '0');
      deleteComponent(componentIndex);
    }
  };

  const handleRunFlow = async () => {
    const flowJSON = generateMetaFlowJSON();
    
    // Validate before sending
    const errors = validateFlow();
    if (Object.keys(errors).length > 0) {
      alert('Please fix validation errors before sending to Meta API');
      return;
    }

    console.log('Sending flow to Meta WhatsApp Flows API:', flowJSON);
    
    // Simulate API call to Meta
    try {
      // In a real implementation, this would be an actual API call to Meta
      const response = await fetch('/api/meta/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_META_ACCESS_TOKEN'
        },
        body: JSON.stringify(flowJSON)
      });
      
      if (response.ok) {
        alert('Flow successfully sent to Meta WhatsApp Flows API!');
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      // For demo purposes, show success message
      alert(`Flow JSON generated successfully!\n\nFlow ID: ${flowJSON.screens[0]?.id}\nScreens: ${flowJSON.screens.length}\nComponents: ${flowJSON.screens.reduce((acc, screen) => acc + (screen.layout?.children?.length || 0), 0)}\n\nCheck console for full JSON output.`);
    }
  };

  const handleSave = () => {
    const flowData = generateMetaFlowJSON();
    localStorage.setItem('meta_flow_builder_data', JSON.stringify(flowData));
    alert('Flow saved locally!');
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('meta_flow_builder_data');
    if (savedData) {
      try {
        const flowData: MetaFlow = JSON.parse(savedData);
        importFlow(flowData);
        alert('Flow loaded successfully!');
      } catch (error) {
        alert('Error loading flow data');
      }
    } else {
      alert('No saved flow found');
    }
  };

  const handleImportFlow = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData: MetaFlow = JSON.parse(e.target?.result as string);
        importFlow(flowData);
        alert('Flow imported successfully!');
      } catch (error) {
        alert('Error importing flow: Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const selectedComponentIndex = selectedComponent ? parseInt(selectedComponent.split('_').pop() || '0') : null;
  const selectedComponentData = selectedComponentIndex !== null ? 
    getCurrentScreen()?.layout.children[selectedComponentIndex] : null;

  const flowJSON = generateMetaFlowJSON();

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <h1 className="text-sm font-semibold text-gray-900">Meta Flow Builder</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1 rounded transition-colors ${
                canUndo 
                  ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6"/>
                <path d="m21 17-3-3 3-3"/>
                <path d="M14 17h-7a4 4 0 0 1-4-4V7"/>
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1 rounded transition-colors ${
                canRedo 
                  ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6"/>
                <path d="m3 17 3-3-3-3"/>
                <path d="M10 17h7a4 4 0 0 0 4-4V7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
            placeholder="Flow name..."
          />

          <select
            value={currentScreen}
            onChange={(e) => setCurrentScreen(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            {screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.title}
              </option>
            ))}
          </select>

          <div className="flex space-x-1">
            <button 
              onClick={handleSave}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            >
              Save
            </button>
            <button 
              onClick={handleLoad}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Components */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <MetaSidebar 
            onDragStart={handleDragStart}
            onExportFlow={exportFlow}
            onImportFlow={handleImportFlow}
          />
        </div>
        
        {/* Center - Direct Edit WhatsApp Preview */}
        <div className="flex-1 bg-gray-50 overflow-hidden min-w-0 flex items-center justify-center">
          <div 
            className="w-full max-w-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <MetaWhatsAppPreview 
              screen={getCurrentScreen()} 
              selectedComponent={selectedComponent}
              validationErrors={validationErrors}
              onSelectComponent={setSelectedComponent}
              onAddScreen={addScreen}
            />
          </div>
        </div>

        {/* Right Panel - Larger Properties and JSON */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
          {/* Compact Tab Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 h-10">
            <button
              onClick={() => setRightPanelView('properties')}
              className={`flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium transition-colors flex-1 ${
                rightPanelView === 'properties'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Settings size={12} />
              <span>Properties</span>
            </button>
            <button
              onClick={() => setRightPanelView('json')}
              className={`flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium transition-colors flex-1 ${
                rightPanelView === 'json'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Code size={12} />
              <span>JSON Editor</span>
            </button>
          </div>

          {/* Full Height Tab Content */}
          <div className="flex-1 overflow-hidden min-h-0">
            {rightPanelView === 'properties' && (
              <MetaPropertiesPanel
                component={selectedComponentData || null}
                componentIndex={selectedComponentIndex}
                validationErrors={selectedComponent ? validationErrors[selectedComponent] || [] : []}
                onUpdate={handleComponentUpdate}
                onDelete={handleDeleteComponent}
                availableScreens={screens.map(s => ({ id: s.id, title: s.title }))}
              />
            )}
            {rightPanelView === 'json' && (
              <MetaJSONEditor 
                flowJSON={flowJSON} 
                hasValidationErrors={hasValidationErrors}
                onRunFlow={handleRunFlow}
                onUpdateJSON={updateFlowFromJSON}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;