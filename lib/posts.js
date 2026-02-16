import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'data', 'posts');

function ensureDir() {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
}

function calculateReadingTime(content) {
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

export function getAllPosts() {
    ensureDir();
    const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.json'));
    const posts = files.map(file => {
        const raw = fs.readFileSync(path.join(postsDirectory, file), 'utf-8');
        return JSON.parse(raw);
    });
    // Sort by createdAt descending
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return posts;
}

export function getPostBySlug(slug) {
    ensureDir();
    const filePath = path.join(postsDirectory, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}

export function createPost({ title, content, excerpt, tags }) {
    ensureDir();
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const now = new Date().toISOString();
    const post = {
        slug,
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
        tags: tags || [],
        readingTime: calculateReadingTime(content),
        createdAt: now,
        updatedAt: now,
    };

    const filePath = path.join(postsDirectory, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    return post;
}

export function updatePost(slug, { title, content, excerpt, tags }) {
    ensureDir();
    const filePath = path.join(postsDirectory, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updated = {
        ...existing,
        title: title ?? existing.title,
        content: content ?? existing.content,
        excerpt: excerpt || (content ? content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : existing.excerpt),
        tags: tags ?? existing.tags,
        readingTime: content ? calculateReadingTime(content) : existing.readingTime,
        updatedAt: new Date().toISOString(),
    };

    // If title changed, rename file
    const newSlug = (title ?? existing.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    updated.slug = newSlug;

    if (newSlug !== slug) {
        fs.unlinkSync(filePath);
    }

    const newFilePath = path.join(postsDirectory, `${newSlug}.json`);
    fs.writeFileSync(newFilePath, JSON.stringify(updated, null, 2));
    return updated;
}

export function deletePost(slug) {
    ensureDir();
    const filePath = path.join(postsDirectory, `${slug}.json`);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
}

export function searchPosts(query) {
    const posts = getAllPosts();
    if (!query) return posts;
    const q = query.toLowerCase();
    return posts.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q)))
    );
}
