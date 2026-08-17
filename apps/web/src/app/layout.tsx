import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'getPersona.md',
  description: 'Personas you can register, sync, and write with.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
