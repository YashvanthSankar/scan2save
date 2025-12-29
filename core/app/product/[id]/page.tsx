import Link from 'next/link';
import { ArrowLeft, ShoppingCart, MapPin, Tag } from 'lucide-react';

async function getProduct(id: string) {
  return null;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <nav className="border-b border-slate-800 p-4">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <p className="text-slate-400 mt-4">Product ID: {id}</p>
      </div>
    </div>
  );
}
