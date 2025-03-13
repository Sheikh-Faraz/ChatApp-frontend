import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import Footer from './Footer';
import SessionProvider from './SessionProvider';
// import { signIn, signOut, useSession } from "next-auth/react";
import SideBar from './Drawer-Sidebar/sidebar';
import AuthLayout from '@/components/AuthLayout'

// TOAST NOTIFICATIONS
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

// THIS IS THE PROVIDER FROM OR FOR JATOI
import { Provider } from 'jotai';
import MobileLayout from './Drawer-Sidebar/MobileLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkUp',
  description: 'Chat with friends and family!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Detect if the current route is public
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = typeof window !== 'undefined' && publicRoutes.includes(window.location.pathname);

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SessionProvider>
          {isPublicRoute ? (
            children /* Render children directly for public routes */
          ) : (
            <AuthLayout>
              <Provider>
                <main className="flex">
                  <div>
                  <SideBar />
                  </div>
                  {children}
                  {/* Toast Container */}
                  <ToastContainer position="top-center" />
                </main>
              </Provider>
            </AuthLayout>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
