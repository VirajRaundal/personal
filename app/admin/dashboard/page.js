'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        fetchPosts();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (!data.isLoggedIn) {
            router.push('/admin');
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
            }
        } catch (err) {
            console.error('Failed to delete post');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    };

    return (
        <div className="container">
            <div className="admin-page">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/admin/editor" className="btn btn-primary">
                            + New Post
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Log Out
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        Loading posts...
                    </p>
                ) : posts.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        No posts yet. Create your first post!
                    </p>
                ) : (
                    <ul className="dashboard-posts">
                        {posts.map(post => (
                            <li key={post.slug} className="dashboard-post-item">
                                <div className="dashboard-post-info">
                                    <div className="dashboard-post-title">{post.title}</div>
                                    <div className="dashboard-post-date">
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                        {' • '}{post.readingTime}
                                    </div>
                                </div>
                                <div className="dashboard-post-actions">
                                    <Link
                                        href={`/admin/editor/${post.slug}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
