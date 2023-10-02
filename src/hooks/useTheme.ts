import { useContext, useEffect, useState } from "react";

import { ThemeContext, ThemeProps } from "../theme/ThemeContext";
import { ThemeAttributes, Themes, themes, ThemeType } from "../theme/themes";

type Return = () => {
  theme: {
    [key in ThemeAttributes]: string | { [key: string]: string };
  };
  themeName: ThemeType;
  setTheme: (selectedTheme: Themes) => void;
};

const useTheme: Return = () => {
  const { currentTheme, setTheme }: ThemeProps = useContext(ThemeContext);
  const [theme, setHookTheme] = useState(() => themes[currentTheme]);

  useEffect(() => {
    setHookTheme(themes[currentTheme]);
  }, [currentTheme]);

  return { theme, themeName: currentTheme, setTheme };
};

export default useTheme;
