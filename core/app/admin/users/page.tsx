import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getAdminUsers } from '@/lib/data';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const users = await getAdminUsers(session.userId);

  if (!users) {
    return <div className="p-8 text-center text-rose-500">Access Denied</div>;
  }

  return <AdminUsersClient initialUsers={users} />;
}