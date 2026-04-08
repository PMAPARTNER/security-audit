import React, { useState, useRef, useEffect } from 'react';
import { LinkItem } from '../types';
import { Plus, Trash2, GripVertical, ExternalLink, Copy, Check } from 'lucide-react';
import { Translation } from '../locales';
import { ICON_OPTIONS } from '../constants';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface LinkEditorProps {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  t: Translation;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ links, setLinks, t }) => {
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [openIconSelector, setOpenIconSelector] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const iconSelectorRef = useRef<HTMLDivElement>(null);

  // Close icon selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconSelectorRef.current && !iconSelectorRef.current.contains(event.target as Node)) {
        setOpenIconSelector(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detectIcon = (url: string): string => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram')) return 'instagram';
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return 'twitter';
    if (lowerUrl.includes('linkedin')) return 'linkedin';
    if (lowerUrl.includes('github')) return 'github';
    if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return 'youtube';
    if (lowerUrl.includes('facebook')) return 'facebook';
    if (lowerUrl.includes('twitch')) return 'twitch';
    if (lowerUrl.includes('mailto:')) return 'mail';
    return 'globe';
  };

  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    
    // Simple URL cleanup for display title
    let title = newLinkUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    const icon = detectIcon(newLinkUrl);

    const newItem: LinkItem = {
      id: Date.now().toString(),
      title: title || 'Link',
      url: newLinkUrl.startsWith('http') || newLinkUrl.startsWith('mailto:') ? newLinkUrl : `https://${newLinkUrl}`,
      active: true,
      icon: icon
    };

    setLinks([newItem, ...links]);
    setNewLinkUrl('');
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, key: keyof LinkItem, value: any) => {
    // If URL is updated, also attempt to update icon if it was the default or matched the old URL
    if (key === 'url') {
        const link = links.find(l => l.id === id);
        // Only auto-update icon if the current icon matches the detection of the OLD url (meaning user hasn't manually overridden it heavily)
        // OR if the user is typing a known domain. 
        const newIcon = detectIcon(value);
        if (newIcon !== 'globe') {
             // We update both url and icon
             setLinks(links.map(l => l.id === id ? { ...l, [key]: value, icon: newIcon } : l));
             return;
        }
    }
    setLinks(links.map(l => l.id === id ? { ...l, [key]: value } : l));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);
  };

  const toggleIconSelector = (id: string) => {
    setOpenIconSelector(openIconSelector === id ? null : id);
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-gray-800">{t.links.title}</h2>
         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{links.length} {t.links.count}</span>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            placeholder={t.links.addPlaceholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
            />
        </div>
        <button
          onClick={addLink}
          disabled={!newLinkUrl}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">{t.links.addButton}</span>
        </button>
      </div>

      <div className="space-y-3">
        {links.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                {t.links.emptyState}
            </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="link-list">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {links.map((link, index) => {
                      const IconComponent = ICON_OPTIONS[link.icon || 'globe']?.component || ICON_OPTIONS['globe'].component;
                      
                      return (
                      <Draggable key={link.id} draggableId={link.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative ${snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-500/50' : ''}`}
                            style={provided.draggableProps.style}
                          >
                              <div className="flex items-start gap-3">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="cursor-grab text-gray-400 hover:text-gray-600 flex flex-col items-center justify-center pt-3 px-1 active:cursor-grabbing hover:bg-gray-50 rounded"
                                    title="Sıralamak için sürükleyin"
                                  >
                                      <GripVertical size={20} />
                                  </div>

                                  <div className="flex-1 space-y-3">
                                      <div className="flex items-center gap-2">
                                          {/* Icon Selector Trigger */}
                                          <div className="relative">
                                              <button 
                                                  onClick={() => toggleIconSelector(link.id)}
                                                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors border border-gray-200"
                                                  title="Simgeyi değiştir"
                                              >
                                                  <IconComponent size={20} />
                                              </button>
                                              
                                              {/* Icon Selector Popover */}
                                              {openIconSelector === link.id && (
                                                  <div 
                                                      ref={iconSelectorRef}
                                                      className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64 grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95 duration-200"
                                                  >
                                                      {Object.entries(ICON_OPTIONS).map(([key, option]) => (
                                                          <button
                                                              key={key}
                                                              onClick={() => {
                                                                  updateLink(link.id, 'icon', key);
                                                                  setOpenIconSelector(null);
                                                              }}
                                                              className={`p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 transition-colors ${link.icon === key ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
                                                              title={option.label}
                                                          >
                                                              <option.component size={20} />
                                                          </button>
                                                      ))}
                                                  </div>
                                              )}
                                          </div>

                                          <div className="flex-1">
                                              <input
                                                  type="text"
                                                  value={link.title}
                                                  onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                                  className="text-sm font-semibold w-full outline-none border-b border-gray-200 focus:border-purple-500 bg-transparent py-1 transition-colors"
                                                  placeholder={t.links.titlePlaceholder}
                                              />
                                          </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 pl-12">
                                          <ExternalLink size={14} className="text-gray-400" />
                                          <input
                                              type="text"
                                              value={link.url}
                                              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                              className="text-xs text-gray-500 w-full outline-none border-b border-gray-200 focus:border-purple-500 bg-transparent py-1 transition-colors font-mono"
                                              placeholder={t.links.urlPlaceholder}
                                          />
                                          <button
                                              onClick={() => handleCopyUrl(link.id, link.url)}
                                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                                              title={t.publishModal?.copy || 'Copy'}
                                          >
                                              {copiedId === link.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                          </button>
                                      </div>
                                  </div>

                                  <div className="flex flex-col gap-2 mt-1">
                                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                          <input 
                                              type="checkbox" 
                                              name={`toggle-${link.id}`} 
                                              id={`toggle-${link.id}`} 
                                              checked={link.active}
                                              onChange={(e) => updateLink(link.id, 'active', e.target.checked)}
                                              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                              style={{
                                                  right: link.active ? '0' : 'auto', 
                                                  left: link.active ? 'auto' : '0',
                                                  borderColor: link.active ? '#9333ea' : '#d1d5db'
                                              }}
                                          />
                                          <label 
                                              htmlFor={`toggle-${link.id}`} 
                                              className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${link.active ? 'bg-purple-600' : 'bg-gray-300'}`}
                                          ></label>
                                      </div>
                                      <button 
                                          onClick={() => removeLink(link.id)}
                                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              </div>
                          </div>
                        )}
                      </Draggable>
                  )})}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default LinkEditor;