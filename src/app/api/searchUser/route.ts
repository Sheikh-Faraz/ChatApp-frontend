import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { info, user } = body; // Extract user input from the request body.

    // GET THE USER LOGGED IN USER-1
    const UserLoggedIn = await prisma.user.findUnique({
      where: { id: user },
    });

    if (!UserLoggedIn) {
      // throw new Error('User not found');
      return NextResponse.json({
        success: false,
        message: 'Contact already exists',
      });
    }

    //   SEARCHING THE USER FORM THE MODEL OR SEARCH AND ADD SPECIFIC USER-2
    const FindSearchedUser = await prisma.user.findUnique({
      where: { email: info },
    });

    if (!FindSearchedUser) {
      // throw new Error('User to add not found.');
      return NextResponse.json({
        success: false,
        message: 'User not found',
      });
    }

    // Ensure no duplicate contact entries
    const existingContact = await prisma.userContact.findFirst({
      where: { userId: UserLoggedIn.id, contactId: FindSearchedUser.id },
    });

    if (existingContact) {
      // Telling if the user already exists
      return NextResponse.json({
        success: false,
        message: 'Contact already exists',
      });
    }

    // Create bi-directional contact relationship - User 1 -> User 2 and User 2 -> User 1
    await prisma.$transaction([
      prisma.userContact.create({
        data: { userId: UserLoggedIn.id, contactId: FindSearchedUser.id },
      }),
      prisma.userContact.create({
        data: { userId: FindSearchedUser.id, contactId: UserLoggedIn.id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error', error },
      { status: 500 }
    );
  }
}
