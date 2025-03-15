import Image from 'next/image';
import pic from '@/app/assets/profile-pic-placeholder.png';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../api/auth/[...nextauth]/route';
import { authOptions } from '@/lib/auth';

import UserMenuButton from '../SignInOut/SignInOutButton';
import ContactsMaper from './ContactsMaper';
import AddUserBtn from '@/app/SearchBar/AddUserBtn';
// import ShowSearchedUser from '../SearchBar/ShowSearchedUser';
import { redirect } from 'next/navigation';

export default async function SideBar() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/'); // Redirect to the homepage if the session is null
    return null;
  }
  return (
    <div className="sticky top-0 flex h-screen w-fit md:min-w-[17rem] flex-col border-r border-[#01001A] bg-[#020024]">
      {/* Contains the information about the user signed in on top left corner*/}
      <div className="z-50 m-2 flex justify-center items-center rounded-lg bg-transparent md:bg-[#1a1036] text-center font-bold text-white md:w-fit md:m-3 md:p-3">
        <Image
          src={session?.user.image || pic.src}
          alt="Profile Pic"
          width={50}
          height={50}
          className="mr-0 rounded-full md:mr-3"
        />
        <div className="hidden md:block">
        {session?.user.name || 'User not signed in'}
        </div>
      </div>

      {/* Search user section & Add user btn */}
      <div className="m-1 flex flex-col justify-center text-center md:m-3">
        <UserMenuButton />
        <AddUserBtn session={session} />
      </div>

      {/* The list below contains all the contacts, it's maps/distributes all the contact  */}
      {/* <ul className="scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-600 w-full mt-3 items-center justify-center overflow-y-auto text-center">
        <ShowSearchedUser session={session} />
        overflow-y-auto
      </ul> */}

      {/* Checking for the searched and added user from modal*/}
      <div className="m-0 p-1 scrollbar-thin scrollbar-thumb-[#1a1036] scrollbar-track-[#020024] scroll overflow-y-auto md:m-1">
        <ContactsMaper session={session} />
      </div>
    </div>
  );
}
