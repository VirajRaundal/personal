'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div style={{ padding: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            Loading editor...
        </div>
    ),
});

export default function EditEditorPage({ params }) {
    const { slug } = use(params);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check auth
        fetch('/api/auth')
            .then(res => res.json())
            .then(data => {
                if (!data.isLoggedIn) router.push('/admin');
            });

        // Fetch post
        fetch(`/api/posts/${slug}`)
            .then(res => res.json())
            .then(post => {
                if (post.error) {
                    setError('Post not found');
                } else {
                    setTitle(post.title);
                    setContent(post.content);
                    setTags(post.tags ? post.tags.join(', ') : '');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load post');
                setLoading(false);
            });
    }, [slug, router]);

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    content,
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save');
            }
        } catch {
            setError('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="editor-page">
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        Loading post...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="editor-page">
                <input
                    type="text"
                    className="form-input title-input"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    className="form-input tags-input"
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                {content !== '' && (
                    <RichTextEditor content={content} onChange={setContent} />
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="editor-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => router.push('/admin/dashboard')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
