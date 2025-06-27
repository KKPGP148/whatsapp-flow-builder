import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const COMPONENTS = [
  { type: 'heading', label: 'Heading' },
  { type: 'subheading', label: 'Subheading' },
  { type: 'body_text', label: 'Body Text' },
  { type: 'short_answer', label: 'Short Answer' },
  { type: 'paragraph_answer', label: 'Paragraph Answer' },
  { type: 'date_picker', label: 'Date Picker' },
  { type: 'single_choice', label: 'Single Choice' },
  { type: 'multiple_choice', label: 'Multiple Choice' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'break', label: 'Break' },
  { type: 'button', label: 'Button' },
  { type: 'image', label: 'Image' },
  { type: 'footer', label: 'Footer' },
];

const getDefaultProps = (type) => {
  switch (type) {
    case 'heading': return { text: 'Heading Text' };
    case 'subheading': return { text: 'Subheading Text' };
    case 'body_text': return { text: 'Body text content' };
    case 'short_answer': return { placeholder: 'Enter short answer' };
    case 'paragraph_answer': return { placeholder: 'Enter detailed answer' };
    case 'date_picker': return {};
    case 'single_choice':
    case 'multiple_choice':
    case 'dropdown': return { options: ['Option 1', 'Option 2'] };
    case 'button': return { text: 'Click me', action: '' };
    case 'image': return { url: 'https://via.placeholder.com/150' };
    case 'footer': return { text: 'Footer text' };
    case 'break': return {};
    default: return {};
  }
};

const SidebarItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type: component.type },
    collect: monitor => ({ isDragging: !!monitor.isDragging() }),
  }));
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', margin: '4px', backgroundColor: '#e0f7fa', cursor: 'move', borderRadius: '4px', border: '1px solid #00796b' }}>
      {component.label}
    </div>
  );
};

const Canvas = ({ components, setComponents, setSelectedId }) => {
  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: item => {
      const newId = Date.now().toString();
      setComponents(prev => [...prev, {
        id: newId,
        type: item.type,
        props: getDefaultProps(item.type),
      }]);
      setSelectedId(newId);
    },
  }));
  return (
    <div ref={drop} style={{ minHeight: '400px', border: '2px dashed #00796b', padding: '10px', borderRadius: '8px', backgroundColor: '#e0f2f1', overflowY: 'auto' }}>
      {components.length === 0 && <p>Drag components here to build your flow</p>}
      {components.map(comp => (
        <div
          key={comp.id}
          onClick={() => setSelectedId(comp.id)}
          style={{ padding: '8px', margin: '6px 0', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #004d40', cursor: 'pointer' }}
        >
          <strong>{comp.type}</strong>: {renderComponentSummary(comp)}
        </div>
      ))}
    </div>
  );
};

const renderComponentSummary = (comp) => {
  switch (comp.type) {
    case 'heading':
    case 'subheading':
    case 'body_text':
    case 'footer': return comp.props.text;
    case 'short_answer':
    case 'paragraph_answer': return comp.props.placeholder;
    case 'single_choice':
    case 'multiple_choice':
    case 'dropdown': return comp.props.options.join(', ');
    case 'button': return comp.props.text;
    case 'image': return comp.props.url;
    case 'break': return '---';
    default: return '';
  }
};

const PropertiesPanel = ({ selectedComponent, updateComponent }) => {
  if (!selectedComponent) return <div>Select a component to edit its properties</div>;
  const { type, props } = selectedComponent;
  const handleChange = (key, value) => {
    updateComponent({ ...selectedComponent, props: { ...props, [key]: value } });
  };
  switch (type) {
    case 'heading':
    case 'subheading':
    case 'body_text':
    case 'footer':
      return (
        <div>
          <label>Text:</label>
          <textarea value={props.text} onChange={e => handleChange('text', e.target.value)} rows={3} style={{ width: '100%' }} />
        </div>
      );
    case 'short_answer':
    case 'paragraph_answer':
      return (
        <div>
          <label>Placeholder:</label>
          <input type="text" value={props.placeholder} onChange={e => handleChange('placeholder', e.target.value)} style={{ width: '100%' }} />
        </div>
      );
    case 'date_picker':
      return <div>Date Picker has no editable properties</div>;
    case 'single_choice':
    case 'multiple_choice':
    case 'dropdown':
      return (
        <div>
          <label>Options (comma separated):</label>
          <input type="text" value={props.options.join(',')} onChange={e => handleChange('options', e.target.value.split(','))} style={{ width: '100%' }} />
        </div>
      );
    case 'button':
      return (
        <div>
          <label>Button Text:</label>
          <input type="text" value={props.text} onChange={e => handleChange('text', e.target.value)} style={{ width: '100%' }} />
          <label>Action (e.g., next screen id):</label>
          <input type="text" value={props.action} onChange={e => handleChange('action', e.target.value)} style={{ width: '100%' }} />
        </div>
      );
    case 'image':
      return (
        <div>
          <label>Image URL:</label>
          <input type="text" value={props.url} onChange={e => handleChange('url', e.target.value)} style={{ width: '100%' }} />
        </div>
      );
    case 'break':
      return <div>Break component has no editable properties</div>;
    default:
      return <div>No properties available</div>;
  }
};

const WhatsAppPreview = ({ components }) => {
  return (
    <div style={{ backgroundColor: '#DCF8C6', borderRadius: '10px', padding: '10px', minHeight: '400px', overflowY: 'auto', fontFamily: 'Arial, sans-serif' }}>
      {components.map(comp => (
        <div key={comp.id} style={{ marginBottom: '10px' }}>
          {renderPreviewComponent(comp)}
        </div>
      ))}
    </div>
  );
};

const renderPreviewComponent = (comp) => {
  switch (comp.type) {
    case 'heading': return <h1 style={{ margin: 0 }}>{comp.props.text}</h1>;
    case 'subheading': return <h3 style={{ margin: 0 }}>{comp.props.text}</h3>;
    case 'body_text': return <p style={{ margin: 0 }}>{comp.props.text}</p>;
    case 'short_answer': return <input type="text" placeholder={comp.props.placeholder} disabled style={{ width: '100%' }} />;
    case 'paragraph_answer': return <textarea placeholder={comp.props.placeholder} disabled style={{ width: '100%' }} />;
    case 'date_picker': return <input type="date" disabled style={{ width: '100%' }} />;
    case 'single_choice':
      return (
        <select disabled style={{ width: '100%' }}>
          {comp.props.options.map((opt, i) => <option key={i}>{opt}</option>)}
        </select>
      );
    case 'multiple_choice':
      return (
        <div>
          {comp.props.options.map((opt, i) => (
            <label key={i} style={{ display: 'block' }}>
              <input type="checkbox" disabled /> {opt}
            </label>
          ))}
        </div>
      );
    case 'dropdown':
      return (
        <select disabled style={{ width: '100%' }}>
          {comp.props.options.map((opt, i) => <option key={i}>{opt}</option>)}
        </select>
      );
    case 'button': return <button disabled>{comp.props.text}</button>;
    case 'image': return <img src={comp.props.url} alt="preview" style={{ maxWidth: '100%' }} />;
    case 'footer': return <small>{comp.props.text}</small>;
    case 'break': return <hr />;
    default: return null;
  }
};

const App = () => {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const selectedComponent = components.find(c => c.id === selectedId);

  const updateComponent = (updated) => {
    setComponents(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const generateFlowJSON = () => {
    // This is a simplified example. For production, map to Meta's exact schema as per latest docs.
    // Here, we map each component to a "screen" for clarity.
    return {
      name: 'My WhatsApp Flow',
      language: 'en',
      screens: components.map((comp, i) => {
        const screen = {
          id: `screen${i + 1}`,
          title: comp.type === 'heading' ? comp.props.text : `Screen ${i + 1}`,
          content: []
        };
        // Map component to Meta's schema
        if (comp.type === 'heading' || comp.type === 'subheading' || comp.type === 'body_text') {
          screen.content.push({
            type: 'text',
            text: comp.props.text
          });
        } else if (comp.type === 'short_answer') {
          screen.content.push({
            type: 'input',
            input_type: 'text',
            placeholder: comp.props.placeholder
          });
        } else if (comp.type === 'paragraph_answer') {
          screen.content.push({
            type: 'input',
            input_type: 'textarea',
            placeholder: comp.props.placeholder
          });
        } else if (comp.type === 'date_picker') {
          screen.content.push({
            type: 'input',
            input_type: 'date'
          });
        } else if (comp.type === 'single_choice') {
          screen.content.push({
            type: 'radio',
            options: comp.props.options.map(opt => ({ label: opt, value: opt }))
          });
        } else if (comp.type === 'multiple_choice') {
          screen.content.push({
            type: 'checkbox',
            options: comp.props.options.map(opt => ({ label: opt, value: opt }))
          });
        } else if (comp.type === 'dropdown') {
          screen.content.push({
            type: 'select',
            options: comp.props.options.map(opt => ({ label: opt, value: opt }))
          });
        } else if (comp.type === 'button') {
          screen.content.push({
            type: 'button',
            text: comp.props.text,
            action: {
              next_screen_id: comp.props.action || `screen${i + 2}`
            }
          });
        } else if (comp.type === 'image') {
          screen.content.push({
            type: 'image',
            url: comp.props.url
          });
        } else if (comp.type === 'footer') {
          screen.content.push({
            type: 'text',
            text: comp.props.text,
            style: 'footer'
          });
        } else if (comp.type === 'break') {
          screen.content.push({
            type: 'divider'
          });
        }
        return screen;
      })
    };
  };

  const handleRun = async () => {
    const flowJSON = generateFlowJSON();
    console.log('Flow JSON:', flowJSON);
    alert('Flow JSON ready for Meta API. See console for output.');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ width: '15%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
          <h3>Components</h3>
          {COMPONENTS.map(comp => <SidebarItem key={comp.type} component={comp} />)}
        </div>
        <div style={{ width: '35%', padding: '10px', overflowY: 'auto' }}>
          <h3>Flow Builder</h3>
          <Canvas components={components} setComponents={setComponents} setSelectedId={setSelectedId} />
        </div>
        <div style={{ width: '25%', borderLeft: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
          <h3>Properties</h3>
          <PropertiesPanel selectedComponent={selectedComponent} updateComponent={updateComponent} />
        </div>
        <div style={{ width: '25%', borderLeft: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
          <h3>WhatsApp Preview</h3>
          <WhatsAppPreview components={components} />
          <h3>Flow JSON</h3>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', height: '200px', overflowY: 'auto' }}>
            {JSON.stringify(generateFlowJSON(), null, 2)}
          </pre>
          <button onClick={handleRun} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Run
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
