"use client";
import Image from 'next/image';
import pic from '@/app/assets/whiteDeleteIcon.png';


import { deleteMessage } from '@/lib/actions/deleteMessage';

interface DeleteButtonProps {
  messageId: string;
  secondaryId: string;
  person: string ;
  deleteMessage: (id: string, person: string, secondaryId: string) => Promise<void>; // The server-side action
}

export default function DeleteButton({ messageId, deleteMessage, person, secondaryId }: DeleteButtonProps) {

  async function handleDelete() {
    // Call the deleteMessage server-side action
    await deleteMessage(messageId, person, secondaryId);
  }
  return (
    <button 
    onClick={handleDelete} 
    className="rounded-full btn-ghost hover:bg-[#2f2c66] tooltip tooltip-right"
    data-tip="Delete message"
    >
      <Image
          src={pic.src}
          alt="img"
          width={15}
          height={15}
          className="rounded-full"
        /> 
    </button>
  );
}
