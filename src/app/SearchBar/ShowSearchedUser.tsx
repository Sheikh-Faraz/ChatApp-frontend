'use client';

// JATOI THINGS
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai';
import { loadingAtom, userListUpdateAtom } from '../../lib/atoms';
import { useEffect, useState } from 'react';
import NewContact from './NewConatact';
// Using Toast to show notifications
import { toast } from 'react-toastify';

interface ShowSearchedUserProps {
  session: any;
  uniqueContacts: any[]; // Array of unique contact objects
}
export default function ShowSearchedUser({session, uniqueContacts}: ShowSearchedUserProps) {
  // GETTING THE SIGNED IN USER VIA SESSION AND GIVING IT TO BACKEND
  const signedInUser = session.user.id;

  // Using jatoi to change the loading status
  const [loading] = useAtom(loadingAtom); // Loading status
  const setLoading = useSetAtom(loadingAtom);

  // Using jatoi to re render when a user is added
  const [userListUpdate] = useAtom(userListUpdateAtom); // Listen for updates
  // FOR THE DATA RECIEVED FROM THE BACKEND
  const [backendResults, setBackendResults] = useState<any[]>([]);
  const [newError, setNewError] = useState('');
  
  // TO SEND THE DATA TO BACKEND OR IN API SO THE USER CAN BE SEARCHED IN DATABASE
  const handleUserInfoBackend = async () => {
    setNewError(''); // Reset error
    try {
      const response = await fetch('/api/getAddedUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signedInUser }),
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        return toast.error(
                `Something went wrong: ${response.status}`
        );
        
      }

      //RECIEVING THE DATA AFTER SENDING IT TO API OR BACKEND
      const data = await response.json();

      if (response.ok) {
        setBackendResults(data); // Update search results
      } else {
        setNewError(data.message || 'Failed to fetch users.');
      }
    } catch (error) {
      console.log(error)
    } finally {
      // SETTING THE LOADING
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    handleUserInfoBackend();
  }, [userListUpdate]);

  // Filter out users already in uniqueContacts
  const filteredResults = backendResults.filter(
    (user) => !uniqueContacts.some((contact) => contact.id === user.id)
  );

  return (
    <div className="font-bold text-white">
      {/* Show loading */}
      {loading && (<span className="loading loading-spinner loading-md m-auto block" />)}
      {/* Show error */}
      {newError && <p className="text-red-500">{newError}</p>}
      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((user) => (
            <NewContact key={user.id} user={user} signedInUser={signedInUser}/>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
