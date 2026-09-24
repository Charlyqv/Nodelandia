import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nodelandia - Admin',
  description: 'Panel de control y telemetría',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}