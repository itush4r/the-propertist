import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Propertist — Find Your Perfect Home',
  description: 'Browse thousands of properties across India. Buy or rent with confidence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollbarGutter: 'stable' }}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
