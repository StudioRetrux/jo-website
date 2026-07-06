import type { Metadata } from "next";
import Cursor from "./Cursor";
import { CursorProvider } from "./contexts/CursorContext";
import { SectionProvider } from "./contexts/SectionContext";
import { PageNavProvider } from "./contexts/PageNavContext";
import { Albert_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  subsets: ["latin"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Johannes Alexander",
  description: "Cinematic creative portfolio and project archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${albertSans.variable} ${geistMono.variable}`}
    >
      <body>
        <CursorProvider>
          <SectionProvider>
            <PageNavProvider>
              <Cursor />
              {children}
            </PageNavProvider>
          </SectionProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
