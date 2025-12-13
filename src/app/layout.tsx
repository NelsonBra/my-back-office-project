import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from '@/components/ToastProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
          <ToastProvider />
        <ThemeProvider>
          
          <SidebarProvider>
            {children}
           
          </SidebarProvider>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
