import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
    title: 'Posts | Viraj Raundal',
    description: 'All blog posts by Viraj Raundal.',
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="container">
            <section className="posts-section" style={{ paddingTop: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Posts</h1>
                {posts.length === 0 ? (
                    <p>No posts yet. Check back soon!</p>
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
                    </ul>
                )}
            </section>
        </div>
    );
}
