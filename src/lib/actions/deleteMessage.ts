'use server';
import prisma from '@/lib/db/prisma';
export async function deleteMessage(
  id: string,
  secondaryId: string
) {
  await prisma.chatMessage.deleteMany({
    where: { secondaryId },
  });
}
