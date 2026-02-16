'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setAllPosts(data);
                setPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setPosts(allPosts);
            return;
        }
        const q = query.toLowerCase();
        const filtered = allPosts.filter(post =>
            post.title.toLowerCase().includes(q) ||
            post.excerpt.toLowerCase().includes(q) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q)))
        );
        setPosts(filtered);
    }, [query, allPosts]);

    return (
        <div className="container">
            <div className="search-page">
                <h1>Search</h1>

                <div className="search-input-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search any article ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                {query && (
                    <div className="search-results-count">
                        {posts.length} result{posts.length !== 1 ? 's' : ''} found
                    </div>
                )}

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        Loading posts...
                    </p>
                ) : (
                    <ul className="post-list">
                        {posts.map(post => (
                            <li key={post.slug} className="post-item">
                                <Link href={`/blog/${post.slug}`} className="post-item-link">
                                    <div className="post-title">{post.title}</div>
                                    <div className="post-meta">
                                        <span>Published: {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>• {post.readingTime}</span>
                                    </div>
                                    <p className="post-excerpt">{post.excerpt}</p>
                                </Link>
                            </li>
                        ))}
                        {posts.length === 0 && query && (
                            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', paddingTop: '1rem' }}>
                                No results for &quot;{query}&quot;
                            </p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
