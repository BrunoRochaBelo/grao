import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "./index.css";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

const container = document.getElementById("root");

if (container) {
  createRoot(container).render(<App />);
}
