import { cache } from 'react';
import InputBox from '../../InputSection/InputBox';
import Messages from '../../MessagesSection/MessagesContainerAndMapper';
import TopProfileSection from '../../MessagesSection/TopProfileSection';
import prisma from '@/lib/db/prisma';
import ChatBackground from '@/app/assets/ChatBG.png';

// To get session
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

// Gets the ID of the user cliked to chat with from the url params
interface ChatContainerProps {
  params: {
    id: string;
  };
}

// Using the ID from the params to find/check the user from the database
const getContact = cache(async (id: string) => {
  const contact = await prisma.user.findUnique({ where: { id } });
  if (!contact) {
    console.log('This is thing does not exist or found Faraz');
  }
  return contact;
});

// Check for the user in the sidebar / usercontact database
const getUserContact = cache(async (userId: string, currentUserId: string) => {
  // Check if the relationship exists or if both users exist
  const contact = await prisma.userContact.findFirst({
    where: {
      userId: currentUserId,
      contactId: userId,
    },
  });

  if (!contact) {
    console.log('No relationship found or user does not exist');
    redirect('/'); // Redirect to the homepage if the contact does not exist
  }

  return contact;
});

// Pass the ID of the user clicked and given to each of the component below to extract the information and display it
export default async function ChatContain({
  params: { id },
}: ChatContainerProps) {
  // For session to be passed into input then to backend socket
  const session = await getServerSession(authOptions);

  // CHECKS IF THE USER IS LOGGED IN
  if (!session) {
    redirect('/login'); // Redirect to the homepage if the session is null
    return null;
  }
  const loggedInUser = session.user.id;
  const userContact = await getUserContact(id, loggedInUser);
  // I think the data of the user clicked from the database
  const chat = await getContact(id);

  const selecteduserid = chat?.id;

  if (!chat) {
    return <div>User not found</div>;
  }

  const receiverId = id;

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Top section that contains the user to chat with  */}
      <div className="sticky top-0 z-40">
        <TopProfileSection chat={chat} session={session} />
      </div>

      {/* The messages between the two users */}
      <div
        className="scroll flex-1 space-y-2 overflow-y-auto bg-[#161429] p-4 scrollbar-thin scrollbar-track-[#161429] scrollbar-thumb-[#2f2c66]"
        // style={{
        //   backgroundImage: `url(${ChatBackground.src})`, p-4
        //   backgroundSize: '15%',
        //   backgroundPosition: 'center',
        // }}
      >
        <Messages recieverContact={chat} session={session} />
        {/* <Messages recieverContact={selecteduserid} session={session}/> */}
      </div>

      {/* Input section used to write and send message */}
      <div className="sticky bottom-0 z-50">
        <InputBox receiverId={receiverId} session={session} />
      </div>
    </div>
  );
}
