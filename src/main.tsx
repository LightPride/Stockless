import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Lightweight data migration to ensure Alice's updated avatar is visible
(() => {
  try {
    const raw = localStorage.getItem("stockless_creators");
    if (!raw) return;
    const creators = JSON.parse(raw);
    let changed = false;
    for (const c of creators) {
      if (c?.id === "creator1") {
        const needsUpdate = !c.avatar || c.avatar.startsWith("file:") || c.avatar.includes("/src/assets/");
        if (needsUpdate || c.avatar !== "/alice-avatar.jpg") {
          c.avatar = "/alice-avatar.jpg";
          changed = true;
        }
      }
    }
    if (changed) localStorage.setItem("stockless_creators", JSON.stringify(creators));
  } catch (e) {
    // no-op
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
