'use client';

import type { ReactElement } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  // Show Moon when theme is 'light' (because clicking will switch to dark)
  // Show Sun when theme is 'dark' (because clicking will switch to light)
  // On server, always show Sun to match initial client render
  const showMoon = typeof window !== 'undefined' && theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-surface hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={typeof window !== 'undefined' ? (theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему') : 'Переключить тему'}
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

