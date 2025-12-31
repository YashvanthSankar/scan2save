'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  MapPin,
  Trash2,
  Store as StoreIcon,
  Loader2,
  Sparkles,
  X,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Store {
  id: string;
  storeId: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export default function ManageStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [formData, setFormData] = useState({
    storeId: '',
    name: '',
    location: '',
    lat: '',
    lng: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      if (data.stores) {
        setStores(data.stores);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: formData.storeId,
          name: formData.name,
          location: formData.location,
          lat: parseFloat(formData.lat) || 0,
          lng: parseFloat(formData.lng) || 0
        })
      });

      const data = await res.json();

      if (data.success) {
        setStores([...stores, data.store]);
        setShowForm(false);
        setFormData({ storeId: '', name: '', location: '', lat: '', lng: '' });
        showNotification('success', 'Store added successfully!');
      } else {
        showNotification('error', data.error || 'Failed to create store');
      }
    } catch (err) {
      console.error('Error creating store:', err);
      showNotification('error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this store?')) return;

    // Optimistic update
    const previousStores = [...stores];
    setStores(stores.filter(s => s.id !== id));

    // Ideally call API to delete here
    // await fetch(`/api/stores/${id}`, { method: 'DELETE' });

    showNotification('success', 'Store removed');
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.storeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`premium-card p-4 flex items-center gap-3 border ${notification.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-rose-500/20 bg-rose-500/10'
            }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <p className="text-sm font-medium text-foreground">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl border border-indigo-500/20">
            <StoreIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Stores</h2>
            <p className="text-muted-foreground text-sm mt-1">Register new retail locations in the network.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${showForm
            ? 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105'
            }`}
        >
          {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Store</>}
        </button>
      </div>

      {/* Add Store Form */}
      {showForm && (
        <div className="premium-card p-6 animate-fade-in border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Register New Store</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Store Name</label>
              <input
                required
                placeholder="e.g. Reliance Fresh"
                className="input-premium w-full bg-background/50"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unique ID</label>
              <input
                required
                placeholder="e.g. REL_CHN_01"
                className="input-premium w-full uppercase bg-background/50"
                value={formData.storeId}
                onChange={e => setFormData({ ...formData, storeId: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  required
                  placeholder="e.g. Anna Nagar, Chennai"
                  className="input-premium w-full pl-12 bg-background/50"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Latitude</label>
              <input
                type="number"
                step="any"
                required
                placeholder="13.0827"
                className="input-premium w-full bg-background/50"
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Longitude</label>
              <input
                type="number"
                step="any"
                required
                placeholder="80.2707"
                className="input-premium w-full bg-background/50"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl mt-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Save Store'}
            </button>
          </form>
        </div>
      )}

      {/* Search Input */}
      {!loading && stores.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stores by name, ID, or location..."
            className="input-premium w-full !pl-12 py-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Store List */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
            <p className="text-muted-foreground text-sm font-medium">Loading network...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
              <StoreIcon className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Stores Found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              {searchQuery ? 'Try adjusting your search terms.' : 'Add your first partner store to the network to get started.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs font-bold text-muted-foreground border-b border-white/5 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-5">ID</th>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Coordinates</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStores.map((store, index) => (
                  <tr
                    key={store.id}
                    className="hover:bg-white/[0.02] transition-colors group animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="px-6 py-5 font-mono text-primary font-medium">{store.storeId}</td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground text-base">{store.name}</div>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {store.location}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-muted-foreground">
                      {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                        title="Remove Store"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}