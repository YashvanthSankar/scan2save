'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  MapPin,
  Trash2,
  Store as StoreIcon,
  Search,
  Loader2
} from 'lucide-react';

// Define the shape of a Store
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

  // Form State
  const [formData, setFormData] = useState({
    storeId: '',
    name: '',
    location: '',
    lat: '',
    lng: ''
  });

  // 1. Fetch Stores on Load
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

    // For now, just remove from UI. DELETE endpoint can be added later.
    setStores(stores.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <StoreIcon className="text-primary" />
            Manage Stores
          </h2>
          <p className="text-muted-foreground mt-1">Register new retail locations in the network.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add New Store</>}
        </button>
      </div>

      {/* ADD STORE FORM */}
      {showForm && (
        <div className="bg-card/40 backdrop-blur-md border border-primary/20 p-6 rounded-2xl animate-in slide-in-from-top-4 shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-4">Register New Store</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase font-bold">Store Name</label>
              <input
                required
                placeholder="e.g. Reliance Fresh"
                className="w-full bg-background/50 border border-border p-3 rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase font-bold">Unique ID</label>
              <input
                required
                placeholder="e.g. REL_CHN_01"
                className="w-full bg-background/50 border border-border p-3 rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase transition-all"
                value={formData.storeId}
                onChange={e => setFormData({ ...formData, storeId: e.target.value })}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-muted-foreground uppercase font-bold">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  required
                  placeholder="e.g. Anna Nagar, Chennai"
                  className="w-full bg-background/50 border border-border p-3 pl-10 rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase font-bold">Latitude</label>
              <input type="number" step="any" required placeholder="13.0827" className="w-full bg-background/50 border border-border p-3 rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase font-bold">Longitude</label>
              <input type="number" step="any" required placeholder="80.2707" className="w-full bg-background/50 border border-border p-3 rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} />
            </div>
            <button type="submit" className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mt-2 transition-colors shadow-md">
              Save Store
            </button>
          </form>
        </div>
      )}

      {/* STORE LIST */}
      <div className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center text-primary"><Loader2 className="animate-spin w-8 h-8" /></div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No stores found. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Coords</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-primary">{store.storeId}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{store.name}</td>
                    <td className="px-6 py-4">{store.location}</td>
                    <td className="px-6 py-4 font-mono text-xs">{store.lat.toFixed(2)}, {store.lng.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
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