export interface MetaFlowComponent {
  id: string;
  type: 'TextHeading' | 'TextSubheading' | 'TextBody' | 'TextCaption' | 'RichText' | 'Image' | 'TextInput' | 'TextArea' | 'DatePicker' | 'CheckboxGroup' | 'RadioButtonsGroup' | 'Dropdown' | 'Footer' | 'OptIn' | 'EmbeddedLink' | 'If' | 'Switch' | 'NavigateAction' | 'DataExchange' | 'ChipSelector' | 'NavigationList' | 'PhotoPicker' | 'DocumentPicker' | 'FlowCompletion' | 'ApiResponseHandler' | 'VariableSetter' | 'WebhookTrigger' | 'ConditionalApiCall';
  label: string;
  properties: ComponentProperties;
  position: { x: number; y: number };
  validation?: ValidationRule[];
  children?: string[];
  parent?: string;
}

export interface ComponentProperties {
  // Common properties
  text?: string;
  visible?: boolean;
  name?: string;
  
  // Text Components
  'font-weight'?: 'bold' | 'normal';
  'font-style'?: 'italic' | 'normal';
  'text-align'?: 'left' | 'center' | 'right';
  color?: string;
  
  // RichText specific
  'markdown-support'?: boolean;
  
  // Image Component
  src?: string;
  'alt-text'?: string;
  width?: number;
  height?: number;
  'scale-type'?: 'cover' | 'contain';
  
  // Input Components
  label?: string;
  'input-type'?: 'text' | 'number' | 'email' | 'password' | 'phone';
  placeholder?: string;
  'helper-text'?: string;
  required?: boolean;
  enabled?: boolean;
  
  // TextArea specific
  'max-length'?: number;
  
  // DatePicker specific
  'availability-selector'?: {
    enabled: boolean;
    'num-days': number;
    'start-date': string;
  };
  'unavailable-dates'?: string[];
  
  // Selection Components
  'data-source'?: Array<{
    id: string;
    title: string;
    description?: string;
    enabled?: boolean;
    metadata?: string;
  }>;
  'max-selected-items'?: number;
  'min-selected-items'?: number;
  
  // ChipSelector specific
  'chip-style'?: 'primary' | 'secondary';
  'multi-select'?: boolean;
  
  // NavigationList specific
  'list-items'?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    'image-src'?: string;
    action?: {
      name: 'navigate' | 'data_exchange';
      next?: { type: 'screen'; name: string };
      payload?: Record<string, any>;
    };
  }>;
  
  // Footer
  'left-caption'?: string;
  'center-caption'?: string;
  'right-caption'?: string;
  
  // OptIn
  name?: string;
  
  // EmbeddedLink
  href?: string;
  
  // Conditional Logic (If/Switch)
  condition?: {
    type: 'variable' | 'form_data' | 'api_response';
    variable?: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
    value: any;
  };
  'true-action'?: {
    name: 'navigate' | 'data_exchange';
    next?: { type: 'screen'; name: string };
    payload?: Record<string, any>;
  };
  'false-action'?: {
    name: 'navigate' | 'data_exchange';
    next?: { type: 'screen'; name: string };
    payload?: Record<string, any>;
  };
  
  // Switch Component
  'switch-on'?: string;
  cases?: Array<{
    value: any;
    action: {
      name: 'navigate' | 'data_exchange';
      next?: { type: 'screen'; name: string };
      payload?: Record<string, any>;
    };
  }>;
  'default-action'?: {
    name: 'navigate' | 'data_exchange';
    next?: { type: 'screen'; name: string };
    payload?: Record<string, any>;
  };
  
  // Data Exchange (API Calls)
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  payload?: Record<string, any>;
  'response-mapping'?: Record<string, string>;
  'error-handling'?: {
    'retry-count'?: number;
    'fallback-screen'?: string;
    'error-message'?: string;
  };
  
  // API Response Handler
  'response-source'?: string;
  'display-template'?: string;
  'conditional-display'?: Array<{
    condition: { field: string; operator: string; value: any };
    template: string;
  }>;
  'fallback-template'?: string;
  
  // Variable Setter
  variables?: Array<{
    name: string;
    value: string;
    type: 'static' | 'dynamic' | 'system' | 'environment';
  }>;
  
  // Webhook Trigger
  'webhook-url'?: string;
  'retry-config'?: {
    'max-retries': number;
    'retry-delay': number;
  };
  
  // Conditional API Call
  conditions?: Array<{
    condition: { field: string; operator: string; value: any };
    api_config: {
      endpoint: string;
      method: string;
      payload: Record<string, any>;
    };
  }>;
  'default-api'?: {
    endpoint: string;
    method: string;
    payload: Record<string, any>;
  };
  
  // PhotoPicker
  'max-photos'?: number;
  'photo-source'?: 'camera' | 'gallery' | 'both';
  
  // DocumentPicker
  'allowed-types'?: string[];
  'max-file-size'?: number;
  
  // FlowCompletion
  'completion-type'?: 'success' | 'error';
  'completion-message'?: string;
  'return-data'?: Record<string, any>;
  
  // Navigation
  'on-click-action'?: {
    name: 'navigate' | 'complete' | 'data_exchange';
    next?: {
      type: 'screen';
      name: string;
    };
    payload?: Record<string, any>;
  };
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'file_size' | 'file_type' | 'regex' | 'api_validation';
  value?: any;
  message: string;
  endpoint?: string; // For API validation
}

export interface MetaFlowScreen {
  id: string;
  title: string;
  terminal?: boolean;
  success?: boolean;
  data?: Array<{
    [key: string]: any;
  }>;
  layout: {
    type: 'SingleColumnLayout';
    children: Array<{
      type: string;
      props: ComponentProperties;
    }>;
  };
}

export interface MetaFlow {
  version: '7.1';
  data_api_version: '3.0';
  routing_model: Record<string, Array<{
    condition?: string;
    next_screen: string;
  }>>;
  screens: MetaFlowScreen[];
  data_channels?: Array<{
    id: string;
    type: 'http_endpoint';
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
  }>;
}

export interface ComponentLibraryItem {
  id: string;
  type: MetaFlowComponent['type'];
  label: string;
  icon: string;
  description: string;
  category: 'text' | 'media' | 'input' | 'selection' | 'layout' | 'action' | 'logic' | 'data' | 'picker';
  defaultProperties: ComponentProperties;
  validation: ValidationRule[];
  meta_compliance: {
    character_limits: Record<string, number>;
    required_fields: string[];
    restrictions: string[];
  };
}