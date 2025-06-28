import React from 'react';
import { componentLibrary } from '../data/componentLibrary';
import * as Icons from 'lucide-react';

interface SidebarProps {
  onDragStart: (componentType: string) => void;
}

export function Sidebar({ onDragStart }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Components</h2>
        
        <div className="space-y-2">
          {componentLibrary.map((item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>;
            
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(item.type)}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center group-hover:border-green-300 group-hover:bg-green-50 transition-colors">
                  <IconComponent size={16} className="text-gray-600 group-hover:text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Flow Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
              <Icons.Save size={16} />
              <span>Save Flow</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
              <Icons.FolderOpen size={16} />
              <span>Load Flow</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
              <Icons.Download size={16} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}