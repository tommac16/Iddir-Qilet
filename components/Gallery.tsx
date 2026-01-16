import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, Plus, Sparkles, Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDb, GalleryItem, compressImage } from '../services/mockDb';
import { generateCommunityImage } from '../services/geminiService';

interface GalleryItemProps {
    item: GalleryItem;
    categoryLabel?: string;
    onDelete?: (id: string) => void;
}

const GalleryCard: React.FC<GalleryItemProps> = ({ item, categoryLabel, onDelete }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-brand-200 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-100">
                    <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
            )}
            <img 
                src={item.url} 
                alt={item.title} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-accent-500 text-xs font-bold uppercase tracking-wider mb-2 block">{categoryLabel}</span>
                        <h3 className="text-white font-serif font-bold text-xl leading-tight">{item.title}</h3>
                    </div>
                    <span className="text-brand-100 text-xs font-mono border border-brand-100/30 px-2 py-1 rounded bg-black/20 backdrop-blur-sm">{item.year}</span>
                </div>
            </div>
            
            {/* Delete Control (for demo purposes accessible) */}
            {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeYear, setActiveYear] = useState('ALL');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Add Photo State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('MEETINGS');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(mockDb.getGallery());
  }, []);

  const refreshItems = () => setItems(mockDb.getGallery());

  const handleDelete = (id: string) => {
      if(window.confirm('Delete this image?')) {
          mockDb.deleteGalleryItem(id);
          refreshItems();
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setLoading(true);
          try {
              const compressed = await compressImage(e.target.files[0]);
              addItemToDb(compressed);
          } catch (err) {
              alert("Failed to process image.");
              setLoading(false);
          }
      }
  };

  const handleAIGenerate = async () => {
      setLoading(true);
      try {
          const url = await generateCommunityImage();
          if (url) addItemToDb(url);
          else {
              alert("AI Generation failed.");
              setLoading(false);
          }
      } catch (err) {
          setLoading(false);
      }
  };

  const addItemToDb = (url: string) => {
      mockDb.addGalleryItem({
          id: `g${Date.now()}`,
          url,
          title: newTitle || 'New Image',
          category: newCategory,
          year: new Date().getFullYear()
      });
      refreshItems();
      setLoading(false);
      setIsAddModalOpen(false);
      setNewTitle('');
  };

  const categories = [
    { id: 'ALL', label: t('gallery.cat.all') },
    { id: 'MEETINGS', label: t('gallery.cat.meetings') },
    { id: 'FEASTS', label: t('gallery.cat.feasts') },
    { id: 'SERVICE', label: t('gallery.cat.service') },
  ];

  const years = Array.from(new Set(items.map(item => item.year))).sort((a, b) => Number(b) - Number(a));

  const filteredItems = items.filter(item => {
    const matchCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchYear = activeYear === 'ALL' || item.year.toString() === activeYear;
    return matchCategory && matchYear;
  });

  return (
    <div className="py-16 bg-brand-50 min-h-screen relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-900 mb-6">{t('gallery.title')}</h1>
            <p className="text-brand-700 max-w-2xl mx-auto text-lg leading-relaxed font-light">{t('gallery.subtitle')}</p>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 max-w-6xl mx-auto border-b border-brand-200 pb-8">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                            activeCategory === cat.id 
                                ? 'bg-brand-800 text-white ring-2 ring-brand-800 ring-offset-2 ring-offset-brand-50' 
                                : 'bg-white text-brand-600 hover:bg-brand-100 border border-brand-200 hover:border-brand-300'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                 {/* Add Button */}
                 <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-full shadow-md font-medium text-sm transition"
                 >
                     <Plus className="w-4 h-4" /> Add Photo
                 </button>

                {/* Year Filter */}
                <div className="flex items-center gap-3 bg-white pl-5 pr-4 py-2.5 rounded-full border border-brand-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-sm text-brand-500 font-bold whitespace-nowrap uppercase tracking-wider text-xs">{t('gallery.filter.year')}</span>
                    <div className="h-4 w-px bg-brand-200"></div>
                    <div className="relative">
                        <select 
                            value={activeYear}
                            onChange={(e) => setActiveYear(e.target.value)}
                            className="bg-transparent text-brand-900 font-bold text-sm outline-none cursor-pointer pr-1 appearance-none hover:text-accent-600 transition-colors"
                        >
                            <option value="ALL">{t('gallery.filter.all_years')}</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Standard Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
                <GalleryCard 
                    key={item.id} 
                    item={item} 
                    categoryLabel={categories.find(c => c.id === item.category)?.label} 
                    onDelete={handleDelete}
                />
            ))}
        </div>
        
        {filteredItems.length === 0 && (
            <div className="text-center py-20 text-brand-400 bg-white rounded-2xl border border-brand-100 shadow-sm">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No images found matching your filters.</p>
                <button 
                    onClick={() => { setActiveCategory('ALL'); setActiveYear('ALL'); }}
                    className="mt-6 text-accent-600 font-bold hover:underline text-sm uppercase tracking-wide"
                >
                    Clear All Filters
                </button>
            </div>
        )}
      </div>

      {/* Add Photo Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-brand-900">Add to Gallery</h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-brand-400 hover:text-brand-600"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-brand-700 mb-1">Title</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent-500 outline-none" 
                            placeholder="e.g. Wedding Feast"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-brand-700 mb-1">Category</label>
                          <select 
                             className="w-full p-2 border rounded-lg bg-white outline-none"
                             value={newCategory}
                             onChange={(e) => setNewCategory(e.target.value)}
                          >
                              {categories.filter(c => c.id !== 'ALL').map(c => (
                                  <option key={c.id} value={c.id}>{c.label}</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                           <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-brand-50 transition ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                               <Upload className="w-6 h-6 text-brand-500 mb-2" />
                               <span className="text-xs font-bold text-brand-700">Upload Photo</span>
                               <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                           </label>
                           
                           <button 
                              onClick={handleAIGenerate}
                              disabled={loading}
                              className="flex flex-col items-center justify-center p-4 border-2 border-accent-200 bg-accent-50 rounded-xl hover:bg-accent-100 transition disabled:opacity-50"
                           >
                               {loading ? <Loader2 className="w-6 h-6 text-accent-600 mb-2 animate-spin" /> : <Sparkles className="w-6 h-6 text-accent-600 mb-2" />}
                               <span className="text-xs font-bold text-accent-700">AI Generate</span>
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Gallery;