import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Atsumaru - Read Manga Online",
  description: "Read manga, manhwa, and manhua online for free. The fastest manga aggregator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-bg-secondary border-t border-border mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Atsumaru</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><a href="/" className="hover:text-text-primary">Home</a></li>
                  <li><a href="/leaderboard" className="hover:text-text-primary">Leaderboard</a></li>
                  <li><a href="/explore" className="hover:text-text-primary">Explore</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Browse</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><a href="/explore" className="hover:text-text-primary">Advanced search</a></li>
                  <li><a href="/explore?sort=recent" className="hover:text-text-primary">Recently added</a></li>
                  <li><a href="/explore?sort=popular" className="hover:text-text-primary">Popular</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Account</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><a href="/bookmarks" className="hover:text-text-primary">Bookmarks</a></li>
                  <li><a href="/profile" className="hover:text-text-primary">Profile</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">About</h3>
                <p className="text-sm text-text-muted">
                  Atsumaru is a manga aggregator that pulls the latest chapters from various sources.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-center text-sm text-text-muted">
              Atsumaru &copy; {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
