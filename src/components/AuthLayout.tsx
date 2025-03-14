'use client';

import { useSession,signIn } from 'next-auth/react';

import { ReactNode, useEffect } from 'react';
interface AuthLayoutProps {
    children: ReactNode;
  }
  export default function AuthLayout({ children }: AuthLayoutProps) {
    const { data: session, status } = useSession(); // Get session info
    
    useEffect(() => {
      if(status === 'unauthenticated'){
        signIn();
      }
    },[status])
    
    // if (!session) 
    // return (signIn());
  if(status === 'loading') {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white bg-opacity-100">
        <span className="loading loading-dots loading-lg m-auto block" />
      </div>
    )
  }
  if (status === 'authenticated') {
      return <>{children}</>; // Render the child components if authenticated
    // return <p>Loading...</p>; // Show while checking the session
  }
  // return null; // Prevent rendering if unauthenticated
  return(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white bg-opacity-100">
      <span className="loading loading-dots loading-lg m-auto block" />
    </div>
)
}