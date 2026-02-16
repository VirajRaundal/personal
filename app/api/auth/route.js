import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (password !== adminPassword) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const session = await getSession();
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getSession();
    return NextResponse.json({ isLoggedIn: session.isLoggedIn === true });
}
