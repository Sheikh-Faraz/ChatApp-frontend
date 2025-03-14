'use server'; 

import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface MessageProps {
  receiverId: string;
  formData: FormData;
}

// Server-side function to send a message
export async function sendMessage({ receiverId, formData }: MessageProps) {
  const message = formData.get('message')?.toString();
  // Getting the secondary id and making it a string
  const secondaryId = formData.get('secondaryId')?.toString();
  // console.log('THIS IS THE SECONDARY ID AT THE TIME OF MAKING THE MESSAGE IN THE DATABASE: ' + secondaryId);

  if (!message) {
    throw Error('Message cannot be empty');
  }

  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id; // Get current signed-in user's ID

  if (!senderId || !receiverId || !secondaryId) {
    throw Error('Invalid user details');
  }

  // Create the message in the database
  await prisma.chatMessage.create({
    data: { message, senderId, receiverId, secondaryId },
  });

}
