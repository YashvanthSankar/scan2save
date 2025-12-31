import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getAdminStores } from '@/lib/data';
import StoresClient from './StoresClient';

export default async function ManageStoresPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const stores = await getAdminStores(session.userId);

  if (!stores) {
    // Handle unauthorized or error (e.g. redirect or show error)
    return <div className="p-8 text-center text-rose-500">Access Denied</div>;
  }

  return <StoresClient initialStores={stores} />;
}