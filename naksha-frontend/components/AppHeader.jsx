'use client';

import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useHeader } from '@/components/HeaderContext';

export default function AppHeader() {
  const { rightContent } = useHeader();
  const router = useRouter();

  const handleHomeClick = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        router.push('/welcome');
        return;
      }
    } catch {
      // Fall back to guest dashboard.
    }
    router.push('/guest-dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={handleHomeClick}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            aria-label="Go to dashboard"
          >
            Naksha
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}
