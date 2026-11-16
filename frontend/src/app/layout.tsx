import type { Metadata, Viewport } from "next";
import { THEME } from "@/theme/config";
import { fontVariables } from "@/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantum Secret Sharing",
  description: "N-party quantum secret sharing with GHZ states: a step-by-step tour.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

/* Applies the saved light/dark choice before paint so there is no flash. */
const themeScript = `try{var t=localStorage.getItem("qss-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-look={THEME} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
