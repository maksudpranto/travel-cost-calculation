// File: app/layout.tsx
import './globals.css';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'Trip Cost Manager',
  description: 'Manage travel expenses easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}