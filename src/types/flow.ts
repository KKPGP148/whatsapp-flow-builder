export interface FlowComponent {
  id: string;
  type: 'heading' | 'text' | 'input' | 'choice' | 'button' | 'image' | 'video' | 'document';
  label: string;
  properties: {
    text?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    action?: string;
    url?: string;
    validation?: string;
    nextScreen?: string;
    condition?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: string;
    };
  };
  style?: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  position: { x: number; y: number };
}

export interface FlowScreen {
  id: string;
  title: string;
  components: FlowComponent[];
  layout: {
    type: 'single_column' | 'two_columns';
  };
  terminal?: boolean;
}

export interface WhatsAppFlow {
  version: string;
  screens: FlowScreen[];
  routing_model?: {
    [key: string]: string;
  };
}

export interface ComponentLibraryItem {
  id: string;
  type: FlowComponent['type'];
  label: string;
  icon: string;
  description: string;
  defaultProperties: FlowComponent['properties'];
}