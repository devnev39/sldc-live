import { createContext, useEffect, useState } from "react";
import { Chart } from "chart.js";
import { each } from "chart.js/helpers";

export const ThemeContext = createContext(false);

const chartJsDarkColor = "#FFFFFFD9";
const chartJsDarkBorderColor = "#FFFFFF40";

const chartJsLightColor = "#666";
const chartJsLightBorderColor = "#00000040";

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
      Chart.defaults.color = chartJsDarkColor;
    } else {
      setIsDarkTheme(false);
      Chart.defaults.color = chartJsLightColor;
    }
    each(Chart.instances, (i) => {
      for (let scale in i.config.options.scales) {
        i.config.options.scales[scale].grid.color = event.matches
          ? chartJsDarkBorderColor
          : chartJsLightBorderColor;
        i.config.options.scales[scale].grid.color = event.matches
          ? chartJsDarkBorderColor
          : chartJsLightBorderColor;

        i.config.options.scales[scale].grid.borderColor = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
        i.config.options.scales[scale].grid.borderColor = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;

        // Update axes label font color
        i.config.options.scales[scale].ticks.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
        i.config.options.scales[scale].ticks.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;

        i.config.options.scales[scale].title.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
      }
      i.update();
    });
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

  return (
    <ThemeContext.Provider
      value={{ isDarkTheme, setIsDarkTheme, changeColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
