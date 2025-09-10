import { Ubuntu } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner";

const ubuntu = Ubuntu({
  subsets: ['latin'],
  variable: "--font-ubu",
  weight: ["300", "400", "500", "700"],
});
export const metadata = {
  title: "Suraksha Kawach – AI-Powered Emergency Safety App by Panthar InfoHub",
  description:
      "Suraksha Kawach is an AI-driven safety application developed by Panthar InfoHub, offering real-time SOS alerts, voice-activated emergency responses, offline functionality, and community-based safety insights to ensure personal and family security.",
  keywords: [
    "Suraksha Kawach",
    "Panthar InfoHub",
    "AI safety app",
    "real-time SOS alerts",
    "voice-activated emergency response",
    "offline safety app",
    "community safety alerts",
    "personal safety technology",
    "emergency response app",
    "women safety app India",
    "family safety monitoring",
    "guardian network app",
    "safety analytics",
    "location-based alerts",
    "Jhansi tech solutions",
    "Panthar InfoHub safety app",
    "Suraksha Kawach features",
    "emergency preparedness app",
    "AI-driven safety solutions",
    "digital safety tools"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased m-0 p-0 box-border ${ubuntu.className} `}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
