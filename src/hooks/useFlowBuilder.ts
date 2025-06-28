import { useState, useCallback, useRef } from 'react';
import { FlowComponent, FlowScreen, WhatsAppFlow } from '../types/flow';

interface FlowHistory {
  screens: FlowScreen[];
  timestamp: number;
}

export function useFlowBuilder() {
  const [currentScreen, setCurrentScreen] = useState<string>('screen-1');
  const [screens, setScreens] = useState<FlowScreen[]>([
    {
      id: 'screen-1',
      title: 'Welcome Screen',
      components: [],
      layout: { type: 'single_column' }
    }
  ]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [history, setHistory] = useState<FlowHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draggedComponent = useRef<FlowComponent | null>(null);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      screens: JSON.parse(JSON.stringify(screens)),
      timestamp: Date.now()
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [screens, history, historyIndex]);

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

  const addComponent = useCallback((component: FlowComponent) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? { ...screen, components: [...screen.components, component] }
        : screen
    ));
  }, [currentScreen, saveToHistory]);

  const updateComponent = useCallback((componentId: string, updates: Partial<FlowComponent>) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? {
            ...screen,
            components: screen.components.map(comp =>
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          }
        : screen
    ));
  }, [currentScreen, saveToHistory]);

  const deleteComponent = useCallback((componentId: string) => {
    saveToHistory();
    setScreens(prev => prev.map(screen => 
      screen.id === currentScreen 
        ? {
            ...screen,
            components: screen.components.filter(comp => comp.id !== componentId)
          }
        : screen
    ));
    setSelectedComponent(null);
  }, [currentScreen, saveToHistory]);

  const addScreen = useCallback(() => {
    const newScreen: FlowScreen = {
      id: `screen-${screens.length + 1}`,
      title: `Screen ${screens.length + 1}`,
      components: [],
      layout: { type: 'single_column' }
    };
    saveToHistory();
    setScreens(prev => [...prev, newScreen]);
    setCurrentScreen(newScreen.id);
  }, [screens.length, saveToHistory]);

  const generateFlowJSON = useCallback((): WhatsAppFlow => {
    return {
      version: '3.0',
      screens: screens,
      routing_model: screens.reduce((acc, screen) => {
        acc[screen.id] = screen.components.find(c => c.type === 'button')?.properties.nextScreen || 'end';
        return acc;
      }, {} as { [key: string]: string })
    };
  }, [screens]);

  const getCurrentScreen = useCallback(() => {
    return screens.find(screen => screen.id === currentScreen);
  }, [screens, currentScreen]);

  return {
    screens,
    currentScreen,
    selectedComponent,
    draggedComponent,
    setCurrentScreen,
    setSelectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    addScreen,
    undo,
    redo,
    generateFlowJSON,
    getCurrentScreen,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}