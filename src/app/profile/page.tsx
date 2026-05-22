"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  reputation: number;
  createdAt: string;
}

interface Stats {
  bookmarks: number;
  comments: number;
  history: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ bookmarks: 0, comments: 0, history: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/bookmarks").then((r) => (r.ok ? r.json() : { bookmarks: [] })),
      fetch("/api/history").then((r) => (r.ok ? r.json() : { history: [] })),
    ])
      .then(([userData, bookmarkData, historyData]) => {
        if (userData?.user) setUser(userData.user);
        setStats({
          bookmarks: bookmarkData?.bookmarks?.length || 0,
          comments: 0,
          history: historyData?.history?.length || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Not signed in</h1>
        <p className="text-text-muted mb-6">Sign in to view your profile</p>
        <Link
          href="/login"
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      label: "Bookmarks",
      value: stats.bookmarks,
      href: "/bookmarks",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      label: "History",
      value: stats.history,
      href: "/history",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Reputation",
      value: user.reputation,
      href: "/leaderboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-bg-secondary border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center text-2xl font-bold shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-text-muted text-sm">{user.email}</p>
            {user.bio && <p className="text-text-secondary text-sm mt-1">{user.bio}</p>}
            <p className="text-text-muted text-xs mt-2">
              Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-bg-secondary border border-border rounded-xl p-4 hover:bg-bg-hover transition-colors text-center"
          >
            <div className="flex justify-center text-accent mb-2">{stat.icon}</div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-3">
        <Link
          href="/bookmarks"
          className="flex items-center gap-3 bg-bg-secondary border border-border rounded-lg p-4 hover:bg-bg-hover transition-colors"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-sm font-medium">My Bookmarks</span>
          <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/history"
          className="flex items-center gap-3 bg-bg-secondary border border-border rounded-lg p-4 hover:bg-bg-hover transition-colors"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Reading History</span>
          <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/leaderboard"
          className="flex items-center gap-3 bg-bg-secondary border border-border rounded-lg p-4 hover:bg-bg-hover transition-colors"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium">Leaderboard</span>
          <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
