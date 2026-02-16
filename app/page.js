import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import SocialIcons from './components/SocialIcons';

export default function Home() {
  const posts = getAllPosts().slice(0, 10);

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>Hi, I&apos;m Viraj.</h1>
        <p className="hero-tagline">
          Developer, builder, and tinkerer. Writing about tech, software, and ideas that excite me.
        </p>
        <SocialIcons />
      </section>

      {/* Recent Posts */}
      <section className="posts-section">
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
        {posts.length > 0 && (
          <Link href="/blog" className="view-all-link">
            All Posts →
          </Link>
        )}
      </section>
    </div>
  );
}
