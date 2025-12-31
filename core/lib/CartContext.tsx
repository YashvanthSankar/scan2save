'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: number; // This is now the CartItem ID from DB
    storeId?: string; // Optional because optimistic updates might not have it immediately
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
    decrementItem: (productId: number) => Promise<void>;
    totalItems: number;
    totalAmount: number;
    loading: boolean;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
    initialUserId?: string | null;
}

export function CartProvider({ children, initialUserId }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(initialUserId || null);

    // Fetch User ID on Mount (only if not provided from server), then fetch cart
    useEffect(() => {
        const initCart = async () => {
            let currentUserId = userId;
            if (!currentUserId) {
                try {
                    // First get the current user's ID
                    const userRes = await fetch('/api/user/me');
                    const userData = await userRes.json();

                    if (userData.success && userData.user?.id) {
                        setUserId(userData.user.id);
                        currentUserId = userData.user.id;
                    }
                } catch (error) {
                    console.error('Failed to init cart:', error);
                }
            }
            if (currentUserId) {
                await fetchCartForUser(currentUserId);
            }
        };
        initCart();
    }, [initialUserId]); // Re-run if initialUserId changes

    const fetchCartForUser = async (uid: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/cart?userId=${uid}`);
            const data = await res.json();
            if (data.success && data.items) {
                // API returns flat items: { id, storeId, productId, name, price, quantity, image }
                const mappedItems = data.items.map((item: any) => ({
                    id: item.id,
                    storeId: item.storeId || data.cart?.storeId,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        if (userId) {
            await fetchCartForUser(userId);
        }
    };

    const addItem = async (product: { id: number; name: string; price: number; image?: string }, storeId: string) => {
        if (!userId) {
            console.error('Cannot add item: User not logged in. userId:', userId);
            return;
        }

        console.log('Adding item:', { product, storeId, userId });

        // Optimistic UI Update - include storeId!
        const tempId = Date.now(); // Temporary ID until we refresh
        setItems(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                id: tempId,
                storeId: storeId, // FIXED: Include storeId in new item
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
                    userId: userId,
                    storeId: storeId,
                    productId: product.id,
                    quantity: 1
                })
            });

            const responseData = await res.json();
            console.log('Add to cart response:', responseData);

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to add item');
            }

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

    const decrementItem = async (productId: number) => {
        const item = items.find(i => i.productId === productId);
        if (!item) return;

        if (item.quantity > 1) {
            // Optimistic Decrement
            setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i));

            // API Call would ideally be "update quantity" but for now reusing add with negative? 
            // Or better: Implement proper update or just re-use POST with quantity: -1 if the API supports it.
            // Looking at api/cart/route.ts:
            // It does: `update({ quantity: existingItem.quantity + quantity })`
            // So sending quantity: -1 should work!

            try {
                const res = await fetch('/api/cart', {
                    method: 'POST', // Using POST to update
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        // storeId not strictly needed for update but validation might check it
                        storeId: items[0]?.storeId || '',
                        productId: productId,
                        quantity: -1
                    })
                });
                if (!res.ok) throw new Error('Failed to decrement');
                await fetchCart(); // Sync
            } catch (err) {
                console.error(err);
                fetchCart();
            }
        } else {
            // Remove if quantity is 1
            await removeItem(item.id);
        }
    };

    const clearCart = () => {
        setItems([]);
        // Ideally call API to clear cart here
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, decrementItem, clearCart, totalItems, totalAmount, loading }}>
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
