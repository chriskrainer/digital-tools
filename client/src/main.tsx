import { installWafSafeFetch } from "./lib/wafSafeFetch";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

installWafSafeFetch();

createRoot(document.getElementById("root")!).render(<App />);
