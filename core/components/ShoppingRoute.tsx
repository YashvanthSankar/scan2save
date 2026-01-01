'use client';

import { useState } from 'react';
import { MapPin, ChevronRight, Check, Navigation, Route } from 'lucide-react';

interface CartItem {
    id: number;
    productId: number;
    name: string;
    quantity: number;
    aisle?: string;
    image?: string;
}

interface ShoppingRouteProps {
    items: CartItem[];
}

// Parse aisle for sorting: "Aisle 4" -> 4, "Dairy" -> 1000 (alphabetical fallback)
function parseAisleOrder(aisle: string): number {
    const match = aisle.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
    // Alphabetical order for non-numeric aisles
    return 1000 + aisle.charCodeAt(0);
}

export default function ShoppingRoute({ items }: ShoppingRouteProps) {
    const [pickedItems, setPickedItems] = useState<Set<number>>(new Set());
    const [isExpanded, setIsExpanded] = useState(true);

    if (items.length === 0) return null;

    // Group items by aisle
    const aisleGroups: Map<string, CartItem[]> = new Map();
    items.forEach(item => {
        const aisle = item.aisle || 'Unknown';
        if (!aisleGroups.has(aisle)) {
            aisleGroups.set(aisle, []);
        }
        aisleGroups.get(aisle)!.push(item);
    });

    // Sort aisles for optimal route
    const sortedAisles = Array.from(aisleGroups.entries())
        .sort((a, b) => parseAisleOrder(a[0]) - parseAisleOrder(b[0]));

    const totalPicked = pickedItems.size;
    const progress = (totalPicked / items.length) * 100;

    const togglePicked = (productId: number) => {
        setPickedItems(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    return (
        <div className="premium-card mb-6 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                        <Route className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            Shopping Route
                            <span className="text-xs font-normal text-muted-foreground">
                                ({sortedAisles.length} stops)
                            </span>
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {totalPicked === items.length
                                ? '✓ All items collected!'
                                : `${totalPicked}/${items.length} items picked`
                            }
                        </p>
                    </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>

            {/* Progress Bar */}
            <div className="px-4 pb-2">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Route Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                    {sortedAisles.map(([aisle, aisleItems], index) => {
                        const allPicked = aisleItems.every(item => pickedItems.has(item.productId));

                        return (
                            <div
                                key={aisle}
                                className={`relative pl-8 ${allPicked ? 'opacity-60' : ''}`}
                            >
                                {/* Timeline connector */}
                                {index < sortedAisles.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-primary/10" />
                                )}

                                {/* Stop marker */}
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${allPicked
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-primary/20 text-primary'
                                    }`}>
                                    {allPicked ? <Check className="w-3.5 h-3.5" /> : index + 1}
                                </div>

                                {/* Aisle Card */}
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="font-semibold text-sm text-foreground">{aisle}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({aisleItems.reduce((sum, i) => sum + i.quantity, 0)} items)
                                        </span>
                                    </div>

                                    {/* Items in this aisle */}
                                    <div className="space-y-1.5">
                                        {aisleItems.map(item => {
                                            const isPicked = pickedItems.has(item.productId);
                                            return (
                                                <button
                                                    key={item.productId}
                                                    onClick={() => togglePicked(item.productId)}
                                                    className={`w-full flex items-center gap-2 text-left p-2 rounded-lg transition-all ${isPicked
                                                            ? 'bg-emerald-500/10 line-through text-muted-foreground'
                                                            : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isPicked
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-white/20'
                                                        }`}>
                                                        {isPicked && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="flex-1 text-sm truncate">{item.name}</span>
                                                    {item.quantity > 1 && (
                                                        <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Checkout indicator */}
                    <div className="relative pl-8">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${totalPicked === items.length
                                ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                                : 'bg-white/10 text-muted-foreground'
                            }`}>
                            <Navigation className="w-3.5 h-3.5" />
                        </div>
                        <div className={`text-sm font-medium py-2 ${totalPicked === items.length ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Proceed to Checkout →
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
