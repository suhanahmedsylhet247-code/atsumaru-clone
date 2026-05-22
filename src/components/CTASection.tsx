import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Track progress",
    description: "Track your reading progress and continue reading from any device",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    title: "Bookmark your favorite comics",
    description: "Keep track of your favorite comics and never miss a chapter",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Comment, reply and upvote",
    description: "Engage with the community and share your thoughts on what you're reading",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Never miss a chapter",
    description: "Get notified when new chapters are added to your bookmarked manga",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Download chapters",
    description: "Download chapters for offline reading.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Customize your browsing experience",
    description: "Set and save filters to fine tune your browsing experience.",
  },
];

export default function CTASection() {
  return (
    <section className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary via-bg-card to-bg-secondary border border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent)_0%,_transparent_50%)] opacity-[0.07]" />
      <div className="relative px-6 py-10 md:px-12 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Have we met before?
        </h2>
        <p className="text-text-muted text-center text-sm mb-10 max-w-md mx-auto">
          Create an account to never lose your progress again
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 p-4 rounded-xl bg-bg-primary/50 border border-border/50 hover:border-border hover:bg-bg-primary/80 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{feature.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-accent font-medium mb-4">
            It&apos;s completely free and always will be
          </p>
          <Link
            href="/register"
            className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}
