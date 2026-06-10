

import { createContext, useEffect, useState } from "react";

export const Theme = createContext();
const ThemeContext = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('aura-theme') === 'dark');
  useEffect(() => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aura-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('aura-theme', 'light');
      }
    }, [isDark]);
  return <Theme.Provider value={{ isDark, setIsDark }}>{children}</Theme.Provider>;
};
export default ThemeContext;
