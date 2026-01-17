
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// Types
interface Listing {
  id: string;
  title: string;
  category: string;
  condition: string;
  price: string;
  description: string;
  imageUrl: string;
  createdAt: number;
}

// Storage Keys
const STORAGE_KEY = 'ebay_clone_listings';

// Simple Router Hook
const useRoute = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return { route, navigate };
};

// --- Components ---

const Header = ({ onNavigate }: { onNavigate: (to: string) => void }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-6 cursor-pointer" onClick={() => onNavigate('#/')}>
        <h1 className="text-3xl font-bold tracking-tighter">
          <span className="text-[#e53238]">e</span>
          <span className="text-[#0064d2]">b</span>
          <span className="text-[#f5af02]">a</span>
          <span className="text-[#86b817]">y</span>
        </h1>
        <nav className="ml-8 hidden md:flex space-x-4 text-sm text-gray-600">
          <button onClick={() => onNavigate('#/')} className="hover:underline">Shop by category</button>
        </nav>
      </div>
      
      <div className="flex-1 max-w-2xl mx-8 relative">
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search for anything" 
            className="w-full border-2 border-gray-800 px-4 py-2 focus:outline-none"
          />
          <button className="bg-ebay-blue text-white px-8 py-2 font-bold hover-ebay-blue">
            Search
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <button 
          onClick={(e) => { e.preventDefault(); onNavigate('#/sell'); }} 
          className="text-gray-700 hover:text-ebay-blue font-medium px-3 py-1 rounded hover:bg-gray-100 transition-colors"
        >
          Sell
        </button>
        <a href="#" className="text-gray-700 hover:underline">Watchlist</a>
        <a href="#" className="text-gray-700 hover:underline">My eBay</a>
      </div>
    </div>
  </header>
);

// --- Pages ---

const HomePage = ({ listings, onNavigate }: { listings: Listing[], onNavigate: (to: string) => void }) => (
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Daily Deals & Trending</h2>
      {listings.length > 0 && (
        <button 
          onClick={() => onNavigate('#/sell')}
          className="text-ebay-blue border border-ebay-blue px-4 py-1.5 rounded-full font-bold hover:bg-blue-50 transition-colors text-sm"
        >
          Sell an item
        </button>
      )}
    </div>

    {listings.length === 0 ? (
      <div className="bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-4 text-gray-400">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-xl font-medium text-gray-800 mb-2">Your marketplace is empty</p>
        <p className="text-gray-500 mb-6">Be the first to list an item for sale!</p>
        <button 
          onClick={() => onNavigate('#/sell')}
          className="bg-ebay-blue text-white px-8 py-3 rounded-full font-bold shadow-md hover-ebay-blue transition-all"
        >
          Create Your First Listing
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {listings.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded p-4 border border-transparent hover:border-gray-300 transition-all cursor-pointer group shadow-sm hover:shadow-md"
            onClick={() => onNavigate(`#/item?id=${item.id}`)}
          >
            <div className="aspect-square mb-3 overflow-hidden bg-gray-50 rounded flex items-center justify-center">
              <img 
                src={item.imageUrl || 'https://via.placeholder.com/300?text=No+Image'} 
                alt={item.title} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:underline h-10">{item.title}</h3>
            <p className="font-bold text-lg text-black">${parseFloat(item.price).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Free shipping</p>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">Trending</span>
               <p className="text-xs text-red-600">Almost gone</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SellPage = ({ onSave }: { onSave: (listing: Omit<Listing, 'id' | 'createdAt'>) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    condition: 'New',
    price: '',
    description: '',
    imageUrl: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create your listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-title" className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input 
                id="listing-title"
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Include key words that buyers would use to search for your item"
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="listing-category" className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  id="listing-category"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                >
                  <option>Electronics</option>
                  <option>Collectibles</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                  <option>Auto Parts</option>
                </select>
              </div>
              <div>
                <label htmlFor="listing-condition" className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                <select 
                  id="listing-condition"
                  value={formData.condition}
                  onChange={e => setFormData({...formData, condition: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                >
                  <option>New</option>
                  <option>Like New</option>
                  <option>Used - Good</option>
                  <option>Used - Acceptable</option>
                  <option>Refurbished</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Media & Description Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Visuals & Story</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Item Photo</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${formData.imageUrl.startsWith('data:') ? 'border-ebay-blue bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Upload from computer</span>
                  <input 
                    id="listing-image-file"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <label htmlFor="listing-image-url" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Or provide a URL</label>
                  <input 
                    id="listing-image-url"
                    type="url"
                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {formData.imageUrl && (
                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Preview</p>
                  <div className="relative w-48 h-48 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, imageUrl: ''}))}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="listing-description" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                id="listing-description"
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your item, including its features and any defects"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Pricing</h2>
          
          <div className="max-w-xs">
            <label htmlFor="listing-price" className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input 
                id="listing-price"
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full border border-gray-300 rounded p-2 pl-8 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            className="px-8 py-2 border border-ebay-blue text-ebay-blue font-bold rounded-full hover:bg-blue-50"
          >
            Save for later
          </button>
          <button 
            id="listing-submit"
            type="submit" 
            className="px-12 py-2 bg-ebay-blue text-white font-bold rounded-full hover-ebay-blue shadow-lg transition-transform active:scale-95"
          >
            List it
          </button>
        </div>
      </form>
    </div>
  );
};

const ItemPage = ({ listings, onBuy, onNavigate }: { listings: Listing[], onBuy: (id: string) => void, onNavigate: (to: string) => void }) => {
  const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const itemId = queryParams.get('id');
  const item = listings.find(l => l.id === itemId);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <button onClick={() => onNavigate('#/')} className="text-ebay-blue hover:underline">Back to home</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex justify-between items-center">
        <div>
          <button onClick={() => onNavigate('#/')} className="hover:underline">Back to search results</button> | Category: {item.category}
        </div>
        <button 
          onClick={() => onNavigate('#/sell')}
          className="text-ebay-blue font-bold hover:underline"
        >
          + List another item
        </button>
      </nav>

      <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-12 shadow-sm">
        <div className="md:w-1/2">
          <div className="aspect-square bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img 
              src={item.imageUrl || 'https://via.placeholder.com/600?text=No+Image'} 
              alt={item.title} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{item.title}</h1>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Condition: <span className="font-bold text-black">{item.condition}</span></p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
            <div className="flex items-baseline mb-2">
              <span className="text-sm font-bold mr-2">Price:</span>
              <span className="text-3xl font-bold text-black">US ${parseFloat(item.price).toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 italic">No Interest if paid in full in 6 mo on $99+ with PayPal Credit*</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => onBuy(item.id)}
                className="w-full bg-[#0053a0] text-white py-3 rounded-full font-bold text-lg hover-ebay-blue transition-all active:scale-95 shadow-md"
              >
                Buy It Now
              </button>
              <button 
                className="w-full bg-white text-ebay-blue py-3 rounded-full font-bold text-lg border border-ebay-blue hover:bg-blue-50 transition-colors"
              >
                Add to cart
              </button>
              <button className="w-full py-3 rounded-full font-bold text-lg border border-gray-300 hover:bg-gray-50 transition-colors bg-white">
                Add to watchlist
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex text-sm">
              <span className="w-24 text-gray-500">Shipping:</span>
              <span className="font-bold text-black text-green-700">FREE Standard Shipping</span>
            </div>
            <div className="flex text-sm">
              <span className="w-24 text-gray-500">Returns:</span>
              <span>30 day returns. Buyer pays for return shipping.</span>
            </div>
            <div className="flex text-sm items-center">
              <span className="w-24 text-gray-500">Payments:</span>
              <img src="https://ir.ebaystatic.com/cr/v/c1/payment_icons_v2.png" alt="Payments" className="h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Description</h2>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
          {item.description}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const { route, navigate } = useRoute();
  const [listings, setListings] = useState<Listing[]>([]);
  const [justSoldId, setJustSoldId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setListings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse listings', e);
      }
    }
  }, []);

  const handleSaveListing = (listingData: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      ...listingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    
    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Redirect to the new item page
    navigate(`#/item?id=${newListing.id}`);
  };

  const handleBuyItem = (id: string) => {
    const itemToBuy = listings.find(l => l.id === id);
    if (!itemToBuy) return;

    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    setJustSoldId(id);
    setTimeout(() => setJustSoldId(null), 5000);
    
    alert(`Congratulations! You've purchased "${itemToBuy.title}".`);
    navigate('#/');
  };

  const renderContent = () => {
    if (route.startsWith('#/sell')) {
      return <SellPage onSave={handleSaveListing} />;
    } else if (route.startsWith('#/item')) {
      return <ItemPage listings={listings} onBuy={handleBuyItem} onNavigate={navigate} />;
    } else {
      return (
        <>
          {justSoldId && (
            <div className="max-w-7xl mx-auto px-4 mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Item Sold!</strong>
                <span className="block sm:inline ml-2">Transaction successful. The item has been removed from the marketplace.</span>
              </div>
            </div>
          )}
          <HomePage listings={listings} onNavigate={navigate} />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f7f7f7]">
      <Header onNavigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-tighter">Buy</h4>
              <ul className="space-y-1">
                <li>Registration</li>
                <li>eBay Money Back Guarantee</li>
                <li>Bidding & buying help</li>
                <li>Stores</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-tighter">Sell</h4>
              <ul className="space-y-1">
                <li className="cursor-pointer hover:underline" onClick={() => navigate('#/sell')}>Start selling</li>
                <li>Learn to sell</li>
                <li>Affiliates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-tighter">About eBay</h4>
              <ul className="space-y-1">
                <li>Company info</li>
                <li>News</li>
                <li>Investors</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-tighter">Help & Contact</h4>
              <ul className="space-y-1">
                <li>Seller Center</li>
                <li>Contact Us</li>
                <li>Returns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-tighter">Community</h4>
              <ul className="space-y-1">
                <li>Announcements</li>
                <li>Discussion boards</li>
                <li>eBay Giving Works</li>
              </ul>
            </div>
          </div>
          <p className="border-t pt-8">Copyright © 1995-2024 eBay Inc. All Rights Reserved. Accessibility, User Agreement, Privacy, Payments Terms of Use, Cookies, CA Privacy Notice, Your Privacy Choices and AdChoice</p>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
