import { atom } from "jotai";

export const searchResultsAtom = atom<any[]>([]); // Stores the fetched users
export const loadingAtom = atom(false); // Loading indicator
export const errorAtom = atom(""); // Error message

// Atom to toggle between true and false
export const userListUpdateAtom = atom(false);

// Testing and setting for messages
export const allOfMessages = atom <any []>([]);