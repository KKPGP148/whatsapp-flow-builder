import React, { useState } from 'react';
import { metaComponentLibrary } from '../data/metaComponentLibrary';
import * as Icons from 'lucide-react';

interface MetaSidebarProps {
  onDragStart: (componentType: string) => void;
  onExportFlow: () => void;
  onImportFlow: (file: File) => void;
}

export function MetaSidebar({ onDragStart, onExportFlow, onImportFlow }: MetaSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All', count: metaComponentLibrary.length },
    { id: 'text', label: 'Text', count: metaComponentLibrary.filter(c => c.category === 'text').length },
    { id: 'input', label: 'Input', count: metaComponentLibrary.filter(c => c.category === 'input').length },
    { id: 'selection', label: 'Select', count: metaComponentLibrary.filter(c => c.category === 'selection').length },
    { id: 'media', label: 'Media', count: metaComponentLibrary.filter(c => c.category === 'media').length },
    { id: 'logic', label: 'Logic', count: metaComponentLibrary.filter(c => c.category === 'logic').length },
    { id: 'data', label: 'Data', count: metaComponentLibrary.filter(c => c.category === 'data').length }
  ];

  const filteredComponents = metaComponentLibrary.filter(component => {
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesSearch = component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportFlow(file);
      event.target.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>

        {/* Compact Search */}
        <div className="relative mb-3">
          <Icons.Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Compact Categories */}
        <div className="grid grid-cols-2 gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {filteredComponents.map((item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>;
            
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(item.type)}
                className="group bg-white border border-gray-200 rounded p-2 hover:border-blue-300 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                    <IconComponent size={12} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 group-hover:text-blue-900 transition-colors truncate">
                      {item.label}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-6">
            <Icons.Search size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-xs">No components found</p>
          </div>
        )}
      </div>

      {/* Compact Footer Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="space-y-1">
          <button
            onClick={onExportFlow}
            className="w-full flex items-center justify-center space-x-1 p-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
          >
            <Icons.Download size={12} />
            <span>Export</span>
          </button>
          <label className="w-full flex items-center justify-center space-x-1 p-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors cursor-pointer">
            <Icons.Upload size={12} />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}