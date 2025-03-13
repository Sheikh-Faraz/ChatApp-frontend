import prisma from '@/lib/db/prisma';
import Contacts from './Contacts';
import ShowSearchedUser from '../SearchBar/ShowSearchedUser';
// import ClientContactMapper from './ClientContactMapper';

interface ContactMapperProps {
  session: any;
}
export default async function ContactsMaper({ session }: ContactMapperProps) {
  'use server';
  const contacts = await prisma.user.findMany();

  // GET THE USER LOGGED IN USER-1
  const UserLoggedIn = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  return (
    <div>
      {uniqueContacts.map((user) => (
        <Contacts key={user.id} user={user} session={session} />
      ))}
      {/* <ClientContactMapper uniqueContacts={uniqueContacts}/> */}
      <div>
        <ShowSearchedUser session={session} uniqueContacts={uniqueContacts} />
      </div>
    </div>
  );
}
