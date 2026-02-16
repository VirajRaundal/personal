'use client';

import { useState, useEffect } from 'react';
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

export default function NewEditorPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth')
            .then(res => res.json())
            .then(data => {
                if (!data.isLoggedIn) router.push('/admin');
            });
    }, [router]);

    const handlePublish = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!content.trim() || content === '<p></p>') {
            setError('Content is required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
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
                setError(data.error || 'Failed to publish');
            }
        } catch {
            setError('Failed to publish');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container">
            <div className="editor-page">
                <input
                    type="text"
                    className="form-input title-input"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />

                <input
                    type="text"
                    className="form-input tags-input"
                    placeholder="Tags (comma-separated, e.g. nextjs, react, webdev)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <RichTextEditor content={content} onChange={setContent} />

                {error && <p className="error-message">{error}</p>}

                <div className="editor-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handlePublish}
                        disabled={saving}
                    >
                        {saving ? 'Publishing...' : 'Publish'}
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
