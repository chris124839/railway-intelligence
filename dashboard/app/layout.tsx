import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indian Railways — Train Punctuality Dashboard",
  description: "Live and historical railway punctuality intelligence"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
