import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };
    return {
        title: `${post.title} | Viraj Raundal`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="container">
            <Link href="/blog" className="back-link">
                ← Back to posts
            </Link>

            <article>
                <header className="post-header">
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        <span>Published: {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>• {post.readingTime}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="post-meta" style={{ marginTop: '0.5rem' }}>
                            {post.tags.map(tag => (
                                <span key={tag} style={{
                                    fontSize: '0.75rem',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)',
                                    fontFamily: 'var(--font-mono)'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(post => ({ slug: post.slug }));
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';
