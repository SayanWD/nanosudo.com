'use client';

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();
  // Start with false to match server render
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial hydration, always show Sun icon
  // After mount, show correct icon based on theme
  // Show Moon when theme is 'light' (because clicking will switch to dark)
  // Show Sun when theme is 'dark' (because clicking will switch to light)
  const showMoon = mounted && theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-surface hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={mounted ? (theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему') : 'Переключить тему'}
      suppressHydrationWarning
    >
      {showMoon ? (
        <Moon className="w-5 h-5" suppressHydrationWarning />
      ) : (
        <Sun className="w-5 h-5" suppressHydrationWarning />
      )}
    </button>
  );
}

