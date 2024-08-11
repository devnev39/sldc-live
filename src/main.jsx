import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { Chart, registerables } from "chart.js";
import "./index.css";
import { NavbarContextProvider } from "./context/navbarContext.jsx";
import { ThemeContextProvider } from "./context/themeContext.jsx";
import { injectSpeedInsights } from "@vercel/speed-insights";
injectSpeedInsights();
Chart.register(...registerables);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
        <NavbarContextProvider>
          <App />
        </NavbarContextProvider>
      </ThemeContextProvider>
    </Provider>
  </React.StrictMode>,
);
