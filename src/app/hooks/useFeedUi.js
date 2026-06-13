'use client';

import { useCallback, useState } from 'react';

export function useToggle(initial = false) {
  const [open, setOpen] = useState(initial);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);
  return { open, toggle, close, setOpen };
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);
  return { darkMode, toggleDarkMode };
}
