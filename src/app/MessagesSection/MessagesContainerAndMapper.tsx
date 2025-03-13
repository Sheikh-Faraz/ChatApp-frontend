import prisma from '@/lib/db/prisma';
import MessageContain from '../ChatContainer/[id]/Messages';

// Gets the props from (page) in the ChatContainer folder
interface MessageProps {
  recieverContact: any;
  session: any;
}

export default async function Messages({
  recieverContact,
  session,
}: MessageProps) {
  'use server';

  const signedInUserId = session?.user.id;
  const receiverId = recieverContact?.id; // ID of the clicked user

  if (!signedInUserId || !receiverId) {
    return <div>No messages available.</div>;
  }
  const chatMessages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: signedInUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: signedInUserId },
      ],
    },
    orderBy: {
      createdAt: 'asc', // Order by message creation time
    },
  });

  // Convert `createdAt` to string for serialization
  const serializedMessages = chatMessages.map((message) => ({
    ...message,
    createdAt: message.createdAt.toISOString(),
  }));
  // Used as a mapper to display the messages between the two users
  return (
    <div>
      {/* Maps the message */}
      <MessageContain
        session={session}
        contact={recieverContact}
        chat={serializedMessages}
      />
    </div>
  );
}
