'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  MapPin,
  Trash2,
  Store as StoreIcon,
  Loader2,
  Sparkles,
  X
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
      } else {
        alert('Failed to create store: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating store:', err);
      alert('Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this store?')) return;
    setStores(stores.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
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
        <div className="premium-card p-6 animate-fade-in">
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
                className="input-premium w-full"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unique ID</label>
              <input
                required
                placeholder="e.g. REL_CHN_01"
                className="input-premium w-full uppercase"
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
                  className="input-premium w-full pl-12"
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
                className="input-premium w-full"
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
                className="input-premium w-full"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl mt-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Store
            </button>
          </form>
        </div>
      )}

      {/* Store List */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
            <p className="text-muted-foreground text-sm">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-2xl flex items-center justify-center">
              <StoreIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-bold text-foreground mb-2">No Stores Found</h3>
            <p className="text-muted-foreground text-sm">Add your first store using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Coords</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stores.map((store, index) => (
                  <tr
                    key={store.id}
                    className="hover:bg-white/[0.02] transition-colors group animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="px-6 py-4 font-mono text-primary">{store.storeId}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{store.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{store.location}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{store.lat.toFixed(2)}, {store.lng.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="p-2.5 hover:bg-rose-500/10 rounded-xl text-muted-foreground hover:text-rose-400 transition-all"
                      >
                        <Trash2 size={16} />
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