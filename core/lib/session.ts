import { cookies } from 'next/headers';

export interface SessionUser {
    userId: string;
    role: string;
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) return null;

    try {
        return JSON.parse(sessionCookie.value) as SessionUser;
    } catch (error) {
        console.error('Failed to parse session cookie', error);
        return null;
    }
}
