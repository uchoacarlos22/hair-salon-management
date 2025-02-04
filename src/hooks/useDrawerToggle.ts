// src/hooks/useDrawerToggle.ts
import { useState } from 'react';

export const useDrawerToggle = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  return { mobileOpen, handleDrawerToggle };
};
