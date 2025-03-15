'use client';
import { User } from '@prisma/client';
import Image from 'next/image';
import pic from '@/app/assets/profile-pic-placeholder.png';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface ContactProps {
  user: User;
  session: any;
}

// This file is used to display the contacts in the sidebar and get the user id

export default function Contacts({ user, session }: ContactProps) {
  const [allChatMessages, setAllChatMessages] = useState<{ message: string; secondaryId: string }[]>([]);
  const [socket, setSocket] = useState<any>(undefined);

  useEffect(() => {
    // const socket = io('http://localhost:3000');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      transports: ["websocket", "polling"], // Ensure compatibility
    });
    // Listen for new messages
    const handleMessage = (messages: {
      senderId: string;
      secondaryId: string;
      message: string;
      receiverId: string;
    }) => {
      // Checks if the message is only between the sender and receiver contact then show the message
      if (
        (messages.senderId === user.id &&
          messages.receiverId === session.user.id) ||
        (messages.senderId === session.user.id &&
          messages.receiverId === user.id)
      ) {
        setAllChatMessages((prevMessages) => [
          ...prevMessages,
          { message: messages.message, secondaryId: messages.secondaryId },
        ]);
      }
    };

    socket.on('message', handleMessage);

    socket.on('deleteMessage', (secondaryId: string) => {
      setAllChatMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.secondaryId !== secondaryId)
      );
    });

    setSocket(socket);

    return () => {
      socket.off('message', handleMessage);
      socket.disconnect();
    };
  }, [user.id, session.user.id]);

  // Get the latest message to display
  const latestChatMessage = allChatMessages[allChatMessages.length - 1];

  return (
    <a 
    href={`/ChatContainer/${user.id}`} 
    className="cursor-pointer"
    >
      <div className="m-0 md:m-2 flex items-center rounded-lg p-2 text-center text-white hover:bg-[#2f2c66]"
      >
        <Image
          src={user.image || pic.src}
          alt="image"
          width={50}
          height={50}
          className="mr-3 rounded-full"
        />
        <div className="flex flex-col text-left">
          <div className="font-family: 'Roboto Condensed', sans-serif; font-bold hidden md:block">
            {user.name}
          </div>
          <div className="max-w-[160px] truncate text-xs opacity-50 hidden md:block">
            {/* Display the message or fallback text */}
            {latestChatMessage?.message || ''}
          </div>
        </div>
      </div>
    </a>
  );
}
