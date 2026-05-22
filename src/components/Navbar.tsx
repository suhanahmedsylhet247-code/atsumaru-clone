"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";

interface User {
  id: string;
  username: string;
  avatar: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <>
      <SearchOverlay />
      <nav className="sticky top-0 z-50 bg-bg-secondary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-wider text-text-primary shrink-0">
            ATSUMARU
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-16 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded border border-border">
                Ctrl K
              </span>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link href="/explore" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden md:block">
              Explore
            </Link>
            <Link href="/leaderboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden md:block">
              Leaderboard
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-bg-hover flex items-center justify-center text-sm font-medium">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user.username}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover" onClick={() => setMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link href="/bookmarks" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover" onClick={() => setMenuOpen(false)}>
                      Bookmarks
                    </Link>
                    <Link href="/history" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover" onClick={() => setMenuOpen(false)}>
                      History
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        setUser(null);
                        setMenuOpen(false);
                        router.refresh();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-bg-hover"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
