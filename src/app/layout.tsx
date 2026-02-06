import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "@/components/visuals/aurora-bg";
import { SmoothScrollProvider } from "@/providers/smooth-scroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "AstraLearn | The Omni-Tutor",
  description: "Multimodal AI Education Platform powered by the Council",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#050505]`}>
        <SmoothScrollProvider>
          <AuroraBackground>
            <div className="relative z-10 w-full h-full overflow-y-auto">
              {children}
            </div>
          </AuroraBackground>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
