import { ComponentLibraryItem } from '../types/flow';

export const componentLibrary: ComponentLibraryItem[] = [
  {
    id: 'heading',
    type: 'heading',
    label: 'Heading',
    icon: 'Type',
    description: 'Display text as a heading',
    defaultProperties: {
      text: 'Your Heading Here',
    }
  },
  {
    id: 'text',
    type: 'text',
    label: 'Text',
    icon: 'AlignLeft',
    description: 'Display plain text content',
    defaultProperties: {
      text: 'Your text content here',
    }
  },
  {
    id: 'input',
    type: 'input',
    label: 'Text Input',
    icon: 'Edit3',
    description: 'Single line text input field',
    defaultProperties: {
      placeholder: 'Enter text here...',
      required: false,
    }
  },
  {
    id: 'choice',
    type: 'choice',
    label: 'Multiple Choice',
    icon: 'CheckSquare',
    description: 'Radio button selection',
    defaultProperties: {
      text: 'Select an option:',
      options: ['Option 1', 'Option 2', 'Option 3'],
    }
  },
  {
    id: 'button',
    type: 'button',
    label: 'Button',
    icon: 'MousePointer',
    description: 'Action button',
    defaultProperties: {
      text: 'Click Me',
      action: 'next',
    }
  },
  {
    id: 'image',
    type: 'image',
    label: 'Image',
    icon: 'Image',
    description: 'Display an image',
    defaultProperties: {
      url: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400',
    }
  },
  {
    id: 'video',
    type: 'video',
    label: 'Video',
    icon: 'Video',
    description: 'Display a video',
    defaultProperties: {
      url: 'https://example.com/video.mp4',
    }
  },
  {
    id: 'document',
    type: 'document',
    label: 'Document',
    icon: 'FileText',
    description: 'Document attachment',
    defaultProperties: {
      url: 'https://example.com/document.pdf',
      text: 'Download Document',
    }
  }
];