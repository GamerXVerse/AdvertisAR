import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdvertisAR · Campaign Studio",
  description: "Create, refine, and publish marketing campaigns from one workspace.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
