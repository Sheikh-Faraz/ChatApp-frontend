import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { signedInUser } = body; // Extract user input from the request body.

    // GET THE USER LOGGED IN USER-1
    const UserLoggedIn = await prisma.user.findUnique({
      where: { id: signedInUser },
    });

    if (!UserLoggedIn) {
      throw new Error('User not found');
    }
   
    // FETCH USERS ADDED BY THE LOGGED-IN USER
    const usersAddedByMe = await prisma.userContact.findMany({
        where: { userId: UserLoggedIn.id },
        include: { contact: true },
      });
  
      // FETCH USERS WHO HAVE ADDED THE LOGGED-IN USER
      const usersWhoAddedMe = await prisma.userContact.findMany({
        where: { contactId: UserLoggedIn.id },
        include: { user: true },
      });
  
      // COMBINE BOTH LISTS (USERS ADDED BY ME + USERS WHO ADDED ME)
      const allContacts = [
        ...usersAddedByMe.map((relation) => relation.contact),
        ...usersWhoAddedMe.map((relation) => relation.user),
      ];
  
      // REMOVE DUPLICATES BASED ON USER ID
      const uniqueContacts = Array.from(
        new Map(allContacts.map((user) => [user.id, user])).values()
      );
  
      // RETURN UNIQUE CONTACTS TO THE FRONTEND
      return NextResponse.json(uniqueContacts);

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error', error },
      { status: 500 }
    );
  }
}
