import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/posts';
import { isAuthenticated } from '@/lib/session';

export async function GET() {
    const posts = getAllPosts();
    return NextResponse.json(posts);
}

export async function POST(request) {
    const authed = await isAuthenticated();
    if (!authed) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content, excerpt, tags } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const post = createPost({ title, content, excerpt, tags });
        return NextResponse.json(post, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
