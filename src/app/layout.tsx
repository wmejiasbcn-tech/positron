import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Segundo Cerebro Positronico WAIPL',
  description: 'Centro de mando interactivo del Soberano William L. Mejias Navarro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
