'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/" className="navbar-brand">
                    Viraj Raundal
                </Link>

                <ul className="navbar-links">
                    <li><Link href="/blog">Posts</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li>
                        <Link href="/search" aria-label="Search">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <button
                            className="theme-toggle theme-toggle-desktop"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </li>
                </ul>

                <div className="mobile-controls">
                    <button
                        className="theme-toggle mobile-theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button
                        className="hamburger"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                <Link href="/blog" onClick={() => setMobileOpen(false)}>Posts</Link>
                <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
                <Link href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
            </div>
        </nav>
    );
}
