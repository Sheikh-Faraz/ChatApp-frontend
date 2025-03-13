'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from '@headlessui/react';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
// Importing and using the icon from lucide react
import { UserRoundPlus } from 'lucide-react';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// To import jatoi and the send the corresponding results to ShowSearchedUser
import { useSetAtom } from 'jotai';
import { errorAtom, userListUpdateAtom, loadingAtom } from '../../lib/atoms';

// Using Toast to show notifications
import { toast } from 'react-toastify';

// Getting session from sidebar
interface AddUserBtnProps {
  session: any;
}

export default function AddUserBtn({session}: AddUserBtnProps) {
  // SETTING THE OPENING AND CLOSING OF THE MODAL
  const [open, setOpen] = useState(false);

  // JATOI THINGS FROM THE LIB
  const setLoading = useSetAtom(loadingAtom);
  // SETTING TO SHOW ERROR
  const setError = useSetAtom(errorAtom);
  // TO UPDATE THE STATE AND MAKE IT RE RENDER WHEN A USER IS ADDED
  const setUserListUpdateAtom = useSetAtom(userListUpdateAtom);

  // SETTING AND CHANGING THE INFO FROM THE INPUT
  const [info, setInfo] = useState('');

  // GETTING THE SIGNED IN USER VIA SESSION AND GIVING IT TO BACKEND
  const user = session.user.id;

  // TO SEND THE DATA TO BACKEND OR IN API SO THE USER CAN BE SEARCHED IN DATABASE
  const handleUserInfoBackend = async (info: string) => {
    setError(''); // Reset error
    try {
      const response = await fetch('/api/searchUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ info, user }),
      });

      if (!response.ok) {
        return toast.error(
          `An Error Occured: ${response.status}`
        );
      }

      //RECIEVING THE DATA AFTER SENDING IT TO API OR BACKEND
      const data = await response.json();
      // IF the user is already added tell the user
      if (!data.success) {
        return toast.error(
          data.message
        );
      }

      if (data.success) {
        setLoading(true); // Stop loading
        setUserListUpdateAtom((prev) => !prev); // Notify sidebar to re-fetch
      } else {
        setError(data.message || 'Failed to fetch users.');
      }
    } catch (error) {
      return toast.error(
        `Something went wrong: ${error}`
      );
    }
  };

  return (
    <>
      {/* THE BTN TO OPEN MODEL*/}
      <button
        type="button"
        data-autofocus
        className="btn border-none mt-2 bg-[#1a1036] text-white hover:bg-[#2f2c66] flex items-center tooltip md:tooltip-hidden"
        data-tip="Add a friend"
        onClick={() => setOpen(true)}
      >
        <UserRoundPlus />
        <div className="hidden md:block">
          Add Friend
        </div>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-center">
                  {/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                  </div> */}
                  {/* sm:mt-0 sm:ml-4 sm:text-left */}
                  <div className="mt-3 items-center text-center">
                    <DialogTitle
                      as="h3"
                      className="text-base font-bold text-gray-900"
                    >
                      Add a friend 
                    </DialogTitle>
                    <div className="mt-2">
                      <input
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        type="text"
                        name="info"
                        placeholder="Enter user Email only"
                        className="rounded-lg border-2 border-black p-2 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleUserInfoBackend(info);
                  }}
                  className="shadow-xs inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Add user to contacts
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="shadow-xs mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
