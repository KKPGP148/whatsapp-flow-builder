import React from 'react';
import { FlowScreen } from '../types/flow';
import { Phone, Battery, Wifi, Signal } from 'lucide-react';

interface WhatsAppPreviewProps {
  screen: FlowScreen | undefined;
}

export function WhatsAppPreview({ screen }: WhatsAppPreviewProps) {
  if (!screen) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Preview</h2>
          <div className="text-center text-gray-500">
            <p>No screen to preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Preview</h2>
        
        {/* Phone mockup */}
        <div className="mx-auto w-64 bg-black rounded-3xl p-2">
          <div className="bg-white rounded-2xl h-96 overflow-hidden">
            {/* Status bar */}
            <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Signal size={12} />
                <Wifi size={12} />
              </div>
              <div className="font-medium">9:41</div>
              <div className="flex items-center space-x-1">
                <Battery size={12} />
                <span>100%</span>
              </div>
            </div>

            {/* WhatsApp header */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Business</div>
                <div className="text-xs opacity-90">Online</div>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 bg-gray-50 p-4 space-y-3 max-h-80 overflow-y-auto">
              {screen.components.map((component, index) => (
                <div key={component.id} className="flex justify-end">
                  <div className="bg-green-500 text-white rounded-lg px-3 py-2 max-w-48 text-sm">
                    {component.type === 'heading' && (
                      <div className="font-semibold">{component.properties.text}</div>
                    )}
                    {component.type === 'text' && (
                      <div>{component.properties.text}</div>
                    )}
                    {component.type === 'input' && (
                      <div className="space-y-1">
                        <div className="text-xs opacity-75">{component.label}</div>
                        <div className="bg-white text-gray-700 rounded px-2 py-1 text-xs">
                          {component.properties.placeholder}
                        </div>
                      </div>
                    )}
                    {component.type === 'choice' && (
                      <div className="space-y-2">
                        <div className="text-xs">{component.properties.text}</div>
                        {(component.properties.options || []).map((option, idx) => (
                          <div key={idx} className="bg-white text-gray-700 rounded px-2 py-1 text-xs">
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    {component.type === 'button' && (
                      <div className="bg-white text-green-600 rounded px-3 py-1 text-center font-medium">
                        {component.properties.text}
                      </div>
                    )}
                    {component.type === 'image' && (
                      <div className="space-y-1">
                        <img 
                          src={component.properties.url} 
                          alt="Preview" 
                          className="w-full rounded max-h-24 object-cover"
                        />
                      </div>
                    )}
                    {component.type === 'video' && (
                      <div className="bg-gray-700 rounded px-3 py-2 text-center text-xs">
                        📹 Video
                      </div>
                    )}
                    {component.type === 'document' && (
                      <div className="bg-gray-700 rounded px-3 py-2 text-center text-xs">
                        📄 {component.properties.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Live preview updates as you build
        </div>
      </div>
    </div>
  );
}