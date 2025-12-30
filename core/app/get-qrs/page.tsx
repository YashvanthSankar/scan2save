import StoreQRSection from '@/components/StoreQRSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GetQRsPage() {
  return (
    <div className="min-h-screen text-foreground p-8 font-sans">
      <Link href="/" className="flex items-center text-primary mb-8 font-bold hover:text-primary/80 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Scanner
      </Link>

      <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
        <p className="font-bold text-yellow-600 dark:text-yellow-500">Developer Mode</p>
        <p className="text-sm text-yellow-600/90 dark:text-yellow-500/90">
          1. Take a screenshot of a QR code below.<br />
          2. Go back to the Home page.<br />
          3. Upload the screenshot to test the scanner.
        </p>
      </div>

      <StoreQRSection />
    </div>
  );
}