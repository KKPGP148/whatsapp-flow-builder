import React, { useState, useCallback, useRef } from 'react';
import { MetaFlowComponent, MetaFlowScreen, MetaFlow } from '../types/metaFlow';
import { v4 as uuidv4 } from 'uuid';

interface FlowHistory {
  screens: MetaFlowScreen[];
  timestamp: number;
}

export function useMetaFlowBuilder() {
  const [flowId] = useState(() => uuidv4());
  const [flowName, setFlowName] = useState('Customer Information Form');
  const [currentScreen, setCurrentScreen] = useState<string>('WELCOME');
  const [screens, setScreens] = useState<MetaFlowScreen[]>([
    {
      id: 'WELCOME',
      title: 'Welcome Screen',
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'TextHeading',
            text: 'Welcome to Our Service',
            visible: true
          },
          {
            type: 'TextBody',
            text: 'Please provide your information to get started. We will use this to personalize your experience.',
            'text-align': 'left',
            'font-weight': 'normal',
            visible: true
          },
          {
            type: 'Footer',
            'left-caption': '',
            'center-caption': 'Step 1 of 2',
            'right-caption': 'Continue',
            visible: true,
            'on-click-action': {
              name: 'navigate',
              next: {
                type: 'screen',
                name: 'FORM_SCREEN'
              }
            }
          }
        ]
      }
    },
    {
      id: 'FORM_SCREEN',
      title: 'Information Form',
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'TextSubheading',
            text: 'Personal Information',
            visible: true
          },
          {
            type: 'TextInput',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            'input-type': 'text',
            required: true,
            enabled: true,
            visible: true,
            name: 'full_name'
          },
          {
            type: 'TextInput',
            label: 'Email Address',
            placeholder: 'Enter your email',
            'input-type': 'email',
            required: true,
            enabled: true,
            visible: true,
            name: 'email'
          },
          {
            type: 'RadioButtonsGroup',
            label: 'Company Size',
            'data-source': [
              { id: 'startup', title: 'Startup (1-10 employees)', enabled: true },
              { id: 'small', title: 'Small Business (11-50 employees)', enabled: true },
              { id: 'medium', title: 'Medium Business (51-200 employees)', enabled: true },
              { id: 'enterprise', title: 'Enterprise (200+ employees)', enabled: true }
            ],
            required: true,
            enabled: true,
            visible: true,
            name: 'company_size'
          },
          {
            type: 'CheckboxGroup',
            label: 'Services Interested In',
            'data-source': [
              { id: 'consulting', title: 'Business Consulting', description: 'Strategic planning and advice', enabled: true },
              { id: 'development', title: 'Software Development', description: 'Custom software solutions', enabled: true },
              { id: 'marketing', title: 'Digital Marketing', description: 'Online marketing campaigns', enabled: true }
            ],
            'min-selected-items': 1,
            'max-selected-items': 3,
            required: true,
            enabled: true,
            visible: true,
            name: 'selected_services'
          },
          {
            type: 'TextArea',
            label: 'Additional Comments',
            placeholder: 'Tell us more about your needs...',
            'max-length': 500,
            required: false,
            enabled: true,
            visible: true,
            name: 'comments'
          },
          {
            type: 'OptIn',
            label: 'I agree to receive marketing communications and updates about new services',
            name: 'marketing_consent',
            required: false,
            enabled: true,
            visible: true
          },
          {
            type: 'Footer',
            'left-caption': 'Back',
            'center-caption': 'Step 2 of 2',
            'right-caption': 'Submit',
            visible: true,
            'on-click-action': {
              name: 'navigate',
              next: {
                type: 'screen',
                name: 'SUCCESS_SCREEN'
              }
            }
          }
        ]
      }
    },
    {
      id: 'SUCCESS_SCREEN',
      title: 'Thank You',
      success: true,
      terminal: true,
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'TextHeading',
            text: 'Thank You!',
            visible: true
          },
          {
            type: 'TextBody',
            text: 'We have received your information and will contact you within 24 hours. Thank you for your interest in our services!',
            'text-align': 'center',
            'font-weight': 'normal',
            visible: true
          },
          {
            type: 'EmbeddedLink',
            text: 'Visit our website',
            href: 'https://yourcompany.com',
            visible: true
          }
        ]
      }
    }
  ]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [history, setHistory] = useState<FlowHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const draggedComponent = useRef<MetaFlowComponent | null>(null);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      screens: JSON.parse(JSON.stringify(screens)),
      timestamp: Date.now()
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [screens, history, historyIndex]);

  const validateComponent = useCallback((component: any, componentIndex: number, screenId: string): string[] => {
    const errors: string[] = [];
    
    // Text validation for all text components
    if (['TextHeading', 'TextSubheading', 'TextBody', 'TextCaption', 'RichText'].includes(component.type)) {
      if (!component.text) {
        errors.push('Text content is required');
      } else {
        const maxLengths = {
          'TextHeading': 80,
          'TextSubheading': 80,
          'TextBody': 4096,
          'TextCaption': 300,
          'RichText': 4096
        };
        const maxLength = maxLengths[component.type as keyof typeof maxLengths];
        if (component.text.length > maxLength) {
          errors.push(`Text must be under ${maxLength} characters`);
        }
      }
    }
    
    // Image validation
    if (component.type === 'Image') {
      if (!component.src) {
        errors.push('Image source URL is required');
      } else if (!component.src.startsWith('https://')) {
        errors.push('Image URL must use HTTPS');
      }
    }
    
    // Input validation
    if (['TextInput', 'TextArea', 'DatePicker'].includes(component.type)) {
      if (!component.label) {
        errors.push('Input label is required');
      } else if (component.label.length > 20) {
        errors.push('Label must be under 20 characters');
      }
      if (!component.name) {
        errors.push('Field name is required');
      }
    }
    
    // Selection validation
    if (['CheckboxGroup', 'RadioButtonsGroup', 'Dropdown'].includes(component.type)) {
      if (!component.label) {
        errors.push('Selection label is required');
      }
      if (!component.name) {
        errors.push('Field name is required');
      }
      if (!component['data-source'] || component['data-source'].length === 0) {
        errors.push('At least one option is required');
      }
    }
    
    // OptIn validation
    if (component.type === 'OptIn') {
      if (!component.label) {
        errors.push('Opt-in label is required');
      }
      if (!component.name) {
        errors.push('Opt-in name is required');
      }
    }
    
    // EmbeddedLink validation
    if (component.type === 'EmbeddedLink') {
      if (!component.text) {
        errors.push('Link text is required');
      }
      if (!component.href) {
        errors.push('Link URL is required');
      } else if (!component.href.startsWith('https://')) {
        errors.push('Link URL must use HTTPS');
      }
    }
    
    // DataExchange validation
    if (component.type === 'DataExchange') {
      if (!component.endpoint) {
        errors.push('API endpoint is required');
      } else if (!component.endpoint.startsWith('https://')) {
        errors.push('API endpoint must use HTTPS');
      }
      if (!component.method) {
        errors.push('HTTP method is required');
      }
    }
    
    // If condition validation
    if (component.type === 'If') {
      if (!component.condition) {
        errors.push('Condition is required');
      }
      if (!component['true-action']) {
        errors.push('True action is required');
      }
      if (!component['false-action']) {
        errors.push('False action is required');
      }
    }
    
    // Switch validation
    if (component.type === 'Switch') {
      if (!component['switch-on']) {
        errors.push('Switch variable is required');
      }
      if (!component.cases || component.cases.length === 0) {
        errors.push('At least one case is required');
      }
      if (!component['default-action']) {
        errors.push('Default action is required');
      }
    }
    
    // FlowCompletion validation
    if (component.type === 'FlowCompletion') {
      if (!component['completion-message']) {
        errors.push('Completion message is required');
      }
      if (!component['completion-type']) {
        errors.push('Completion type is required');
      }
    }
    
    // Navigation validation
    if (component['on-click-action']?.next?.name) {
      const targetScreen = screens.find(s => s.id === component['on-click-action'].next.name);
      if (!targetScreen) {
        errors.push(`Target screen "${component['on-click-action'].next.name}" does not exist`);
      }
    }
    
    return errors;
  }, [screens]);

  const validateFlow = useCallback((): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};
    
    screens.forEach(screen => {
      // Check if screen has a Footer (required by Meta)
      const hasFooter = screen.layout.children.some(child => child.type === 'Footer');
      if (!hasFooter) {
        errors[`${screen.id}_footer`] = ['Footer component is required on every screen by Meta'];
      }
      
      screen.layout.children.forEach((child, index) => {
        const componentId = `${screen.id}_${index}`;
        const componentErrors = validateComponent(child, index, screen.id);
        if (componentErrors.length > 0) {
          errors[componentId] = componentErrors;
        }
      });
    });
    
    setValidationErrors(errors);
    return errors;
  }, [screens, validateComponent]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setScreens(previousState.screens);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setScreens(nextState.screens);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const addComponent = useCallback((component: MetaFlowComponent) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? { 
            ...screen, 
            layout: {
              ...screen.layout,
              children: [
                ...screen.layout.children,
                {
                  type: component.type,
                  ...component.properties // Spread properties directly at component level
                }
              ]
            }
          }
        : screen
    ));
    setTimeout(() => validateFlow(), 100);
  }, [currentScreen, saveToHistory, validateFlow]);

  const updateComponent = useCallback((componentIndex: number, updates: Partial<MetaFlowComponent>) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? {
            ...screen,
            layout: {
              ...screen.layout,
              children: screen.layout.children.map((child, index) =>
                index === componentIndex 
                  ? { ...child, ...updates.properties } // Update properties directly at component level
                  : child
              )
            }
          }
        : screen
    ));
    setTimeout(() => validateFlow(), 100);
  }, [currentScreen, saveToHistory, validateFlow]);

  const deleteComponent = useCallback((componentIndex: number) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? {
            ...screen,
            layout: {
              ...screen.layout,
              children: screen.layout.children.filter((_, index) => index !== componentIndex)
            }
          }
        : screen
    ));
    setSelectedComponent(null);
    setTimeout(() => validateFlow(), 100);
  }, [currentScreen, saveToHistory, validateFlow]);

  const addScreen = useCallback((screenType: 'regular' | 'success' | 'terminal' = 'regular') => {
    const newScreen: MetaFlowScreen = {
      id: `SCREEN_${Date.now()}`,
      title: `Screen ${screens.length + 1}`,
      layout: {
        type: 'SingleColumnLayout',
        children: [
          // Always add Footer as it's required by Meta
          {
            type: 'Footer',
            'left-caption': 'Back',
            'center-caption': `Step ${screens.length + 1}`,
            'right-caption': 'Continue',
            visible: true
          }
        ]
      },
      success: screenType === 'success',
      terminal: screenType === 'terminal'
    };
    saveToHistory();
    setScreens(prev => [...prev, newScreen]);
    setCurrentScreen(newScreen.id);
  }, [screens.length, saveToHistory]);

  const deleteScreen = useCallback((screenId: string) => {
    if (screens.length <= 1) {
      alert('Cannot delete the last screen. Create a new screen first.');
      return;
    }
    
    saveToHistory();
    const updatedScreens = screens.filter(screen => screen.id !== screenId);
    setScreens(updatedScreens);
    
    // If we're deleting the current screen, switch to the first available screen
    if (currentScreen === screenId) {
      setCurrentScreen(updatedScreens[0].id);
    }
  }, [screens, currentScreen, saveToHistory]);

  const generateMetaFlowJSON = useCallback((): MetaFlow => {
    const routingModel: Record<string, Array<{ condition?: string; next_screen: string }>> = {};
    
    screens.forEach(screen => {
      const routes: Array<{ condition?: string; next_screen: string }> = [];
      
      screen.layout.children.forEach((child, index) => {
        if (child['on-click-action']?.next?.name) {
          routes.push({
            condition: `component_${index}_clicked`,
            next_screen: child['on-click-action'].next.name
          });
        }
      });
      
      if (routes.length > 0) {
        routingModel[screen.id] = routes;
      }
    });

    return {
      version: '7.1',
      data_api_version: '3.0',
      routing_model: routingModel,
      screens: screens
    };
  }, [screens]);

  const updateFlowFromJSON = useCallback((jsonString: string) => {
    try {
      const flowData: MetaFlow = JSON.parse(jsonString);
      saveToHistory();
      setScreens(flowData.screens);
      if (flowData.screens.length > 0 && !flowData.screens.find(s => s.id === currentScreen)) {
        setCurrentScreen(flowData.screens[0].id);
      }
      setTimeout(() => validateFlow(), 100);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Invalid JSON format. Please check your syntax.');
    }
  }, [currentScreen, saveToHistory, validateFlow]);

  const getCurrentScreen = useCallback(() => {
    return screens.find(screen => screen.id === currentScreen);
  }, [screens, currentScreen]);

  const exportFlow = useCallback(() => {
    const flowJSON = generateMetaFlowJSON();
    const blob = new Blob([JSON.stringify(flowJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowName.replace(/\s+/g, '_').toLowerCase()}_flow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateMetaFlowJSON, flowName]);

  const importFlow = useCallback((flowData: MetaFlow) => {
    saveToHistory();
    setScreens(flowData.screens);
    setCurrentScreen(flowData.screens[0]?.id || 'WELCOME');
    setTimeout(() => validateFlow(), 100);
  }, [saveToHistory, validateFlow]);

  // Initialize validation on mount
  React.useEffect(() => {
    validateFlow();
  }, []);

  return {
    flowId,
    flowName,
    setFlowName,
    screens,
    currentScreen,
    selectedComponent,
    draggedComponent,
    validationErrors,
    setCurrentScreen,
    setSelectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    addScreen,
    deleteScreen,
    undo,
    redo,
    generateMetaFlowJSON,
    updateFlowFromJSON,
    getCurrentScreen,
    validateFlow,
    exportFlow,
    importFlow,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    hasValidationErrors: Object.keys(validationErrors).length > 0
  };
}