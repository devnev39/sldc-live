import { createContext, useEffect, useState } from "react";
import "intro.js/introjs.css";
import { changeChartColor } from "../charts/index.js";

export const ThemeContext = createContext(false);

/**
 * Creates a context provider for managing the dark theme state and color theme changes.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @return {JSX.Element} The context provider component.
 */
export const ThemeContextProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const changeColorTheme = (event) => {
    if (event.matches) {
      setIsDarkTheme(true);
      // Chart.defaults.color = chartJsDarkColor;
    } else {
      setIsDarkTheme(false);
      // Chart.defaults.color = chartJsLightColor;
    }
    changeChartColor(event.matches);
  };

  useEffect(() => {
    // Used to set the theme according to device theme

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      changeColorTheme({ matches: true });
    } else {
      changeColorTheme({ matches: false });
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setIsDarkTheme(event.matches);
      });

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", changeColorTheme);
    };
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      import("intro.js/themes/introjs-dark.css");
    }
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider
      value={{ isDarkTheme, setIsDarkTheme, changeColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
