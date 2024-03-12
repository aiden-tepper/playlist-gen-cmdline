import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SpeedInsights />
    <Analytics />
    <NextUIProvider>
      <div className="w-screen h-screen p-8 items-start justify-center box-border overflow-hidden">
        <App />
      </div>
    </NextUIProvider>
  </React.StrictMode>
);
