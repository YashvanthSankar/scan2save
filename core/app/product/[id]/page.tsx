import Link from 'next/link';
import { ArrowLeft, ShoppingCart, MapPin, Tag, Star, Package, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const productId = parseInt(id);
    if (isNaN(productId)) return null;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        storeListings: {
          where: { inStock: true },
          include: {
            store: {
              select: { name: true, storeId: true, location: true }
            }
          },
          take: 5
        },
        offers: {
          where: {
            validUntil: { gte: new Date() }
          },
          take: 3
        }
      }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  // Get the best price from store listings
  const prices = product.storeListings.map(sl => Number(sl.price));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Best offer
  const bestOffer = product.offers.length > 0
    ? product.offers.reduce((best, curr) => curr.discountPercentage > best.discountPercentage ? curr : best)
    : null;

  return (
    <div className="min-h-screen text-foreground pb-32 font-sans">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <Link href="/cart" className="p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-3xl overflow-hidden relative">
            <img
              src={product.imageUrl || 'https://placehold.co/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {bestOffer && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                {bestOffer.discountPercentage}% OFF
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
              {product.category}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">₹{lowestPrice.toLocaleString()}</span>
                {highestPrice > lowestPrice && (
                  <span className="text-lg text-muted-foreground">- ₹{highestPrice.toLocaleString()}</span>
                )}
              </div>
              {bestOffer && (
                <p className="text-sm text-emerald-500 font-medium mt-2 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {bestOffer.title}
                </p>
              )}
            </div>

            {/* Barcode */}
            {product.barcode && (
              <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Barcode / SKU</p>
                  <p className="font-mono text-sm text-foreground">{product.barcode}</p>
                </div>
              </div>
            )}

            {/* Availability */}
            <div>
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Available at {product.storeListings.length} stores
              </h3>
              <div className="space-y-2">
                {product.storeListings.map((listing, i) => (
                  <Link
                    key={i}
                    href={`/store/${listing.store.storeId}`}
                    className="flex items-center justify-between p-3 bg-card/40 border border-border rounded-xl hover:border-primary/30 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-foreground">{listing.store.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.aisle ? `Aisle ${listing.aisle}` : listing.store.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">₹{Number(listing.price).toLocaleString()}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Offers */}
            {product.offers.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Active Offers
                </h3>
                <div className="space-y-2">
                  {product.offers.map((offer, i) => (
                    <div key={i} className="p-3 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl">
                      <p className="font-medium text-foreground">{offer.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {offer.discountPercentage}% off • Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      {product.storeListings.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 z-50">
          <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Best Price</p>
              <p className="text-2xl font-bold text-foreground">₹{lowestPrice.toLocaleString()}</p>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: lowestPrice,
                image: product.imageUrl || undefined
              }}
              storeId={product.storeListings[0].store.storeId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
