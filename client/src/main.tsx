import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { KeychainProvider } from "./context/KeychainContext";

createRoot(document.getElementById("root")!).render(
  <KeychainProvider>
    <App />
  </KeychainProvider>
);
