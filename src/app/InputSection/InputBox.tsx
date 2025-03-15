'use client';

import { sendMessage } from '@/lib/actions/sendMessage';
import Image from 'next/image';
import Sendbtn from '@/app/assets/Paper Plane Send Icon.png';

// sokect.io code
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

interface InputBoxProps {
  receiverId: string;
  session: any;
}

export default function InputBox({ receiverId, session }: InputBoxProps) {
  const senderId = session.user.id;
  // Code for socket
  const [socket, setSocket] = useState<any>(undefined);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // const socket = io('http://localhost:3000');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      transports: ["websocket", "polling"], // Ensure compatibility
    });
    
    setSocket(socket);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Generating a secondary id
    const secondaryId = crypto.randomUUID();

    // OLD CODE
    if (socket && message.trim()) {
      // Trigger Socket event
      socket.emit('message', {
        message: message,
        secondaryId: secondaryId,
        senderId: session.user.id,
        receiverId: receiverId,
        createdAt: new Date().toISOString(),
      });
    }

    // Send the message to the database
    try {
      const formData = new FormData();
      formData.append('message', message);
      // Giving the secondary id to sendMessage to create message with the secondary id
      formData.append('secondaryId', secondaryId);

      sendMessage({
        receiverId,
        formData,
      });

      // Clear the input field after sending the message
      setMessage('');
    } catch (error) {
      console.error('Failed to send the message:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#020024]">
      {/* This is used to send data to (sendMessage) component to create a message */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full items-center justify-center text-center"
      >
        {/* Used to write the message in it */}
        <input
          value={message} // Bind the input value to the message state
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
          required
          name="message"
          id="message"
          className="md:input md:bg-[#1a1036] input-sm w-full my-2 ml-1 border border-slate-900 bg-[#1a1036] text-white hover:bg-[#2f2c66]"
          placeholder="Type your message..."
        />

        {/* Used to send the message */}
        <button
          className="btn btn-circle btn-ghost mx-1 hover:bg-[#2f2c66]"
          onClick={handleSendMessage}
        >
          <Image src={Sendbtn.src} width={20} height={20} alt="sendbtn image" />
        </button>
      </form>
    </div>
  );
}
