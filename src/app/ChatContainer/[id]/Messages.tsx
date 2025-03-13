'use client';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { deleteMessage } from '@/lib/actions/deleteMessage';
import DeleteButton from '@/components/DeleteButton';
// Using socket to get messages in instant
import { io } from 'socket.io-client';

// Fetches the messages from the database and is used in Messages to map them out and display them
interface Chat {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  secondaryId: string | null;
}
interface MessageProps {
  chat: Chat[];
  contact: any;
  // TO GET THE SESSION
  session: any;
}

export default function MessageContain({
  chat,
  contact,
  session,
}: MessageProps) {
  // using state for message and to remove a particular message on delete
  const [allChatMessages, setAllChatMessages] = useState<Chat[]>(chat); // Manage chat state
  const signedInUserId = session?.user?.id;
  const receiverId = contact?.id; // ID of the clicked user
  // Used to scroll to the end of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Code for socketf
  const [socket, setSocket] = useState<any>(undefined);

  const defaultImageUrl =
    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  useEffect(() => {
    //   Used to scroll to the new message in the end
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChatMessages]);

  useEffect(() => {
    // const socket = io('http://localhost:3000');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

    const handleMessage = (messages: {
      senderId: string;
      receiverId: string;
      createdAt: string;
      message: string;
      secondaryId: string;
    }) => {
      // Checks if the message is only between the sender and receiver contact then show the message
      if (
        (messages.senderId === receiverId &&
          messages.receiverId === signedInUserId) ||
        (messages.senderId === signedInUserId &&
          messages.receiverId === receiverId)
      ) {
        setAllChatMessages((prevMessages: any) => [...prevMessages, messages]);
      }
    };

    socket.on('message', handleMessage);

    setSocket(socket);

    return () => {
      socket.off('message', handleMessage);
      socket.disconnect();
    };
  }, [receiverId, signedInUserId]);

  // using this function to remove particular message on ui
  const handleDeleteMessage = (secondaryId: string) => {
    socket.emit('deleteMessage', {
      secondaryId: secondaryId,
    });
    setAllChatMessages((prevChat) =>
      prevChat.filter((message) => message.secondaryId !== secondaryId)
    ); // Update chat state
  };

  return (
    <div>
      {allChatMessages.length === 0 && (
        <div className="items-center justify-center text-center font-bold text-white">
          Start a conversation! There are no messages between you and this user
          yet.
        </div>
      )}
      {allChatMessages.map((message) => {
        const isSender = message.senderId === signedInUserId;
        const timing = new Date(message.createdAt).toLocaleTimeString();
        const uniqueKey = message.id || message.secondaryId;
        return (
          <div
            className={`chat overflow-x-hidden my-3 ${isSender ? 'chat-start' : 'chat-end'}`}
            key={uniqueKey}
            ref={messagesEndRef}
          >
            <div className="avatar chat-image">
              <div className="w-10 rounded-full">
                <Image
                  alt="User's Avatar"
                  src={
                    isSender
                      ? (session?.user.image ?? defaultImageUrl)
                      : (contact?.image ?? defaultImageUrl)
                  }
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="chat-header mb-1 flex">
              {/* <div className="m-1">
          {isSender ? session?.user.name : contact?.name}
        </div> */}
              <time className="mx-1 text-xs text-white opacity-50">
                {timing}
              </time>

              {/* ON CLICK REMOVES THE MESSAGE FROM ARRAY TO SEEM LIKE REALTIME IN UI */}
              <div
                className="ml-4 text-xs"
                onClick={() =>
                  handleDeleteMessage(
                    message.secondaryId ?? 'something went wrong'
                  )
                }
              >
                {session?.user?.id === message.senderId && (
                  <DeleteButton
                    messageId={message.id}
                    secondaryId={message.secondaryId ?? ''}
                    deleteMessage={deleteMessage}
                    person={contact?.id ?? ''}
                  />
                )}
              </div>
            </div>

            {/* Contains the messages */}
            <div className="flex-column chat-bubble bg-[#020024]">
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
      ;
    </div>
  );
}
