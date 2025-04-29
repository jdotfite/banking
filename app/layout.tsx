// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google'; // Changed from @next/font to next/font
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import AppContainer from '@/components/layout/AppContainer';

// Properly load and configure the Outfit font
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Credit Card App',
  description: 'A modern credit card app UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} bg-gray-900 min-h-screen font-outfit`}>
        <ThemeProvider>
          <AppContainer>{children}</AppContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}