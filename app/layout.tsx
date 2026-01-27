// File: app/layout.tsx
import './globals.css';
import { AgentModeProvider } from './context/AgentModeContext';

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
      <body className="antialiased" suppressHydrationWarning={true}>
        <AgentModeProvider>
          {children}
        </AgentModeProvider>
      </body>
    </html>
  );
}