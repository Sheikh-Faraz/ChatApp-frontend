'use client';
import pic from '@/app/assets/profile-pic-placeholder.png';
import Image from 'next/image';
import { User } from '@prisma/client';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

interface TopProfileSectionProps {
  chat: User | null;
  session: any;
}

let socket: Socket | null = null;

export default function TopProfileSection({
  chat,
  session,
}: TopProfileSectionProps) {
  const [online, setOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      // Initialize the socket connection only once
      // socket = io('http://localhost:3000');
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        transports: ["websocket", "polling"], // Ensure compatibility
      });
      

      // Listen for updates to the list of online users
      socket.on('update_online_users', (onlineUsers) => {

        // Check if the current user is online
        if (session.user.id && onlineUsers.includes(chat?.id)) {
          setOnline(true);
          setLastSeen(null); // Clear last seen when online
        } else {
          setOnline(false);
        }
      });

      // Listen for last seen updates
      socket.on('user_last_seen', ({ userId, lastSeen }) => {
        if (chat?.id === userId) {
          setOnline(false);
          setLastSeen(lastSeen);
        }
      });
    }

    // Emit the current user's ID
    if (session.user.id) {
      socket.emit('user_connected', { userId: session.user.id });
    }

    return () => {
      // Clean up the socket connection on component unmount
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [chat?.id, session?.user.id]);

  // Format last seen time
  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="z-50 flex bg-[#020024] p-3 md:p-5 text-white">
      <Image
        src={chat?.image || pic.src}
        alt="img"
        width={40}
        height={40}
        className="mx-2 md:mx-3 rounded-full"
      />
      <div>
        <p className="font-bold">{chat?.name || 'Error'}</p>
        <p className="text-sm text-white opacity-70">
          {online
            ? '🟢 Online'
            : lastSeen
              ? `Last seen ${formatLastSeen(lastSeen)}`
              : '🔴 Offline'}
        </p>
      </div>
    </div>
  );
}
