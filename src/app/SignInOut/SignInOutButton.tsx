"use client";

import profilePicPlaceholder from "@/app/assets/profile-pic-placeholder.png";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
// Log out icon from react lucide
import { LogOut } from 'lucide-react';
// This file is used to Sign In and Sign Out the user

export default function SignInOutBtn () {
    const { data: session } = useSession();
  const user = session?.user;

  return (
          <button 
            onClick={() => signOut({ callbackUrl: "/" })} 
            className='flex items-center tooltip btn bg-[#1a1036] hover:bg-[#2f2c66] text-white border-none'
            data-tip="Sign Out"
            >
            <LogOut />
            <div className="hidden md:block">
               Sign Out
            </div>
          </button>
    
  );
}