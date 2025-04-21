import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import the Buffer shim before any other code that might need it
import "./lib/buffer-shim";

createRoot(document.getElementById("root")!).render(
  <App />
);
