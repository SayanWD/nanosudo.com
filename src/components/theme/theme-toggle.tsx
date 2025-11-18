'use client';

import type { ReactElement } from "react";
import { useState, useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing icon after mount
  // useLayoutEffect runs synchronously before browser paint
  // This is necessary to prevent hydration mismatch between server and client
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Show Moon when theme is 'light' (because clicking will switch to dark)
  // Show Sun when theme is 'dark' (because clicking will switch to light)
  // On server and initial render, always show Sun to avoid mismatch
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
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}

