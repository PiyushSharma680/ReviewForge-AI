import './globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'ReviewForge AI | Enterprise AI Code Review Platform',
  description: 'AI-Powered Code Review Platform with GitHub Integration, Security Scanner, Code Metrics, and AI Assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-gray-100 min-h-screen antialiased selection:bg-purple-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
