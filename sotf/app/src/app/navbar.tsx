"use client";
import { useSession } from "next-auth/react";
import LogIn from "./log-in-button";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    // <div className="flex justify-between items-center p-4 border-solid border-2 border-gray-800">
    <div className="flex flex-row justify-between items-center p-4 border-solid border-2 border-gray-800">
      <div className="basis-4/12 text-2xl font-bold">
        <button
          className="text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Survival of the Fittest
        </button>
      </div>
      <div className="basis-4/12 flex justify-center">
        {session && (
          <button
            className="text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              window.location.href = "/playlists";
            }}
          >
            Playlists
          </button>
        )}
      </div>
      <div className="basis-4/12">
        <div className="flex justify-end">
          <LogIn />
        </div>
      </div>
    </div>
  );
}
