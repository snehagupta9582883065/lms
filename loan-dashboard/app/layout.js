import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './Provider'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Loan Management Dashboard',
  description: 'Mini Loan Management Dashboard built with Next.js and Redux.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider> 
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}