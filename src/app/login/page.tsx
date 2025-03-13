// pages/login.js
// "use client"
// import { signIn } from 'next-auth/react';

export default function Login() {
    console.log("Login page working if you are seeing this");
  return (
    <div className="bg-[#1a1036] text-red-600 border-none w-[48%]">
      <h1 className='border-2 border-green-600 text-blue-500'>Login and this should show something</h1>
      {/* <button onClick={() => signIn('google')}>Sign in with Google</button> */}
      {/* <button onClick={() => signIn()}>Sign In</button> */}
    </div>
  );
}
