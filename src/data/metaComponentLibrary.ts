import { ComponentLibraryItem } from '../types/metaFlow';

export const metaComponentLibrary: ComponentLibraryItem[] = [
  // Text Components - Following Meta's exact specifications
  {
    id: 'text_heading',
    type: 'TextHeading',
    label: 'Text Heading',
    icon: 'Heading1',
    description: 'Large heading text for titles and main sections',
    category: 'text',
    defaultProperties: {
      text: 'Welcome to Our Service',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Heading text is required' },
      { type: 'max_length', value: 80, message: 'Heading must be under 80 characters' }
    ],
    meta_compliance: {
      character_limits: { text: 80 },
      required_fields: ['text'],
      restrictions: ['No line breaks allowed', 'Plain text only', 'No formatting options']
    }
  },
  {
    id: 'text_subheading',
    type: 'TextSubheading',
    label: 'Text Subheading',
    icon: 'Heading2',
    description: 'Medium-sized text for section headers',
    category: 'text',
    defaultProperties: {
      text: 'Please provide your information',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Subheading text is required' },
      { type: 'max_length', value: 80, message: 'Subheading must be under 80 characters' }
    ],
    meta_compliance: {
      character_limits: { text: 80 },
      required_fields: ['text'],
      restrictions: ['No line breaks allowed', 'Plain text only', 'No formatting options']
    }
  },
  {
    id: 'text_body',
    type: 'TextBody',
    label: 'Text Body',
    icon: 'Type',
    description: 'Regular body text for content and descriptions',
    category: 'text',
    defaultProperties: {
      text: 'We need some information to process your request. Please fill out the form below and we will get back to you within 24 hours.',
      'text-align': 'left',
      'font-weight': 'normal',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Body text is required' },
      { type: 'max_length', value: 4096, message: 'Body text must be under 4096 characters' }
    ],
    meta_compliance: {
      character_limits: { text: 4096 },
      required_fields: ['text'],
      restrictions: ['Line breaks allowed', 'Supports text-align and font-weight']
    }
  },
  {
    id: 'text_caption',
    type: 'TextCaption',
    label: 'Text Caption',
    icon: 'FileText',
    description: 'Small caption text for additional information',
    category: 'text',
    defaultProperties: {
      text: 'All information is kept confidential',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Caption text is required' },
      { type: 'max_length', value: 300, message: 'Caption must be under 300 characters' }
    ],
    meta_compliance: {
      character_limits: { text: 300 },
      required_fields: ['text'],
      restrictions: ['No line breaks allowed', 'Plain text only', 'No formatting options']
    }
  },
  {
    id: 'rich_text',
    type: 'RichText',
    label: 'Rich Text',
    icon: 'Bold',
    description: 'Text with markdown formatting support',
    category: 'text',
    defaultProperties: {
      text: 'Welcome to our **premium service**! We offer *personalized solutions* for your business needs.',
      'markdown-support': true,
      'text-align': 'left',
      'font-weight': 'normal',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Rich text content is required' },
      { type: 'max_length', value: 4096, message: 'Rich text must be under 4096 characters' }
    ],
    meta_compliance: {
      character_limits: { text: 4096 },
      required_fields: ['text'],
      restrictions: ['Markdown formatting allowed', 'Supports **bold**, *italic*, ~strikethrough~']
    }
  },

  // Media Components
  {
    id: 'image',
    type: 'Image',
    label: 'Image',
    icon: 'Image',
    description: 'Display images with optional alt text',
    category: 'media',
    defaultProperties: {
      src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'alt-text': 'Professional service team',
      'scale-type': 'cover',
      width: 200,
      height: 150,
      visible: true
    },
    validation: [
      { type: 'required', message: 'Image source URL is required' },
      { type: 'pattern', value: '^https://', message: 'Image URL must use HTTPS' }
    ],
    meta_compliance: {
      character_limits: { 'alt-text': 100 },
      required_fields: ['src'],
      restrictions: ['HTTPS URLs only', 'Supported formats: JPEG, PNG, WebP', 'Maximum 5MB file size']
    }
  },

  // Input Components
  {
    id: 'text_input',
    type: 'TextInput',
    label: 'Text Input',
    icon: 'Edit3',
    description: 'Single-line text input field',
    category: 'input',
    defaultProperties: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      'input-type': 'text',
      required: true,
      enabled: true,
      visible: true,
      name: 'full_name'
    },
    validation: [
      { type: 'required', message: 'Input label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, placeholder: 20, 'helper-text': 80 },
      required_fields: ['label', 'name'],
      restrictions: ['Single line input only', 'Maximum 128 characters input']
    }
  },
  {
    id: 'text_area',
    type: 'TextArea',
    label: 'Text Area',
    icon: 'AlignLeft',
    description: 'Multi-line text input field',
    category: 'input',
    defaultProperties: {
      label: 'Additional Comments',
      placeholder: 'Please provide any additional details...',
      'max-length': 1000,
      required: false,
      enabled: true,
      visible: true,
      name: 'comments'
    },
    validation: [
      { type: 'required', message: 'TextArea label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, placeholder: 20, 'helper-text': 80 },
      required_fields: ['label', 'name'],
      restrictions: ['Multi-line input allowed', 'Configurable max length']
    }
  },
  {
    id: 'date_picker',
    type: 'DatePicker',
    label: 'Date Picker',
    icon: 'Calendar',
    description: 'Date selection with availability options',
    category: 'input',
    defaultProperties: {
      label: 'Preferred Appointment Date',
      required: true,
      enabled: true,
      visible: true,
      name: 'appointment_date',
      'availability-selector': {
        enabled: true,
        'num-days': 30,
        'start-date': new Date().toISOString().split('T')[0]
      }
    },
    validation: [
      { type: 'required', message: 'Date picker label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, 'helper-text': 80 },
      required_fields: ['label', 'name'],
      restrictions: ['ISO 8601 date format', 'Future dates only for availability']
    }
  },

  // Selection Components
  {
    id: 'checkbox_group',
    type: 'CheckboxGroup',
    label: 'Checkbox Group',
    icon: 'CheckSquare',
    description: 'Multiple selection checkboxes',
    category: 'selection',
    defaultProperties: {
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
    validation: [
      { type: 'required', message: 'Checkbox group label is required' },
      { type: 'required', message: 'Field name is required' },
      { type: 'required', message: 'At least one option is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, title: 30, description: 80 },
      required_fields: ['label', 'data-source', 'name'],
      restrictions: ['Maximum 20 options', 'Unique IDs required']
    }
  },
  {
    id: 'radio_buttons_group',
    type: 'RadioButtonsGroup',
    label: 'Radio Buttons',
    icon: 'Circle',
    description: 'Single selection radio buttons',
    category: 'selection',
    defaultProperties: {
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
    validation: [
      { type: 'required', message: 'Radio group label is required' },
      { type: 'required', message: 'Field name is required' },
      { type: 'required', message: 'At least one option is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, title: 30, description: 80 },
      required_fields: ['label', 'data-source', 'name'],
      restrictions: ['Maximum 20 options', 'Single selection only']
    }
  },
  {
    id: 'dropdown',
    type: 'Dropdown',
    label: 'Dropdown',
    icon: 'ChevronDown',
    description: 'Dropdown selection menu',
    category: 'selection',
    defaultProperties: {
      label: 'Industry',
      'data-source': [
        { id: 'tech', title: 'Technology', enabled: true },
        { id: 'finance', title: 'Finance & Banking', enabled: true },
        { id: 'healthcare', title: 'Healthcare', enabled: true },
        { id: 'retail', title: 'Retail & E-commerce', enabled: true },
        { id: 'manufacturing', title: 'Manufacturing', enabled: true },
        { id: 'education', title: 'Education', enabled: true },
        { id: 'other', title: 'Other', enabled: true }
      ],
      required: true,
      enabled: true,
      visible: true,
      name: 'industry'
    },
    validation: [
      { type: 'required', message: 'Dropdown label is required' },
      { type: 'required', message: 'Field name is required' },
      { type: 'required', message: 'At least one option is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, title: 30, description: 80 },
      required_fields: ['label', 'data-source', 'name'],
      restrictions: ['Maximum 200 options', 'Searchable for >10 options']
    }
  },

  // Advanced Selection Components
  {
    id: 'chip_selector',
    type: 'ChipSelector',
    label: 'Chip Selector',
    icon: 'Tag',
    description: 'Chip-style selection with tags',
    category: 'selection',
    defaultProperties: {
      label: 'Skills & Technologies',
      'data-source': [
        { id: 'react', title: 'React', enabled: true },
        { id: 'nodejs', title: 'Node.js', enabled: true },
        { id: 'python', title: 'Python', enabled: true },
        { id: 'aws', title: 'AWS', enabled: true },
        { id: 'docker', title: 'Docker', enabled: true }
      ],
      'chip-style': 'primary',
      'multi-select': true,
      'max-selected-items': 5,
      name: 'technologies',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Chip selector label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, title: 15 },
      required_fields: ['label', 'data-source', 'name'],
      restrictions: ['Maximum 10 chips', 'Short titles recommended']
    }
  },
  {
    id: 'navigation_list',
    type: 'NavigationList',
    label: 'Navigation List',
    icon: 'List',
    description: 'List with navigation actions and images',
    category: 'selection',
    defaultProperties: {
      label: 'Choose a Service Category',
      'list-items': [
        {
          id: 'consultation',
          title: 'Free Consultation',
          subtitle: 'Get expert advice for your project',
          'image-src': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
          action: { name: 'navigate', next: { type: 'screen', name: 'CONSULTATION_SCREEN' } }
        },
        {
          id: 'pricing',
          title: 'View Pricing Plans',
          subtitle: 'Explore our competitive pricing options',
          'image-src': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
          action: { name: 'navigate', next: { type: 'screen', name: 'PRICING_SCREEN' } }
        }
      ],
      name: 'service_navigation',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Navigation list label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20, title: 24, subtitle: 72 },
      required_fields: ['label', 'list-items', 'name'],
      restrictions: ['Maximum 10 items', 'Actions required for each item']
    }
  },

  // Picker Components
  {
    id: 'photo_picker',
    type: 'PhotoPicker',
    label: 'Photo Picker',
    icon: 'Camera',
    description: 'Allow users to select or capture photos',
    category: 'picker',
    defaultProperties: {
      label: 'Upload Project Images',
      'max-photos': 5,
      'photo-source': 'both',
      name: 'project_images',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Photo picker label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20 },
      required_fields: ['label', 'name'],
      restrictions: ['Maximum 10 photos', 'JPEG/PNG only', '5MB per photo limit']
    }
  },
  {
    id: 'document_picker',
    type: 'DocumentPicker',
    label: 'Document Picker',
    icon: 'FileText',
    description: 'Allow users to select documents',
    category: 'picker',
    defaultProperties: {
      label: 'Upload Requirements Document',
      'allowed-types': ['pdf', 'doc', 'docx', 'txt'],
      'max-file-size': 10485760, // 10MB
      name: 'requirements_doc',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Document picker label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 20 },
      required_fields: ['label', 'name'],
      restrictions: ['100MB file size limit', 'Specific file types only']
    }
  },

  // Logic Components
  {
    id: 'if_condition',
    type: 'If',
    label: 'If Condition',
    icon: 'GitBranch',
    description: 'Conditional logic with if/else branching',
    category: 'logic',
    defaultProperties: {
      condition: {
        type: 'form_data',
        variable: 'company_size',
        operator: 'equals',
        value: 'enterprise'
      },
      'true-action': {
        name: 'navigate',
        next: { type: 'screen', name: 'ENTERPRISE_SCREEN' }
      },
      'false-action': {
        name: 'navigate',
        next: { type: 'screen', name: 'STANDARD_SCREEN' }
      },
      visible: true
    },
    validation: [
      { type: 'required', message: 'Condition is required' },
      { type: 'required', message: 'True action is required' },
      { type: 'required', message: 'False action is required' }
    ],
    meta_compliance: {
      character_limits: {},
      required_fields: ['condition', 'true-action', 'false-action'],
      restrictions: ['Must have both true and false actions', 'Variable must exist']
    }
  },
  {
    id: 'switch_condition',
    type: 'Switch',
    label: 'Switch Statement',
    icon: 'Shuffle',
    description: 'Multi-case conditional logic',
    category: 'logic',
    defaultProperties: {
      'switch-on': 'selected_services',
      cases: [
        {
          value: 'consulting',
          action: { name: 'navigate', next: { type: 'screen', name: 'CONSULTING_DETAILS' } }
        },
        {
          value: 'development',
          action: { name: 'navigate', next: { type: 'screen', name: 'DEVELOPMENT_DETAILS' } }
        }
      ],
      'default-action': {
        name: 'navigate',
        next: { type: 'screen', name: 'GENERAL_INQUIRY' }
      },
      visible: true
    },
    validation: [
      { type: 'required', message: 'Switch variable is required' },
      { type: 'required', message: 'At least one case is required' },
      { type: 'required', message: 'Default action is required' }
    ],
    meta_compliance: {
      character_limits: {},
      required_fields: ['switch-on', 'cases', 'default-action'],
      restrictions: ['Maximum 10 cases', 'Default action required']
    }
  },

  // Data Components
  {
    id: 'data_exchange',
    type: 'DataExchange',
    label: 'Data Exchange (API)',
    icon: 'Database',
    description: 'Make API calls and handle responses',
    category: 'data',
    defaultProperties: {
      endpoint: 'https://api.yourcompany.com/leads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${api_token}'
      },
      payload: {
        'lead_data': {
          'name': '${full_name}',
          'company_size': '${company_size}',
          'industry': '${industry}'
        },
        'source': 'whatsapp_flow'
      },
      'response-mapping': {
        'lead_id': 'response.data.id',
        'status': 'response.status'
      },
      'error-handling': {
        'retry-count': 3,
        'fallback-screen': 'ERROR_SCREEN'
      },
      visible: true
    },
    validation: [
      { type: 'required', message: 'API endpoint is required' },
      { type: 'pattern', value: '^https://', message: 'Endpoint must use HTTPS' },
      { type: 'required', message: 'HTTP method is required' }
    ],
    meta_compliance: {
      character_limits: { endpoint: 2048 },
      required_fields: ['endpoint', 'method'],
      restrictions: ['HTTPS only', 'Valid JSON payload', 'Timeout: 30 seconds max']
    }
  },

  // Layout Components
  {
    id: 'footer',
    type: 'Footer',
    label: 'Footer',
    icon: 'Layout',
    description: 'Footer with navigation and action buttons (Required by Meta)',
    category: 'layout',
    defaultProperties: {
      'left-caption': 'Back',
      'center-caption': 'Step 1 of 3',
      'right-caption': 'Continue',
      visible: true,
      'on-click-action': {
        name: 'navigate',
        next: {
          type: 'screen',
          name: 'NEXT_SCREEN'
        }
      }
    },
    validation: [],
    meta_compliance: {
      character_limits: { 'left-caption': 20, 'center-caption': 20, 'right-caption': 20 },
      required_fields: [],
      restrictions: ['Maximum 3 buttons', 'Required on every screen', 'Action buttons required']
    }
  },

  // Consent Components
  {
    id: 'opt_in',
    type: 'OptIn',
    label: 'Opt In',
    icon: 'UserCheck',
    description: 'User consent and opt-in component',
    category: 'action',
    defaultProperties: {
      label: 'I agree to receive marketing communications and updates about new services',
      name: 'marketing_consent',
      required: false,
      enabled: true,
      visible: true
    },
    validation: [
      { type: 'required', message: 'Opt-in label is required' },
      { type: 'required', message: 'Field name is required' }
    ],
    meta_compliance: {
      character_limits: { label: 80 },
      required_fields: ['label', 'name'],
      restrictions: ['Must be explicit consent', 'Required for marketing messages']
    }
  },
  {
    id: 'embedded_link',
    type: 'EmbeddedLink',
    label: 'Embedded Link',
    icon: 'ExternalLink',
    description: 'Clickable link within the flow',
    category: 'action',
    defaultProperties: {
      text: 'View our Privacy Policy',
      href: 'https://yourcompany.com/privacy',
      visible: true
    },
    validation: [
      { type: 'required', message: 'Link text is required' },
      { type: 'required', message: 'Link URL is required' },
      { type: 'pattern', value: '^https://', message: 'URL must use HTTPS' }
    ],
    meta_compliance: {
      character_limits: { text: 30 },
      required_fields: ['text', 'href'],
      restrictions: ['HTTPS URLs only', 'External links open in browser']
    }
  },
  {
    id: 'flow_completion',
    type: 'FlowCompletion',
    label: 'Flow Completion',
    icon: 'CheckCircle',
    description: 'Complete the flow with success or error',
    category: 'action',
    defaultProperties: {
      'completion-type': 'success',
      'completion-message': 'Thank you for your submission! We have received your information and will contact you within 24 hours.',
      'return-data': {
        'flow_completed': true,
        'completion_time': '${timestamp}',
        'user_data': '${form_data}'
      },
      visible: true
    },
    validation: [
      { type: 'required', message: 'Completion message is required' },
      { type: 'required', message: 'Completion type is required' }
    ],
    meta_compliance: {
      character_limits: { 'completion-message': 300 },
      required_fields: ['completion-type', 'completion-message'],
      restrictions: ['Must be terminal action', 'Return data size limit: 4KB']
    }
  }
];