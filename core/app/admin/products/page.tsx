'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    Package,
    Check,
    X,
    Loader2,
    Save,
    Store,
    Filter
} from 'lucide-react';

interface Product {
    id: number;
    productId: number;
    name: string;
    category: string;
    image: string | null;
    price: number;
    aisle: string | null;
    inStock: boolean;
}

interface StoreInfo {
    id: string;
    storeId: string;
    name: string;
}

export default function AdminProductsPage() {
    const [stores, setStores] = useState<{ id: string; storeId: string; name: string }[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [editingAisle, setEditingAisle] = useState<{ id: number; value: string } | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch stores on mount
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch('/api/stores');
                const data = await res.json();
                if (data.success && data.stores) {
                    setStores(data.stores);
                    if (data.stores.length > 0) {
                        setSelectedStoreId(data.stores[0].storeId);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch stores', err);
            }
        };
        fetchStores();
    }, []);

    // Fetch products when store changes
    useEffect(() => {
        if (!selectedStoreId) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/products?storeId=${selectedStoreId}`);
                const data = await res.json();
                if (data.success) {
                    setStoreInfo(data.store);
                    setProducts(data.products);
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedStoreId]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveAisle = async (productId: number, newAisle: string) => {
        setSaving(productId);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeProductId: productId, aisle: newAisle })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, aisle: newAisle || null } : p
                ));
                showNotification('success', 'Location saved!');
            } else {
                showNotification('error', data.error || 'Failed to save');
            }
        } catch (err) {
            showNotification('error', 'Network error');
        } finally {
            setSaving(null);
            setEditingAisle(null);
        }
    };

    const handleToggleStock = async (productId: number, currentStock: boolean) => {
        setSaving(productId);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeProductId: productId, inStock: !currentStock })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, inStock: !currentStock } : p
                ));
                showNotification('success', `Product ${!currentStock ? 'in stock' : 'out of stock'}`);
            }
        } catch (err) {
            showNotification('error', 'Failed to update stock');
        } finally {
            setSaving(null);
        }
    };

    const categories = Array.from(new Set(products.map(p => p.category)));

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                    {notification.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Product Locations</h1>
                    <p className="text-muted-foreground">Set aisle/shelf locations to help shoppers find products in-store.</p>
                </div>

                {/* Store Selector */}
                <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={selectedStoreId}
                        onChange={(e) => setSelectedStoreId(e.target.value)}
                        className="bg-card/50 border border-border rounded-xl px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                    >
                        {stores.map(store => (
                            <option key={store.storeId} value={store.storeId}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-foreground uppercase text-xs font-bold tracking-wider border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            Location
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                        {/* Product */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-muted"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-foreground">{product.name}</span>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-lg">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 text-foreground font-medium">
                                            ₹{product.price.toLocaleString()}
                                        </td>

                                        {/* Location/Aisle */}
                                        <td className="px-6 py-4">
                                            {editingAisle?.id === product.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingAisle.value}
                                                        onChange={(e) => setEditingAisle({ ...editingAisle, value: e.target.value })}
                                                        placeholder="e.g. A4, Aisle 3"
                                                        className="w-32 bg-background border border-primary rounded-lg px-2 py-1 text-sm focus:outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveAisle(product.id, editingAisle.value);
                                                            if (e.key === 'Escape') setEditingAisle(null);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleSaveAisle(product.id, editingAisle.value)}
                                                        disabled={saving === product.id}
                                                        className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                                    >
                                                        {saving === product.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingAisle(null)}
                                                        className="p-1 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingAisle({ id: product.id, value: product.aisle || '' })}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${product.aisle
                                                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                        }`}
                                                >
                                                    <MapPin className="w-3 h-3" />
                                                    {product.aisle || 'Set location'}
                                                </button>
                                            )}
                                        </td>

                                        {/* Stock Toggle */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStock(product.id, product.inStock)}
                                                disabled={saving === product.id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${product.inStock
                                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                                    }`}
                                            >
                                                {saving === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                ) : product.inStock ? (
                                                    'In Stock'
                                                ) : (
                                                    'Out of Stock'
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            {searchTerm || categoryFilter ? 'No products match your filters' : 'No products in this store yet'}
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="premium-card p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{products.length}</div>
                    <div className="text-xs text-muted-foreground">Total Products</div>
                </div>
                <div className="premium-card p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                        {products.filter(p => p.aisle).length}
                    </div>
                    <div className="text-xs text-muted-foreground">With Location</div>
                </div>
                <div className="premium-card p-4 text-center">
                    <div className="text-2xl font-bold text-amber-400">
                        {products.filter(p => !p.aisle).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Missing Location</div>
                </div>
                <div className="premium-card p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                        {products.filter(p => p.inStock).length}
                    </div>
                    <div className="text-xs text-muted-foreground">In Stock</div>
                </div>
            </div>
        </div>
    );
}
