'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Hardcoded for Demo (matches seeded user)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000002';

// We need the Store ID to create a cart if it doesn't exist. 
// For this demo, we can assume a default store or pass it when adding items.
// Ideally, this comes from the current route, but Context is global.
// We'll update addItem to accept storeId.

interface CartItem {
    id: number; // This is now the CartItem ID from DB
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: { id: number; name: string; price: number; image?: string }, storeId: string) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    totalItems: number;
    totalAmount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch Cart on Mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/cart?userId=${DEMO_USER_ID}`);
            const data = await res.json();
            if (data.success && data.items) {
                // Map API response to our CartItem shape
                const mappedItems = data.items.map((item: any) => ({
                    id: item.id, // CartItem ID
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.product.image_url
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (product: { id: number; name: string; price: number; image?: string }, storeId: string) => {
        // Optimistic UI Update
        const tempId = Date.now(); // Temporary ID until we refresh
        setItems(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                id: tempId,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            }];
        });

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: DEMO_USER_ID,
                    storeId: storeId,
                    productId: product.id,
                    quantity: 1
                })
            });

            if (!res.ok) throw new Error('Failed to add item');

            // Refresh cart to get real IDs and synced state
            await fetchCart();

        } catch (error) {
            console.error('Error adding item:', error);
            // Revert optimistic update (simplified: just re-fetch or could rollback state)
            fetchCart();
        }
    };

    const removeItem = async (cartItemId: number) => {
        // Optimistic UI
        setItems(prev => prev.filter(i => i.id !== cartItemId));

        try {
            const res = await fetch(`/api/cart?itemId=${cartItemId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete item');
        } catch (error) {
            console.error('Error removing item:', error);
            fetchCart();
        }
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, totalItems, totalAmount, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
