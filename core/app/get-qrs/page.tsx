import StoreQRSection from '@/components/StoreQRSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GetQRsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <Link href="/" className="flex items-center text-blue-600 mb-8 font-bold">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Scanner
      </Link>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-bold text-yellow-700">Developer Mode</p>
        <p className="text-sm text-yellow-700">
          1. Take a screenshot of a QR code below.<br/>
          2. Go back to the Home page.<br/>
          3. Upload the screenshot to test the scanner.
        </p>
      </div>

      <StoreQRSection />
    </div>
  );
}